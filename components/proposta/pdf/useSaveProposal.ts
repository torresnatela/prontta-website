'use client';

import { useCallback, useState } from 'react';
import { saveProposal, type SaveProposalResult } from '@/app/proposta/actions';
import type { CompanyFormValues } from '@/lib/proposals/schemas';
import {
  useConsultationsSummary,
  useDRE,
  useProgramsSummary,
  useProposal,
  useProposalTotals,
} from '../state/ProposalProvider';
import type { ProposalPDFPayload } from './types';

/**
 * Monta o MESMO ProposalPDFPayload que o gerador de PDF usa (a partir dos hooks
 * derivados do Context) e persiste a proposta via server action. Não altera o
 * reducer nem o fluxo efêmero do simulador.
 */
export function useSaveProposal() {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  const programs = useProgramsSummary();
  const totals = useProposalTotals();
  const dre = useDRE();
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (company: CompanyFormValues): Promise<SaveProposalResult> => {
      setSaving(true);
      try {
        const dateLabel = new Date().toLocaleDateString('pt-BR');
        const payload: ProposalPDFPayload = {
          state,
          consultations,
          programs,
          totals,
          dre,
          dateLabel,
        };
        return await saveProposal({ payload, company });
      } catch (err) {
        console.error('[proposta] falha ao salvar', err);
        return { ok: false, error: 'Não foi possível salvar. Tente novamente.' };
      } finally {
        setSaving(false);
      }
    },
    [state, consultations, programs, totals, dre],
  );

  return { save, saving };
}
