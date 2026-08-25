'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ProposalPDFPayload } from './pdf/types';

/**
 * Gera e baixa o PDF a partir do SNAPSHOT salvo (números congelados no momento
 * do salvamento). Reusa o mesmo caminho client-side do simulador.
 */
export function DownloadProposalButton({ payload }: { payload: ProposalPDFPayload }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { generateProposalPDF } = await import('./pdf/generate');
      await generateProposalPDF(payload);
    } catch (err) {
      console.error('[proposta] falha ao gerar PDF salvo', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="primary" size="md" onClick={handleDownload} isLoading={loading}>
      {!loading && <Download className="mr-2 h-5 w-5" />}
      {loading ? 'Gerando…' : 'Baixar PDF'}
    </Button>
  );
}
