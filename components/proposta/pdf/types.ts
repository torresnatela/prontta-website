import type {
  ConsultationsSummary,
  DREResult,
  ProgramsSummary,
  ProposalTotals,
} from '@/lib/pricing';
import type { BenefitCost, ProgramsMonthlySummary, ReturnEstimate } from '@/lib/empresa/pricing';
import type { ProposalNarrative } from '@/lib/proposta/narrative';
import type { ProposalState } from '../state/reducer';

/** Os números do benefício — presentes só quando `state.mode === 'beneficio'`. */
export interface BenefitPDFData {
  cost: BenefitCost;
  programsMonthly: ProgramsMonthlySummary;
  roi: ReturnEstimate;
}

/** Tudo que o template de PDF precisa — já derivado, para não recalcular no render. */
export interface ProposalPDFPayload {
  state: ProposalState;
  consultations: ConsultationsSummary;
  programs: ProgramsSummary;
  totals: ProposalTotals;
  /**
   * DRE do parceiro. Continua sendo calculada nos dois modos porque o cálculo é
   * barato e o payload é o mesmo tipo — mas no modo benefício ela NÃO é
   * renderizada em lugar nenhum: a empresa não revende, logo não tem P&L.
   */
  dre: DREResult;
  /** Texto institucional já resolvido pelo modo e pelo modelo de atendimento. */
  narrative: ProposalNarrative;
  benefit?: BenefitPDFData;
  /** Data de emissão formatada (pt-BR). Gerada no cliente para evitar Date no render. */
  dateLabel: string;
}
