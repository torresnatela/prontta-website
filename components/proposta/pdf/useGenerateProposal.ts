'use client';

import { useCallback, useState } from 'react';
import { useProposal } from '../state/ProposalProvider';
import { usePDFPayload } from './usePDFPayload';

/** Reúne o estado + resumos e dispara o download do PDF da proposta. */
export function useGenerateProposal() {
  const { state } = useProposal();
  const buildPayload = usePDFPayload();
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const { generateProposalPDF } = await import('./generate');
      await generateProposalPDF(buildPayload(new Date().toLocaleDateString('pt-BR')));
    } catch (error) {
      console.error('[proposta] falha ao gerar PDF', error);
    } finally {
      setGenerating(false);
    }
  }, [buildPayload]);

  return { generate, generating, mode: state.mode };
}
