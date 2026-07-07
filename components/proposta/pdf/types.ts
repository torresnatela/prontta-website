import type {
  ConsultationsSummary,
  DREResult,
  ProgramsSummary,
  ProposalTotals,
} from '@/lib/pricing';
import type { ProposalState } from '../state/reducer';

/** Tudo que o template de PDF precisa — já derivado, para não recalcular no render. */
export interface ProposalPDFPayload {
  state: ProposalState;
  consultations: ConsultationsSummary;
  programs: ProgramsSummary;
  totals: ProposalTotals;
  dre: DREResult;
}
