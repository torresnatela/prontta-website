'use client';

import { useCallback, useState } from 'react';
import {
  useConsultationsSummary,
  useDRE,
  useProgramsSummary,
  useProposal,
  useProposalTotals,
} from '../state/ProposalProvider';

/** Reúne o estado + resumos e dispara o download do PDF da proposta. */
export function useGenerateProposal() {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  const programs = useProgramsSummary();
  const totals = useProposalTotals();
  const dre = useDRE();
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const { generateProposalPDF } = await import('./generate');
      const dateLabel = new Date().toLocaleDateString('pt-BR');
      await generateProposalPDF({ state, consultations, programs, totals, dre, dateLabel });
    } catch (error) {
      console.error('[proposta] falha ao gerar PDF', error);
    } finally {
      setGenerating(false);
    }
  }, [state, consultations, programs, totals, dre]);

  return { generate, generating };
}
