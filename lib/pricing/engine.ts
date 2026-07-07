import {
  HOURS_PER_SHIFT,
  PARTNER_DIVISOR,
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

/** Arredonda para cima ao múltiplo de `step` (padrão R$ 50), como o CEILING da planilha. */
export function ceilToStep(value: number, step: number = PRICE_STEP): number {
  if (value <= 0) return 0;
  return Math.ceil(value / step - FLOAT_EPSILON) * step;
}

/** Preço por consulta: (valor-hora ÷ consultas/hora do plano) ÷ divisor 0,37, arred. p/ cima. */
export function getConsultationPrice(specialtyId: string, plan: PlanId): number {
  const specialty = getSpecialty(specialtyId);
  return ceilToStep(specialty.valorHora / specialty.consultsPerHour[plan] / PRICE_FORMATION_DIVISOR);
}

/** Múltiplo de compra na agenda dedicada: consultas/hora × 4h do plantão, arred. p/ cima. */
export function getShiftMultiple(specialtyId: string, plan: PlanId): number {
  const specialty = getSpecialty(specialtyId);
  return ceilToStep(specialty.consultsPerHour[plan] * HOURS_PER_SHIFT, 1);
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

export interface ConsultationsSummary {
  lines: Array<{
    lineId: string;
    unitPrice: number;
    lineTotal: number;
    /** Validação de plantão — null em agenda compartilhada. */
    validation: LineValidation | null;
  }>;
  /** Σ quantidade × preço unitário (custo das consultas). */
  subtotalCost: number;
  /** Maior ciclo entre as linhas (meses); 0 sem linhas. */
  blockCycleMonths: number;
  /** Total de consultas ÷ ciclo do bloco (fração bruta). */
  consultationsPerMonth: number;
  /** Preço das consultas ao paciente: custo ÷ 0,70, arred. p/ cima. */
  patientPrice: number;
  /** Software mensal devido (0 quando isento ou sem consultas). */
  softwareMonthlyFee: number;
}

/** Consolida o bloco "monta consultas" no plano de referência escolhido. */
export function summarizeConsultations(
  lines: ConsultationLine[],
  plan: PlanId,
): ConsultationsSummary {
  const summarizedLines = lines.map((line) => {
    const unitPrice = getConsultationPrice(line.specialtyId, plan);
    return {
      lineId: line.id,
      unitPrice,
      lineTotal: line.quantity * unitPrice,
      validation:
        line.agenda === 'dedicada'
          ? validateDedicatedQuantity(line.specialtyId, plan, line.quantity)
          : null,
    };
  });

  const subtotalCost = summarizedLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const blockCycleMonths = lines.length ? Math.max(...lines.map((l) => l.cycleMonths)) : 0;
  const consultationsPerMonth = blockCycleMonths > 0 ? totalQuantity / blockCycleMonths : 0;
  const softwareMonthlyFee =
    totalQuantity > 0 && consultationsPerMonth < SOFTWARE_EXEMPTION_THRESHOLD
      ? SOFTWARE_MONTHLY_FEE
      : 0;

  return {
    lines: summarizedLines,
    subtotalCost,
    blockCycleMonths,
    consultationsPerMonth,
    patientPrice: ceilToStep(subtotalCost / PARTNER_DIVISOR),
    softwareMonthlyFee,
  };
}

/** Preço oficial V8 do programa ao paciente no ciclo. */
export function getProgramPrice(programId: string, cycle: Cycle): number {
  return getProgram(programId).priceByCycle[cycle];
}

/** Mensalidade do programa: preço do ciclo ÷ meses. */
export function getProgramMonthly(programId: string, cycle: Cycle): number {
  return getProgramPrice(programId, cycle) / cycle;
}

export interface ProgramsSummary {
  items: Array<{
    selectionId: string;
    unitPrice: number;
    monthly: number;
    total: number;
  }>;
  subtotal: number;
}

/** Consolida os programas escolhidos. */
export function summarizePrograms(selections: ProgramSelection[]): ProgramsSummary {
  const items = selections.map((selection) => {
    const unitPrice = getProgramPrice(selection.programId, selection.cycle);
    return {
      selectionId: selection.id,
      unitPrice,
      monthly: getProgramMonthly(selection.programId, selection.cycle),
      total: unitPrice * selection.quantity,
    };
  });
  return { items, subtotal: items.reduce((sum, i) => sum + i.total, 0) };
}

export interface ProposalTotals {
  consultationsPatientPrice: number;
  programsSubtotal: number;
  /** Total do contrato ao paciente: consultas + programas. */
  totalContractValue: number;
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
    programsSubtotal: programs.subtotal,
    totalContractValue: consultations.patientPrice + programs.subtotal,
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
  totalContractValue: number;
  proposalsPerMonth: number;
  /** Impostos sobre a receita, em % (ex.: 6). */
  taxPercent: number;
  expenses: DREExpenses;
  softwareMonthlyFee: number;
}

export interface DREResult {
  receitaBruta: number;
  /** Rótulo na UI/PDF: "(−) Custo Prontta (serviços médicos e plataforma)". */
  custoProntta: number;
  impostos: number;
  software: number;
  /** Impostos + despesas editáveis + software. */
  totalDespesas: number;
  resultadoLiquido: number;
  /** Margem líquida sobre a receita, em % (0 quando receita é 0). */
  margemLiquidaPct: number;
}

/** DRE mensal do simulador (termos neutros — nunca exibir remuneração de parceiro). */
export function calculateDRE(inputs: DREInputs): DREResult {
  const receitaBruta = inputs.totalContractValue * inputs.proposalsPerMonth;
  const custoProntta = receitaBruta * PARTNER_DIVISOR;
  const impostos = receitaBruta * (inputs.taxPercent / 100);
  const despesasEditaveis = Object.values(inputs.expenses).reduce((sum, v) => sum + v, 0);
  const totalDespesas = impostos + despesasEditaveis + inputs.softwareMonthlyFee;
  const resultadoLiquido = receitaBruta - custoProntta - totalDespesas;
  return {
    receitaBruta,
    custoProntta,
    impostos,
    software: inputs.softwareMonthlyFee,
    totalDespesas,
    resultadoLiquido,
    margemLiquidaPct: receitaBruta > 0 ? (resultadoLiquido / receitaBruta) * 100 : 0,
  };
}
