import {
  HOURS_PER_SHIFT,
  PLATFORM_FEE_BY_CYCLE,
  PRICE_FORMATION_DIVISOR,
  PRICE_STEP,
  SOFTWARE_EXEMPTION_THRESHOLD,
  SOFTWARE_MONTHLY_FEE,
} from './constants';
import { getProgram } from './programs';
import { getSpecialty } from './specialties';
import type { ConsultationLine, Cycle, Implantation, PlanId, ProgramSelection } from './types';

/** Compensa ruído de ponto flutuante antes do arredondamento para cima. */
const FLOAT_EPSILON = 1e-9;

/** Arredonda para cima ao múltiplo de `step` (padrão R$ 5), como o CEILING da planilha. */
export function ceilToStep(value: number, step: number = PRICE_STEP): number {
  if (value <= 0) return 0;
  return Math.ceil(value / step - FLOAT_EPSILON) * step;
}

/** Custo por consulta: (valor-hora ÷ consultas/hora do plano) ÷ divisor 0,37, arred. p/ cima. */
export function getConsultationCost(specialtyId: string, plan: PlanId): number {
  const specialty = getSpecialty(specialtyId);
  return ceilToStep(specialty.valorHora / specialty.consultsPerHour[plan] / PRICE_FORMATION_DIVISOR);
}

/** Preço de venda ao paciente, por consulta: custo ÷ (1 − margem), arred. p/ cima. */
export function getConsultationSellPrice(
  specialtyId: string,
  plan: PlanId,
  consultaMargin: number,
): number {
  return ceilToStep(getConsultationCost(specialtyId, plan) / (1 - consultaMargin));
}

/** Múltiplo de compra na agenda dedicada: consultas/hora × 4h do plantão, arred. p/ cima. */
export function getShiftMultiple(specialtyId: string, plan: PlanId): number {
  const specialty = getSpecialty(specialtyId);
  return Math.ceil(specialty.consultsPerHour[plan] * HOURS_PER_SHIFT);
}

export interface LineValidation {
  ok: boolean;
  /** Múltiplo exigido pelo plantão da especialidade no plano. */
  multiple: number;
  /** Quantidade de plantões fechados quando válido; 0 quando inválido. */
  shifts: number;
}

/** Valida a quantidade de uma linha em agenda dedicada (deve fechar plantões). */
export function validateDedicatedQuantity(
  specialtyId: string,
  plan: PlanId,
  quantity: number,
): LineValidation {
  const multiple = getShiftMultiple(specialtyId, plan);
  const ok = quantity > 0 && quantity % multiple === 0;
  return { ok, multiple, shifts: ok ? quantity / multiple : 0 };
}

export interface ConsultationLineSummary {
  lineId: string;
  plan: PlanId;
  /** Custo unitário (repasse por consulta). */
  unitCost: number;
  /** Preço unitário de venda ao paciente (já com a margem). */
  unitSell: number;
  /** unitSell × quantidade. */
  lineSell: number;
  /** unitCost × quantidade. */
  lineCost: number;
  /** Validação de plantão — null em agenda compartilhada. */
  validation: LineValidation | null;
}

export interface ConsultationsSummary {
  lines: ConsultationLineSummary[];
  /** Σ custo unitário × quantidade (repasse das consultas à Prontta). */
  subtotalCost: number;
  /** Preço das consultas ao paciente: Σ preço de venda unitário × quantidade. */
  patientPrice: number;
  /** Total de consultas do mix (tratado como consultas/mês). */
  totalQuantity: number;
  /** Software mensal devido (0 quando isento ou sem consultas). */
  softwareMonthlyFee: number;
}

/** Consolida o bloco de consultas — cada linha tem seu próprio plano e agenda. */
export function summarizeConsultations(
  lines: ConsultationLine[],
  consultaMargin: number,
): ConsultationsSummary {
  const summarizedLines: ConsultationLineSummary[] = lines.map((line) => {
    const unitCost = getConsultationCost(line.specialtyId, line.plan);
    const unitSell = getConsultationSellPrice(line.specialtyId, line.plan, consultaMargin);
    return {
      lineId: line.id,
      plan: line.plan,
      unitCost,
      unitSell,
      lineSell: line.quantity * unitSell,
      lineCost: line.quantity * unitCost,
      validation:
        line.agenda === 'dedicada'
          ? validateDedicatedQuantity(line.specialtyId, line.plan, line.quantity)
          : null,
    };
  });

  const subtotalCost = summarizedLines.reduce((sum, l) => sum + l.lineCost, 0);
  const patientPrice = summarizedLines.reduce((sum, l) => sum + l.lineSell, 0);
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const softwareMonthlyFee =
    totalQuantity > 0 && totalQuantity < SOFTWARE_EXEMPTION_THRESHOLD ? SOFTWARE_MONTHLY_FEE : 0;

  return { lines: summarizedLines, subtotalCost, patientPrice, totalQuantity, softwareMonthlyFee };
}

/** Repasse do programa à Prontta no ciclo: custo-base + fee de plataforma. */
export function getProgramRepasse(programId: string, cycle: Cycle): number {
  return getProgram(programId).costByCycle[cycle] + PLATFORM_FEE_BY_CYCLE[cycle];
}

/** Preço do programa ao paciente no ciclo: repasse ÷ (1 − margem), arred. p/ cima. */
export function getProgramSellPrice(programId: string, cycle: Cycle, programaMargin: number): number {
  return ceilToStep(getProgramRepasse(programId, cycle) / (1 - programaMargin));
}

/**
 * Preço de tabela oficial ao paciente (coluna "Preço paciente V8" da planilha).
 *
 * Diferente de `getProgramSellPrice`, que deriva o preço da margem escolhida pelo
 * parceiro: este é o número comercial fechado, com mensalidade redonda. Use-o
 * como REFERÊNCIA sugerida, nunca como o preço cobrado.
 */
export function getProgramOfficialPrice(programId: string, cycle: Cycle): number {
  return getProgram(programId).patientPriceByCycle[cycle];
}

/** Mensalidade de tabela oficial: preço V8 do ciclo ÷ meses do ciclo. */
export function getProgramOfficialMonthly(programId: string, cycle: Cycle): number {
  return getProgramOfficialPrice(programId, cycle) / cycle;
}

export interface ProgramItemSummary {
  selectionId: string;
  /** Preço unitário de venda ao paciente (com a margem). */
  unitSell: number;
  /** Repasse unitário à Prontta (custo-base + fee). */
  unitRepasse: number;
  totalSell: number;
  totalRepasse: number;
}

export interface ProgramsSummary {
  items: ProgramItemSummary[];
  /** Σ preço de venda × quantidade. */
  subtotalSell: number;
  /** Σ repasse × quantidade. */
  subtotalRepasse: number;
}

/** Consolida os programas escolhidos. */
export function summarizePrograms(
  selections: ProgramSelection[],
  programaMargin: number,
): ProgramsSummary {
  const items: ProgramItemSummary[] = selections.map((selection) => {
    const unitSell = getProgramSellPrice(selection.programId, selection.cycle, programaMargin);
    const unitRepasse = getProgramRepasse(selection.programId, selection.cycle);
    return {
      selectionId: selection.id,
      unitSell,
      unitRepasse,
      totalSell: unitSell * selection.quantity,
      totalRepasse: unitRepasse * selection.quantity,
    };
  });
  return {
    items,
    subtotalSell: items.reduce((sum, i) => sum + i.totalSell, 0),
    subtotalRepasse: items.reduce((sum, i) => sum + i.totalRepasse, 0),
  };
}

export interface ProposalTotals {
  consultationsPatientPrice: number;
  programsSubtotal: number;
  /** Total simulado ao paciente: consultas + programas. */
  totalContractValue: number;
  /** Repasse total à Prontta: custo das consultas + repasse dos programas. */
  repasse: number;
  implantation: Implantation;
  softwareMonthlyFee: number;
}

/** Consolidador: junta consultas e programas no total que alimenta a DRE. */
export function consolidateProposal(
  consultations: ConsultationsSummary,
  programs: ProgramsSummary,
  implantation: Implantation,
): ProposalTotals {
  return {
    consultationsPatientPrice: consultations.patientPrice,
    programsSubtotal: programs.subtotalSell,
    totalContractValue: consultations.patientPrice + programs.subtotalSell,
    repasse: consultations.subtotalCost + programs.subtotalRepasse,
    implantation,
    softwareMonthlyFee: consultations.softwareMonthlyFee,
  };
}

export interface DREExpenses {
  pessoal: number;
  aluguel: number;
  fixas: number;
  marketing: number;
  outras: number;
}

export interface DREInputs {
  /** Receita ao paciente com este mix (o mix já representa um mês). */
  totalContractValue: number;
  /** Repasse à Prontta. */
  repasse: number;
  /** Impostos sobre a receita, em % (ex.: 6). */
  taxPercent: number;
  expenses: DREExpenses;
  softwareMonthlyFee: number;
}

export interface DREResult {
  receitaBruta: number;
  /** Rótulo na UI/PDF: "Repasse à Prontta". */
  repasse: number;
  /** Receita − repasse. */
  margemBruta: number;
  impostos: number;
  software: number;
  /** Impostos + despesas editáveis + software. */
  totalDespesas: number;
  resultadoLiquido: number;
  /** Margem líquida sobre a receita, em % (0 quando receita é 0). */
  margemLiquidaPct: number;
}

/** DRE mensal do simulador — P&L do parceiro (o mix montado já é o mês). */
export function calculateDRE(inputs: DREInputs): DREResult {
  const receitaBruta = inputs.totalContractValue;
  const margemBruta = receitaBruta - inputs.repasse;
  const impostos = receitaBruta * (inputs.taxPercent / 100);
  const despesasEditaveis = Object.values(inputs.expenses).reduce((sum, v) => sum + v, 0);
  const totalDespesas = impostos + despesasEditaveis + inputs.softwareMonthlyFee;
  const resultadoLiquido = margemBruta - totalDespesas;
  return {
    receitaBruta,
    repasse: inputs.repasse,
    margemBruta,
    impostos,
    software: inputs.softwareMonthlyFee,
    totalDespesas,
    resultadoLiquido,
    margemLiquidaPct: receitaBruta > 0 ? (resultadoLiquido / receitaBruta) * 100 : 0,
  };
}
