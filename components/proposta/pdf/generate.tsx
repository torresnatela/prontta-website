'use client';

import { pdf } from '@react-pdf/renderer';
import type { ProposalPDFPayload } from './types';

/** Gera e baixa o PDF da proposta. Import dinâmico mantém o react-pdf fora do chunk inicial. */
export async function generateProposalPDF(payload: ProposalPDFPayload) {
  const { ProposalPDF } = await import('./ProposalPDF');
  const blob = await pdf(<ProposalPDF payload={payload} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `proposta-prontta-saude-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
