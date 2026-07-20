// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';
import {
  calculateDRE,
  consolidateProposal,
  summarizeConsultations,
  summarizePrograms,
} from '@/lib/pricing';
import { initialProposalState } from '../state/reducer';
import { ProposalPDF } from './ProposalPDF';
import type { ProposalPDFPayload } from './types';

function buildPayload(): ProposalPDFPayload {
  const state = initialProposalState;
  const consultations = summarizeConsultations(state.consultationLines, state.margins.consulta);
  const programs = summarizePrograms(state.programSelections, state.margins.programa);
  const totals = consolidateProposal(consultations, programs, state.implantation);
  const dre = calculateDRE({
    totalContractValue: totals.totalContractValue,
    repasse: totals.repasse,
    taxPercent: state.dre.taxPercent,
    expenses: state.dre.expenses,
    softwareMonthlyFee: totals.softwareMonthlyFee,
  });
  return { state, consultations, programs, totals, dre, dateLabel: '20/07/2026' };
}

describe('ProposalPDF (render real via @react-pdf)', () => {
  it('renderiza um PDF válido a partir do estado semente', async () => {
    const buffer = await renderToBuffer(<ProposalPDF payload={buildPayload()} />);
    // Cabeçalho de arquivo PDF.
    expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    // 4 páginas (capa, quem somos, sua proposta, segurança jurídica).
    const pageCount = buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
    expect(pageCount).toBe(4);
  }, 30000);
});
