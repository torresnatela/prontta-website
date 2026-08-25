import {
  calculateDRE,
  ceilToStep,
  clampCount,
  clampMoney,
  clampPercent,
  getConsultationSellPrice,
  getProgramRepasse,
  getProgramSellPrice,
  getSpecialty,
  DEFAULT_CONSULTA_MARGIN,
  DEFAULT_PROGRAMA_MARGIN,
  IMPLANTATION_RANGE,
  MARGIN_MAX,
  PLATFORM_FEE_BY_CYCLE,
  type Cycle,
  type DREExpenses,
  type DREResult,
  type Implantation,
} from '@/lib/pricing';
import {
  ACADEMIA_CYCLES,
  ACADEMIA_PROGRAMS,
  getAcademiaProgram,
  type AcademiaProgramId,
} from './catalog';
import type { AcademiaOfferParams } from './params';

/**
 * Camada COMERCIAL do nicho academias, composta sobre `lib/pricing`.
 *
 * Regra de ouro: nenhuma tabela de preço mora aqui. Custo-base, fee de plataforma,
 * composição e arredondamento vêm do engine oficial (`PRICING_MODEL_VERSION`).
 * Este módulo só combina esses números com as alavancas do dono da academia
 * (alunos aderentes, margem, comissão do personal).
 *
 * O que o engine NÃO tinha e nasce aqui:
 *  - comissão do personal trainer (entra no denominador do markup);
 *  - visão mensal (o engine precifica o CICLO; a academia vende mensalidade);
 *  - volume de alunos.
 */

/** Plano usado para precificar consultas no nicho academia. */
const ACADEMIA_PLAN = 'popular' as const;

/**
 * As duas margens apontam para o mesmo 30% desde que a planilha oficial foi
 * conferida: o modelo tem UM ganho de parceiro sobre o serviço (aba 1, item C),
 * válido para módulos de programa e para consulta avulsa.
 *
 * Continuam como constantes separadas de propósito — são decisões comerciais
 * distintas e podem divergir de novo sem que este arquivo precise mudar.
 */
const MODULE_MARGIN = DEFAULT_PROGRAMA_MARGIN;
const EXTRA_CONSULTATION_MARGIN = DEFAULT_CONSULTA_MARGIN;

export const OWNER_MARGIN_MAX_PERCENT = 70;
export const OWNER_COMMISSION_MAX_PERCENT = 20;
export const DEFAULT_OWNER_MARGIN_PERCENT = 30;
export const DEFAULT_OWNER_COMMISSION_PERCENT = 5;

/** Base de alunos usada nos cenários de conversão (1% / 3% / 5%). */
export const DEFAULT_BASE_MEMBERS = 800;
export const DEFAULT_CONVERSION_RATES: readonly number[] = [1, 3, 5];

// ---------------------------------------------------------------------------
// Simulador do dono da academia
// ---------------------------------------------------------------------------

export interface OwnerSimulatorInput {
  programId: AcademiaProgramId;
  cycle: Cycle;
  /** Alunos aderentes ao programa. */
  students: number;
  /** Quantas dessas adesões foram indicadas por um personal (0..students). */
  personalSales: number;
  ownerMarginPercent: number;
  personalCommissionPercent: number;
  /** Mensalidade digitada à mão. `null` = derivar do markup. */
  manualMonthlyPrice: number | null;
}

/** Como cada mensalidade se divide entre os três lados. */
export interface OwnerSaleSplit {
  associadoPays: number;
  prontta: number;
  personal: number;
  academia: number;
}

/** Percentuais da receita mensal (para a barra de mix). */
export interface OwnerRevenueMix {
  pronttaPercent: number;
  personalPercent: number;
  academiaPercent: number;
}

export interface OwnerSimulatorResult {
  /** Repasse à Prontta no ciclo inteiro (custo-base + fee de plataforma). */
  repasseCycle: number;
  /** Preço ao associado no ciclo — regra oficial: ceil R$ 5 sobre o TOTAL. */
  cycleSellTotal: number;
  monthlyPrice: number;
  pronttaMonthly: number;
  monthlyRevenue: number;
  cycleRevenue: number;
  pronttaMonthlyTotal: number;
  pronttaCycleTotal: number;
  personalPerSale: number;
  personalCommissionMonthly: number;
  personalCommissionCycle: number;
  academyProfitMonthly: number;
  academyProfitCycle: number;
  /** Lucro do ciclo ÷ faturamento do ciclo × 100 (0 quando não há receita). */
  effectiveMarginPercent: number;
  /**
   * Margem por venda re-derivada do preço EM USO. Difere da margem nominal
   * porque o `ceilToStep` arredonda o total do ciclo para cima.
   */
  resolvedOwnerMarginPercent: number;
  priceIsManual: boolean;
  split: OwnerSaleSplit;
  mix: OwnerRevenueMix;
}

/**
 * Reexportados de `lib/pricing/clamps` — nasceram aqui e foram promovidos
 * quando `lib/empresa` passou a precisar dos mesmos guardas. O reducer da UI
 * (`components/academias/simulador/state`) continua importando daqui.
 */
export { clampCount, clampMoney, clampPercent } from '@/lib/pricing';

export function simulateAcademiaOwner(input: OwnerSimulatorInput): OwnerSimulatorResult {
  const ownerMarginPercent = clampPercent(input.ownerMarginPercent, OWNER_MARGIN_MAX_PERCENT);
  const commissionPercent = clampPercent(
    input.personalCommissionPercent,
    OWNER_COMMISSION_MAX_PERCENT,
  );
  const students = clampCount(input.students);
  const personalSales = Math.min(students, clampCount(input.personalSales));

  const repasseCycle = getProgramRepasse(input.programId, input.cycle);
  const pronttaMonthly = repasseCycle / input.cycle;

  // Markup oficial, com a comissão do personal DENTRO do denominador: é assim
  // que a margem líquida do dono cai no alvo depois de pagar o personal.
  const markupDivisor = Math.max(0.1, 1 - (ownerMarginPercent + commissionPercent) / 100);
  const derivedCycleTotal = ceilToStep(repasseCycle / markupDivisor);

  const priceIsManual =
    input.manualMonthlyPrice !== null &&
    Number.isFinite(input.manualMonthlyPrice) &&
    input.manualMonthlyPrice > 0;

  const monthlyPrice = priceIsManual
    ? (input.manualMonthlyPrice as number)
    : derivedCycleTotal / input.cycle;
  const cycleSellTotal = priceIsManual ? monthlyPrice * input.cycle : derivedCycleTotal;

  const monthlyRevenue = students * monthlyPrice;
  const cycleRevenue = monthlyRevenue * input.cycle;
  const pronttaMonthlyTotal = students * pronttaMonthly;
  const pronttaCycleTotal = pronttaMonthlyTotal * input.cycle;

  const personalPerSale = monthlyPrice * (commissionPercent / 100);
  const personalCommissionMonthly = personalSales * personalPerSale;
  const personalCommissionCycle = personalCommissionMonthly * input.cycle;

  const academyProfitMonthly = monthlyRevenue - pronttaMonthlyTotal - personalCommissionMonthly;
  const academyProfitCycle = academyProfitMonthly * input.cycle;

  const resolvedOwnerMarginPercent =
    monthlyPrice > 0 ? (1 - pronttaMonthly / monthlyPrice - commissionPercent / 100) * 100 : 0;

  // A barra satura quando o preço é manual e cai abaixo do custo Prontta.
  const pronttaPercent =
    monthlyRevenue > 0 ? Math.min(100, (pronttaMonthlyTotal / monthlyRevenue) * 100) : 0;
  const personalPercent =
    monthlyRevenue > 0 ? Math.min(100, (personalCommissionMonthly / monthlyRevenue) * 100) : 0;

  return {
    repasseCycle,
    cycleSellTotal,
    monthlyPrice,
    pronttaMonthly,
    monthlyRevenue,
    cycleRevenue,
    pronttaMonthlyTotal,
    pronttaCycleTotal,
    personalPerSale,
    personalCommissionMonthly,
    personalCommissionCycle,
    academyProfitMonthly,
    academyProfitCycle,
    effectiveMarginPercent: cycleRevenue > 0 ? (academyProfitCycle / cycleRevenue) * 100 : 0,
    resolvedOwnerMarginPercent,
    priceIsManual,
    split: {
      associadoPays: monthlyPrice,
      prontta: pronttaMonthly,
      personal: personalPerSale,
      academia: monthlyPrice - pronttaMonthly - personalPerSale,
    },
    mix: {
      pronttaPercent,
      personalPercent,
      academiaPercent: Math.max(0, 100 - pronttaPercent - personalPercent),
    },
  };
}

export interface ConversionScenario {
  label: string;
  ratePercent: number;
  students: number;
  academyMonthlyProfit: number;
  academyCycleProfit: number;
}

const SCENARIO_LABELS = ['Conservador', 'Provável', 'Expansão'];

/**
 * "E se X% da minha base aderir?" — assume comissão em TODAS as vendas
 * (cenário pessimista para o dono, então o número não decepciona depois).
 */
export function buildConversionScenarios(
  result: OwnerSimulatorResult,
  cycle: Cycle,
  baseMembers: number = DEFAULT_BASE_MEMBERS,
  ratesPercent: readonly number[] = DEFAULT_CONVERSION_RATES,
): ConversionScenario[] {
  const base = clampCount(baseMembers);
  return ratesPercent.map((ratePercent, index) => {
    const students = Math.round((base * ratePercent) / 100);
    const academyMonthlyProfit = students * result.split.academia;
    return {
      label: SCENARIO_LABELS[index] ?? `${ratePercent}%`,
      ratePercent,
      students,
      academyMonthlyProfit,
      academyCycleProfit: academyMonthlyProfit * cycle,
    };
  });
}

export interface AcademiaDREInput {
  result: OwnerSimulatorResult;
  taxPercent: number;
  /** Despesas fixas digitadas pelo dono. A comissão é somada a `outras` aqui dentro. */
  expenses: DREExpenses;
}

/**
 * DRE mensal da academia, reaproveitando `calculateDRE` do engine.
 *
 * A comissão do personal entra em `expenses.outras`, NÃO em `repasse`:
 * `DREResult.repasse` é rotulado "Repasse à Prontta" na UI e no PDF, e a comissão
 * nunca chega à Prontta. Isso preserva a reconciliação
 * `margemBruta − comissão === academyProfitMonthly`.
 *
 * `softwareMonthlyFee` é 0 por definição: programas nunca pagam software
 * (ver `SOFTWARE_MONTHLY_FEE` em lib/pricing/constants.ts).
 */
export function calculateAcademiaDRE({
  result,
  taxPercent,
  expenses,
}: AcademiaDREInput): DREResult {
  return calculateDRE({
    totalContractValue: result.monthlyRevenue,
    repasse: result.pronttaMonthlyTotal,
    taxPercent,
    expenses: { ...expenses, outras: expenses.outras + result.personalCommissionMonthly },
    softwareMonthlyFee: 0,
  });
}

// ---------------------------------------------------------------------------
// Página do associado
// ---------------------------------------------------------------------------

export interface PackageLine {
  specialtyId: string;
  specialtyName: string;
  quantity: number;
  /** Preço por consulta no plano popular, já com a margem do produto. */
  unitSellPrice: number;
  lineTotal: number;
}

const buildPackageLine = (
  specialtyId: string,
  quantity: number,
  margin: number = MODULE_MARGIN,
): PackageLine => {
  const unitSellPrice = getConsultationSellPrice(specialtyId, ACADEMIA_PLAN, margin);
  return {
    specialtyId,
    specialtyName: getSpecialty(specialtyId).name,
    quantity,
    unitSellPrice,
    lineTotal: unitSellPrice * quantity,
  };
};

export interface AssociadoBundle {
  cycle: Cycle;
  monthlyPrice: number;
  cycleTotal: number;
  repasseCycle: number;
  /** `true` quando o preço veio de `?preco=` (direto ou reprojetado p/ outro ciclo). */
  fromOwnerPrice: boolean;
  composition: PackageLine[];
}

/**
 * Pacote fechado no ciclo que o associado está olhando.
 *
 * `viewCycle` pode diferir de `offer.ciclo` quando o visitante troca de aba. Como
 * só conhecemos a intenção do dono no ciclo original, re-derivamos a margem dele
 * ali e a reaplicamos nos outros ciclos — mantendo a oferta coerente e honrando
 * o arredondamento oficial de R$ 5.
 */
export function getAssociadoBundle(
  offer: Pick<AcademiaOfferParams, 'programa' | 'ciclo' | 'preco'>,
  viewCycle: Cycle,
): AssociadoBundle {
  const repasseCycle = getProgramRepasse(offer.programa, viewCycle);
  const composition = getAcademiaProgram(offer.programa)
    .program.compositionByCycle[viewCycle].map((item) =>
      buildPackageLine(item.specialtyId, item.quantity),
    );

  let cycleTotal: number;
  let fromOwnerPrice = false;

  if (offer.preco !== null && offer.preco > 0) {
    fromOwnerPrice = true;
    if (viewCycle === offer.ciclo) {
      // Arredonda para o real cheio: `?preco=` carrega a MENSALIDADE, e um total
      // como R$ 4.550 não é representável em 2 casas (379,1666…). Sem isto o
      // link do simulador voltaria R$ 4.550,04 — o risco que o plano previa
      // ("derivar totais sempre de cycleSellTotal"). Todo preço do engine é
      // múltiplo de R$ 5, então o arredondamento recupera a intenção exata.
      cycleTotal = Math.round(offer.preco * offer.ciclo);
    } else {
      const ownerCycleTotal = offer.preco * offer.ciclo;
      const ownerRepasse = getProgramRepasse(offer.programa, offer.ciclo);
      const ownerMargin = Math.min(MARGIN_MAX, Math.max(0, 1 - ownerRepasse / ownerCycleTotal));
      cycleTotal = ceilToStep(repasseCycle / (1 - ownerMargin));
    }
  } else {
    cycleTotal = getProgramSellPrice(offer.programa, viewCycle, DEFAULT_PROGRAMA_MARGIN);
  }

  return {
    cycle: viewCycle,
    cycleTotal,
    monthlyPrice: cycleTotal / viewCycle,
    repasseCycle,
    fromOwnerPrice,
    composition,
  };
}

export interface BuilderModule extends PackageLine {
  moduleId: string;
}

/** Módulos que o associado pode ligar/desligar no "Monte seu pacote". */
export function getBuilderModules(programId: AcademiaProgramId, cycle: Cycle): BuilderModule[] {
  return getAcademiaProgram(programId).program.compositionByCycle[cycle].map((item) => ({
    moduleId: item.specialtyId,
    ...buildPackageLine(item.specialtyId, item.quantity),
  }));
}

export interface CustomPackageResult {
  /** Jornada, pré-triagem com IA e plataforma — sempre incluso. */
  baseModulePrice: number;
  lines: PackageLine[];
  cycleTotal: number;
  monthlyPrice: number;
}

/** Preço do módulo base: o fee de plataforma do ciclo, com a margem padrão. */
export function getBaseModulePrice(cycle: Cycle): number {
  return ceilToStep(PLATFORM_FEE_BY_CYCLE[cycle] / (1 - DEFAULT_PROGRAMA_MARGIN));
}

/**
 * Pacote montado à la carte. Cada módulo é cobrado pelo preço avulso da consulta,
 * então o pacote fechado (que tem desconto de bundle) sai sempre mais barato.
 */
export function priceCustomPackage(
  programId: AcademiaProgramId,
  cycle: Cycle,
  selectedModuleIds: readonly string[],
): CustomPackageResult {
  const baseModulePrice = getBaseModulePrice(cycle);
  const lines = getBuilderModules(programId, cycle)
    .filter((module) => selectedModuleIds.includes(module.moduleId))
    .map(({ moduleId: _moduleId, ...line }) => line);
  const cycleTotal = lines.reduce((sum, line) => sum + line.lineTotal, baseModulePrice);
  return { baseModulePrice, lines, cycleTotal, monthlyPrice: cycleTotal / cycle };
}

export interface BundleComparison {
  bundleCycleTotal: number;
  customCycleTotal: number;
  /** custom − pacote fechado (positivo = o pacote fechado é mais barato). */
  savings: number;
  /** Quanto o pacote fechado economiza sobre o personalizado, em %. */
  bundleDiscountPercent: number;
  /** Quanto o personalizado custa a mais que o pacote fechado, em %. */
  customPremiumPercent: number;
}

export function compareBundleVsCustom(
  bundle: AssociadoBundle,
  custom: CustomPackageResult,
): BundleComparison {
  const savings = custom.cycleTotal - bundle.cycleTotal;
  return {
    bundleCycleTotal: bundle.cycleTotal,
    customCycleTotal: custom.cycleTotal,
    savings,
    bundleDiscountPercent: custom.cycleTotal > 0 ? (savings / custom.cycleTotal) * 100 : 0,
    customPremiumPercent: bundle.cycleTotal > 0 ? (savings / bundle.cycleTotal) * 100 : 0,
  };
}

export interface ExtraSelection {
  specialtyId: string;
  quantity: number;
}

/** Especialidades que aparecem em algum dos 4 programas — universo dos extras. */
export const EXTRA_SPECIALTY_IDS: readonly string[] = Array.from(
  new Set(
    ACADEMIA_PROGRAMS.flatMap((entry) =>
      ACADEMIA_CYCLES.flatMap((cycle) =>
        entry.program.compositionByCycle[cycle].map((item) => item.specialtyId),
      ),
    ),
  ),
).sort();

/**
 * Consultas avulsas fora do pacote — usam a margem de consulta do padrão
 * oficial (30%), que hoje coincide com a de programa.
 */
export function priceExtras(extras: readonly ExtraSelection[]): {
  lines: PackageLine[];
  total: number;
} {
  const lines = extras
    .filter((extra) => extra.quantity > 0)
    .map((extra) =>
      buildPackageLine(extra.specialtyId, clampCount(extra.quantity), EXTRA_CONSULTATION_MARGIN),
    );
  return { lines, total: lines.reduce((sum, line) => sum + line.lineTotal, 0) };
}

// ---------------------------------------------------------------------------
// Implantação e payback
// ---------------------------------------------------------------------------

export interface PaybackRange {
  min: number;
  max: number;
}

export interface AcademiaImplantation {
  /** Valor considerado; 0 quando isento; `null` quando "a combinar". */
  value: number | null;
  /**
   * Meses para o resultado líquido cobrir a implantação.
   * `null` quando o resultado é zero ou negativo (não há payback).
   * Em "a combinar" usa a faixa oficial `IMPLANTATION_RANGE`.
   */
  paybackMonths: PaybackRange | null;
  label: string;
}

/**
 * Payback da taxa única de implantação.
 *
 * A taxa NÃO entra na DRE mensal — é investimento único, exatamente como em
 * `/proposta` (`consolidateProposal` carrega `implantation`, mas `calculateDRE`
 * a ignora). Aqui ela só vira "em quantos meses o lucro paga a implantação".
 */
export function calculateImplantationPayback(
  implantation: Implantation,
  monthlyNetResult: number,
): AcademiaImplantation {
  const months = (value: number): PaybackRange | null =>
    monthlyNetResult > 0 ? { min: value / monthlyNetResult, max: value / monthlyNetResult } : null;

  switch (implantation.mode) {
    case 'isento':
      // Zero independe do lucro: não há investimento a recuperar. Os outros
      // modos devolvem `null` sem lucro porque aí o payback é indefinido —
      // a diferença fica legível por `value` (0 vs. um valor a pagar).
      return { value: 0, paybackMonths: { min: 0, max: 0 }, label: 'Isenta' };

    case 'valor': {
      const value = Number.isFinite(implantation.value) ? Math.max(0, implantation.value) : 0;
      return { value, paybackMonths: months(value), label: 'Valor definido' };
    }

    case 'a_combinar':
    default:
      return {
        value: null,
        paybackMonths:
          monthlyNetResult > 0
            ? {
                min: IMPLANTATION_RANGE.min / monthlyNetResult,
                max: IMPLANTATION_RANGE.max / monthlyNetResult,
              }
            : null,
        label: 'A combinar',
      };
  }
}
