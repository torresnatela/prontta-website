// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';
import {
  calculateDRE,
  consolidateProposal,
  summarizeConsultations,
  summarizePrograms,
} from '@/lib/pricing';
import {
  calculateBenefitCost,
  estimateReturn,
  summarizeProgramsMonthly,
} from '@/lib/empresa/pricing';
import { resolveNarrative } from '@/lib/proposta/narrative';
import { createInitialProposalState, initialProposalState } from '../state/reducer';
import { ProposalPDF } from './ProposalPDF';
import type { ProposalPDFPayload } from './types';

function buildPayload(state = initialProposalState): ProposalPDFPayload {
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
  const narrative = resolveNarrative({
    mode: state.mode,
    clientType: state.clientType,
    serviceModel: state.benefit.serviceModel,
  });

  if (state.mode !== 'beneficio') {
    return { state, consultations, programs, totals, dre, narrative, dateLabel: '20/07/2026' };
  }

  const cost = calculateBenefitCost({
    consultationsMonthly: consultations.patientPrice,
    programSelections: state.programSelections,
    softwareMonthlyFee: consultations.softwareMonthlyFee,
    headcount: state.benefit.headcount,
    adhesionPercent: state.benefit.adhesionPercent,
    funding: state.benefit.funding,
  });

  return {
    state,
    consultations,
    programs,
    totals,
    dre,
    narrative,
    benefit: {
      cost,
      programsMonthly: summarizeProgramsMonthly(state.programSelections),
      roi: estimateReturn({
        ...state.benefit.roi,
        eligible: cost.eligible,
        adherents: cost.adherents,
        companyMonthly: cost.companyMonthly,
      }),
    },
    dateLabel: '20/07/2026',
  };
}

const pageCountOf = (buffer: Buffer) =>
  buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;

describe('ProposalPDF (render real via @react-pdf)', () => {
  it('renderiza um PDF válido a partir do estado semente', async () => {
    const buffer = await renderToBuffer(<ProposalPDF payload={buildPayload()} />);
    // Cabeçalho de arquivo PDF.
    expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    // 5 páginas (capa, quem somos, sua proposta, seu resultado, segurança jurídica).
    expect(pageCountOf(buffer)).toBe(5);
  }, 30000);

  it('renderiza o modo benefício com a mesma estrutura de 5 páginas', async () => {
    const state = createInitialProposalState({ mode: 'beneficio', clientType: 'empresa' });
    const buffer = await renderToBuffer(<ProposalPDF payload={buildPayload(state)} />);
    expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-');
    // A quarta página deixa de ser a DRE e vira custo + retorno, mas continuam 5.
    expect(pageCountOf(buffer)).toBe(5);
  }, 30000);

  it('renderiza o benefício no modelo remoto, sem implantação', async () => {
    const base = createInitialProposalState({ mode: 'beneficio', clientType: 'empresa' });
    const state = {
      ...base,
      benefit: { ...base.benefit, serviceModel: 'remoto' as const },
      implantation: { mode: 'isento' as const },
    };
    const buffer = await renderToBuffer(<ProposalPDF payload={buildPayload(state)} />);
    expect(pageCountOf(buffer)).toBe(5);
  }, 30000);
});
