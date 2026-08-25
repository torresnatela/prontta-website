'use client';

import { useCallback, useState } from 'react';
import { saveProposal, type SaveProposalResult } from '@/app/proposta/actions';
import type { CompanyFormValues } from '@/lib/proposals/schemas';
import { usePDFPayload } from './usePDFPayload';

/**
 * Monta o MESMO ProposalPDFPayload que o gerador de PDF usa e persiste a
 * proposta via server action. Não altera o reducer nem o fluxo efêmero do
 * simulador.
 *
 * ⚠️ AINDA DESLIGADO: nenhum componente renderiza o botão que chama isto (nem
 * em /proposta, nem em /proposta/empresa). Antes de ligar no modo BENEFÍCIO,
 * note que `savePayloadSchema` exige `dre.resultadoLiquido` e a coluna
 * `proposals.resultado_liquido` é NOT NULL — números que não existem para quem
 * compra benefício. Ligar exige migration (coluna anulável + `proposal_mode`) e
 * ramificar o card "Resultado (DRE)" de `app/painel/[id]/page.tsx`. Gravar 0
 * ali corromperia silenciosamente a listagem do painel.
 */
export function useSaveProposal() {
  const buildPayload = usePDFPayload();
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (company: CompanyFormValues): Promise<SaveProposalResult> => {
      setSaving(true);
      try {
        const payload = buildPayload(new Date().toLocaleDateString('pt-BR'));
        return await saveProposal({ payload, company });
      } catch (err) {
        console.error('[proposta] falha ao salvar', err);
        return { ok: false, error: 'Não foi possível salvar. Tente novamente.' };
      } finally {
        setSaving(false);
      }
    },
    [buildPayload],
  );

  return { save, saving };
}
