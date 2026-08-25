'use client';

import { summarizeProgramsMonthly } from '@/lib/empresa/pricing';
import {
  useBenefitCost,
  useBenefitReturn,
  useConsultationsSummary,
  useDRE,
  useProgramsSummary,
  useProposal,
  useProposalNarrative,
  useProposalTotals,
} from '../state/ProposalProvider';
import type { BenefitPDFData, ProposalPDFPayload } from './types';

/**
 * Monta o payload do PDF a partir do estado e dos resumos derivados.
 *
 * Fica num hook próprio porque tanto o download quanto o (ainda desligado)
 * salvamento no painel precisam do MESMO payload — duas montagens divergiriam
 * no dia em que um campo novo entrasse.
 *
 * `dateLabel` não entra aqui: `new Date()` durante o render tornaria o valor
 * dependente do momento da renderização. Quem dispara a ação carimba a data.
 */
export function usePDFPayload(): (dateLabel: string) => ProposalPDFPayload {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  const programs = useProgramsSummary();
  const totals = useProposalTotals();
  const dre = useDRE();
  const narrative = useProposalNarrative();
  const benefitCost = useBenefitCost();
  const benefitReturn = useBenefitReturn();

  return (dateLabel: string) => {
    const benefit: BenefitPDFData | undefined =
      state.mode === 'beneficio'
        ? {
            cost: benefitCost,
            programsMonthly: summarizeProgramsMonthly(state.programSelections),
            roi: benefitReturn,
          }
        : undefined;

    return { state, consultations, programs, totals, dre, narrative, benefit, dateLabel };
  };
}
