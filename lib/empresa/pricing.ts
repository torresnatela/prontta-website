import {
  clampCount,
  clampMoney,
  clampPercent,
  getConsultationCost,
  getProgramRepasse,
  type Cycle,
  type PlanId,
  type ProgramSelection,
} from '@/lib/pricing';

/**
 * Camada COMERCIAL do canal empresa, composta sobre `lib/pricing`.
 *
 * Regra de ouro herdada de `lib/academias/pricing.ts`: nenhuma tabela de preço
 * mora aqui. Custo-base, fee de plataforma e arredondamento vêm do engine
 * oficial. Este módulo só combina esses números com as alavancas do RH —
 * população elegível, adesão, custeio — e com as premissas de retorno.
 *
 * O que o engine NÃO tinha e nasce aqui:
 *  - visão mensal dos programas (o engine precifica o CICLO; o RH aprova um
 *    orçamento mensal);
 *  - rateio do custo entre empresa e colaborador (coparticipação);
 *  - custo per capita (por elegível e por aderente);
 *  - o modelo de retorno estimado.
 *
 * ⚠️ A EMPRESA COMPRA PELO REPASSE, e este módulo lê o repasse direto do engine
 * (`getConsultationCost` / `getProgramRepasse`) em vez de passar pelas funções
 * de preço de venda com margem 0. O simulador ainda roda com
 * `margins = { consulta: 0, programa: 0 }` como cinto de segurança, mas os
 * números da proposta saem daqui — ver `getEmpresaProgramCyclePrice`.
 */

/** Margem usada em todo o canal empresa: ela não revende, logo não há margem. */
export const EMPRESA_MARGIN = 0;

/**
 * Preço de UMA consulta à empresa: o repasse, sem margem nenhuma.
 *
 * Idêntico a `getConsultationSellPrice(id, plan, 0)` — o custo já é múltiplo de
 * R$ 5, então o `ceilToStep` não tem o que arredondar. Existe como função
 * própria para o canal empresa nunca depender desse detalhe.
 */
export const getEmpresaConsultationPrice = (specialtyId: string, plan: PlanId): number =>
  getConsultationCost(specialtyId, plan);

/**
 * Preço de UM ciclo de programa à empresa: o repasse, sem margem nenhuma.
 *
 * ⚠️ NÃO use `getProgramSellPrice(id, cycle, 0)` aqui. Aquele caminho passa pelo
 * `ceilToStep`, e 25 das 36 combinações programa × ciclo têm repasse que não é
 * múltiplo de R$ 5 — Mente em Equilíbrio 6m sairia R$ 1.390 em vez dos R$ 1.386
 * devidos. São centavos de diferença e uma afirmação falsa: a página inteira
 * promete que a empresa paga exatamente o repasse. `pricing.test.ts` trava o
 * contraexemplo para que ninguém "simplifique" isto de volta.
 */
export const getEmpresaProgramCyclePrice = (programId: string, cycle: Cycle): number =>
  getProgramRepasse(programId, cycle);

/** Meses considerados num ano de orçamento. */
export const MONTHS_PER_YEAR = 12;

/**
 * Onde o colaborador é atendido.
 *
 * `ponto_de_acesso`: a empresa cede uma sala; vale implantação e a infra local
 * é responsabilidade dela. `remoto`: o colaborador acessa de onde estiver —
 * sem sala, sem infra local e sem taxa de implantação.
 */
export type ServiceModel = 'ponto_de_acesso' | 'remoto';

export const SERVICE_MODELS: readonly ServiceModel[] = ['ponto_de_acesso', 'remoto'] as const;

export const SERVICE_MODEL_LABELS: Record<ServiceModel, string> = {
  ponto_de_acesso: 'Ponto de acesso na empresa',
  remoto: 'Remoto — de onde o colaborador estiver',
};

/**
 * Modelo de custeio do benefício.
 *
 * Mantido como união nomeada (e não como um percentual solto) porque os três
 * modos são decisões comerciais distintas que aparecem por extenso na proposta
 * e no PDF: "custeio integral" e "coparticipação de 0%" são a mesma conta e
 * conversas diferentes. A matemática, essa sim, tem um caminho só —
 * `employeeSharePercent`.
 */
export type Funding =
  | { mode: 'integral' }
  | { mode: 'coparticipacao'; employeePercent: number }
  | { mode: 'colaborador' };

export type FundingMode = Funding['mode'];

export const FUNDING_MODES: readonly FundingMode[] = [
  'integral',
  'coparticipacao',
  'colaborador',
] as const;

/**
 * ⚠️ O rótulo do modo compartilhado evita a palavra "coparticipação" de
 * propósito: no Brasil ela tem sentido específico de plano de saúde (participação
 * por procedimento, regulada pela ANS), e usá-la aproximaria a proposta
 * exatamente do enquadramento que ela nega. O id interno segue `coparticipacao`.
 */
export const FUNDING_LABELS: Record<FundingMode, string> = {
  integral: 'Integral — a empresa paga 100%',
  coparticipacao: 'Custeio compartilhado — empresa e colaborador dividem',
  colaborador: 'Colaborador — a empresa só oferece o canal',
};

/** Coparticipação sugerida ao abrir o modo, em % do colaborador. */
export const DEFAULT_EMPLOYEE_PERCENT = 30;

/** Percentual do custo que sai do bolso do colaborador — o único caminho da conta. */
export function employeeSharePercent(funding: Funding): number {
  switch (funding.mode) {
    case 'integral':
      return 0;
    case 'colaborador':
      return 100;
    case 'coparticipacao':
      return clampPercent(funding.employeePercent, 100);
  }
}

/** Divisão segura: devolve 0 em vez de NaN/Infinity quando o divisor é 0. */
const per = (total: number, divisor: number): number => (divisor > 0 ? total / divisor : 0);

export interface ProgramMonthlyItem {
  selectionId: string;
  programId: string;
  cycle: Cycle;
  quantity: number;
  /** Preço de UM ciclo à empresa (repasse arredondado, margem 0). */
  cyclePrice: number;
  /** cyclePrice × quantidade — o compromisso contratual do item. */
  cycleTotal: number;
  /** cycleTotal ÷ meses do ciclo — o que pesa no orçamento mensal. */
  monthlyEquivalent: number;
}

export interface ProgramsMonthlySummary {
  items: ProgramMonthlyItem[];
  /** Σ dos equivalentes mensais. */
  monthlyTotal: number;
  /** Σ dos ciclos cheios — o valor que a empresa se compromete a pagar. */
  cycleCommitment: number;
}

/**
 * Amortiza os programas do ciclo para o mês.
 *
 * O engine precifica o CICLO inteiro (3, 6 ou 12 meses) e `consolidateProposal`
 * soma esse valor cheio no total — o que, para o revendedor, é lido como
 * receita do mês. Para o RH isso seria mentira: 4 programas de 6 meses a
 * R$ 1.735 são R$ 6.940 de compromisso, mas ~R$ 1.157 por mês.
 *
 * Mesmo tratamento que `lib/academias/pricing.ts` dá ao dividir o repasse do
 * ciclo pela duração dele.
 */
export function summarizeProgramsMonthly(
  selections: readonly ProgramSelection[],
): ProgramsMonthlySummary {
  const items: ProgramMonthlyItem[] = selections.map((selection) => {
    const cyclePrice = getEmpresaProgramCyclePrice(selection.programId, selection.cycle);
    const cycleTotal = cyclePrice * selection.quantity;
    return {
      selectionId: selection.id,
      programId: selection.programId,
      cycle: selection.cycle,
      quantity: selection.quantity,
      cyclePrice,
      cycleTotal,
      monthlyEquivalent: cycleTotal / selection.cycle,
    };
  });

  return {
    items,
    monthlyTotal: items.reduce((sum, item) => sum + item.monthlyEquivalent, 0),
    cycleCommitment: items.reduce((sum, item) => sum + item.cycleTotal, 0),
  };
}

export interface BenefitCostInput {
  /** Preço mensal das consultas à empresa — `ConsultationsSummary.patientPrice` com margem 0. */
  consultationsMonthly: number;
  programSelections: readonly ProgramSelection[];
  /** Software mensal devido, já calculado pelo engine (0 quando isento). */
  softwareMonthlyFee: number;
  /** Colaboradores elegíveis ao benefício. */
  headcount: number;
  /** Adesão estimada, em % dos elegíveis. */
  adhesionPercent: number;
  funding: Funding;
}

export interface BenefitCost {
  eligible: number;
  /** Elegíveis × adesão, arredondado — quem de fato usa o benefício. */
  adherents: number;
  consultationsMonthly: number;
  programsMonthly: number;
  softwareMonthly: number;
  /** Consultas + programas amortizados + software. */
  monthlyTotal: number;
  annualTotal: number;
  /** Σ dos ciclos cheios de programa — o compromisso, não o mês. */
  cycleCommitment: number;
  employeeSharePercent: number;
  companyMonthly: number;
  employeeMonthly: number;
  /** monthlyTotal ÷ elegíveis — o per capita que o RH leva para aprovação. */
  costPerEligible: number;
  /** monthlyTotal ÷ aderentes — o custo real de quem usa. */
  costPerAdherent: number;
  /** companyMonthly ÷ elegíveis. */
  companyPerEligible: number;
  /** O que sai do bolso de UM colaborador aderente por mês. */
  employeeOutOfPocket: number;
}

/**
 * O custo do benefício.
 *
 * A adesão DIVIDE, não multiplica: o mix montado é o volume mensal que a
 * empresa contrata para toda a população, não um pacote por cabeça. Mudar a
 * adesão não muda o investimento — muda por quantas pessoas ele se reparte.
 */
export function calculateBenefitCost(input: BenefitCostInput): BenefitCost {
  const eligible = clampCount(input.headcount);
  const adhesion = clampPercent(input.adhesionPercent, 100);
  const adherents = Math.round((eligible * adhesion) / 100);

  const programs = summarizeProgramsMonthly(input.programSelections);
  const consultationsMonthly = clampMoney(input.consultationsMonthly);
  const softwareMonthly = clampMoney(input.softwareMonthlyFee);
  const monthlyTotal = consultationsMonthly + programs.monthlyTotal + softwareMonthly;

  const share = employeeSharePercent(input.funding);
  const employeeMonthly = monthlyTotal * (share / 100);
  const companyMonthly = monthlyTotal - employeeMonthly;

  return {
    eligible,
    adherents,
    consultationsMonthly,
    programsMonthly: programs.monthlyTotal,
    softwareMonthly,
    monthlyTotal,
    annualTotal: monthlyTotal * MONTHS_PER_YEAR,
    cycleCommitment: programs.cycleCommitment,
    employeeSharePercent: share,
    companyMonthly,
    employeeMonthly,
    costPerEligible: per(monthlyTotal, eligible),
    costPerAdherent: per(monthlyTotal, adherents),
    companyPerEligible: per(companyMonthly, eligible),
    employeeOutOfPocket: per(employeeMonthly, adherents),
  };
}

/* ------------------------------------------------------------------ *
 *  Retorno estimado
 * ------------------------------------------------------------------ */

/**
 * Dias úteis por mês usados para converter salário mensal em custo do dia
 * parado. 22 é o arredondamento usual do calendário comercial brasileiro.
 */
export const WORKING_DAYS_PER_MONTH = 22;

/**
 * Premissas do retorno — TODAS preenchidas pelo consultor, nenhuma default.
 *
 * ⚠️ Os zeros são deliberados. Projeção de economia é a afirmação mais
 * sensível desta página, e a Prontta não tem número próprio publicado para
 * absenteísmo evitado. Semear percentuais plausíveis os transformaria em
 * "dado da Prontta" no momento em que virassem PDF assinado. Enquanto as
 * premissas estiverem zeradas o bloco de retorno não apresenta resultado —
 * ele pede os números da empresa.
 */
export interface ReturnAssumptions {
  /** Salário médio mensal dos colaboradores (R$). */
  avgSalary: number;
  /**
   * Encargos sobre a folha, em %. Default 0 DELIBERADAMENTE: o percentual varia
   * de 30% a 80% conforme regime e convenção, e quem sabe o número é a
   * contabilidade do cliente. Zero mantém a estimativa conservadora (subestima
   * o custo do dia parado, nunca o contrário).
   */
  payrollChargesPercent: number;
  /** Dias de afastamento por colaborador por ano. */
  absenceDaysPerYear: number;
  /** Redução do afastamento atribuída ao benefício, em %. */
  absenceReductionPercent: number;
  /** Custo per capita do plano de saúde atual (R$/colaborador/mês). 0 = não informado. */
  healthPlanPerCapita: number;
}

export const RETURN_DEFAULTS: ReturnAssumptions = {
  avgSalary: 0,
  payrollChargesPercent: 0,
  absenceDaysPerYear: 0,
  absenceReductionPercent: 0,
  healthPlanPerCapita: 0,
};

export type ReturnAssumptionKey = keyof ReturnAssumptions;

export interface ReturnInput extends ReturnAssumptions {
  eligible: number;
  adherents: number;
  /** O que a empresa desembolsa por mês — a base de comparação do retorno. */
  companyMonthly: number;
}

export interface ReturnEstimate {
  /** false enquanto faltar premissa: a UI mostra o pedido, não um número inventado. */
  hasAbsenceEstimate: boolean;
  hasHealthPlanComparison: boolean;
  /** Salário ÷ 22 — custo de um dia parado. */
  dailyCost: number;
  /** Custo mensal do afastamento na população aderente, hoje. */
  absenceCostMonthly: number;
  /** Parcela desse custo que a premissa de redução atribui ao benefício. */
  absenceSavedMonthly: number;
  /** Gasto mensal atual com plano de saúde (elegíveis × per capita). */
  healthPlanMonthly: number;
  /**
   * Quanto o benefício representa do que a empresa já gasta com plano, em %.
   *
   * ⚠️ É proporção, NUNCA economia. A Prontta não substitui plano de saúde —
   * dizer que substitui seria falso e colidiria frontalmente com o
   * posicionamento "não é plano de saúde" que a própria proposta afirma.
   */
  benefitShareOfHealthPlanPercent: number;
  /** Absenteísmo evitado − desembolso da empresa. */
  netMonthly: number;
  /** Absenteísmo evitado ÷ desembolso da empresa. */
  returnRatio: number;
  /**
   * Redução de afastamento que faria o benefício se pagar sozinho, em %.
   *
   * É o número mais honesto do painel: aritmética pura sobre os dados da
   * própria empresa, sem premissa de eficácia. Inverte o ônus da prova — em vez
   * de a Prontta afirmar uma economia, mostra o que precisaria ser verdade para
   * haver economia, e deixa o RH julgar se é plausível. `null` quando não há
   * custo de absenteísmo informado.
   */
  breakEvenReductionPercent: number | null;
}

/**
 * Retorno estimado do benefício.
 *
 * Modelo deliberadamente magro: um único vetor de ganho (absenteísmo evitado),
 * derivado de premissas que a própria empresa informa, mais uma comparação de
 * ORDEM DE GRANDEZA com o plano de saúde. Presenteísmo e turnover ficaram de
 * fora porque exigiriam coeficientes que teriam de ser inventados.
 */
export function estimateReturn(input: ReturnInput): ReturnEstimate {
  const avgSalary = clampMoney(input.avgSalary);
  const payrollCharges = clampPercent(input.payrollChargesPercent, 500);
  const absenceDaysPerYear = clampMoney(input.absenceDaysPerYear);
  const reduction = clampPercent(input.absenceReductionPercent, 100);
  const healthPlanPerCapita = clampMoney(input.healthPlanPerCapita);
  const companyMonthly = clampMoney(input.companyMonthly);
  const adherents = clampCount(input.adherents);
  const eligible = clampCount(input.eligible);

  const dailyCost = (avgSalary * (1 + payrollCharges / 100)) / WORKING_DAYS_PER_MONTH;
  const absenceCostMonthly = adherents * (absenceDaysPerYear / MONTHS_PER_YEAR) * dailyCost;
  const absenceSavedMonthly = absenceCostMonthly * (reduction / 100);
  const healthPlanMonthly = eligible * healthPlanPerCapita;

  return {
    hasAbsenceEstimate: avgSalary > 0 && absenceDaysPerYear > 0 && reduction > 0 && adherents > 0,
    hasHealthPlanComparison: healthPlanMonthly > 0,
    dailyCost,
    absenceCostMonthly,
    absenceSavedMonthly,
    healthPlanMonthly,
    benefitShareOfHealthPlanPercent: per(companyMonthly, healthPlanMonthly) * 100,
    netMonthly: absenceSavedMonthly - companyMonthly,
    returnRatio: per(absenceSavedMonthly, companyMonthly),
    breakEvenReductionPercent:
      absenceCostMonthly > 0 ? (companyMonthly / absenceCostMonthly) * 100 : null,
  };
}

/* ------------------------------------------------------------------ *
 *  Sementes do simulador
 * ------------------------------------------------------------------ */

export interface BenefitAssumptions {
  serviceModel: ServiceModel;
  headcount: number;
  adhesionPercent: number;
  funding: Funding;
  roi: ReturnAssumptions;
}

/**
 * Com o que a proposta de benefício abre.
 *
 * População e adesão são um ponto de partida plausível para uma empresa de
 * porte médio, editáveis no primeiro passo. As premissas de retorno abrem
 * ZERADAS de propósito — ver `RETURN_DEFAULTS`.
 */
export const BENEFIT_DEFAULTS: BenefitAssumptions = {
  serviceModel: 'ponto_de_acesso',
  headcount: 320,
  adhesionPercent: 45,
  funding: { mode: 'integral' },
  roi: { ...RETURN_DEFAULTS },
};
