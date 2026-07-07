import { describe, expect, it } from 'vitest';
import {
  calculateDRE,
  consolidateProposal,
  summarizeConsultations,
  summarizePrograms,
} from '@/lib/pricing';
import { initialProposalState, proposalReducer } from './reducer';

describe('initialProposalState', () => {
  it('nasce com o mix golden da planilha e reproduz os totais oficiais', () => {
    const s = initialProposalState;
    expect(s.clientType).toBe('clinica');
    expect(s.referencePlan).toBe('popular');
    expect(s.implantation).toEqual({ mode: 'a_combinar' });

    const consultations = summarizeConsultations(s.consultationLines, s.referencePlan);
    const programs = summarizePrograms(s.programSelections);
    const totals = consolidateProposal(consultations, programs, s.implantation);
    expect(totals.totalContractValue).toBe(14600);

    const dre = calculateDRE({
      totalContractValue: totals.totalContractValue,
      proposalsPerMonth: s.dre.proposalsPerMonth,
      taxPercent: s.dre.taxPercent,
      expenses: s.dre.expenses,
      softwareMonthlyFee: totals.softwareMonthlyFee,
    });
    expect(dre.resultadoLiquido).toBe(23133);
  });
});

describe('proposalReducer — consultas', () => {
  it('adiciona, atualiza e remove linhas de consulta', () => {
    let s = proposalReducer(initialProposalState, {
      type: 'ADD_CONSULTATION_LINE',
      line: { id: 'x', specialtyId: 'dermatologia', agenda: 'compartilhada', quantity: 2, cycleMonths: 6 },
    });
    expect(s.consultationLines.some((l) => l.id === 'x')).toBe(true);

    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 5 } });
    expect(s.consultationLines.find((l) => l.id === 'x')?.quantity).toBe(5);

    s = proposalReducer(s, { type: 'REMOVE_CONSULTATION_LINE', id: 'x' });
    expect(s.consultationLines.some((l) => l.id === 'x')).toBe(false);
  });

  it('clampa quantidade para inteiro ≥ 1', () => {
    let s = proposalReducer(initialProposalState, {
      type: 'ADD_CONSULTATION_LINE',
      line: { id: 'x', specialtyId: 'nutricao', agenda: 'compartilhada', quantity: 3, cycleMonths: 6 },
    });
    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 0 } });
    expect(s.consultationLines.find((l) => l.id === 'x')?.quantity).toBe(1);
    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 2.7 } });
    expect(s.consultationLines.find((l) => l.id === 'x')?.quantity).toBe(2);
  });

  it('trocar o plano de referência não altera linhas nem quantidades', () => {
    const s = proposalReducer(initialProposalState, { type: 'SET_REFERENCE_PLAN', plan: 'premium' });
    expect(s.referencePlan).toBe('premium');
    expect(s.consultationLines).toEqual(initialProposalState.consultationLines);
  });
});

describe('proposalReducer — programas', () => {
  it('adiciona, atualiza e remove seleções de programa', () => {
    let s = proposalReducer(initialProposalState, {
      type: 'ADD_PROGRAM_SELECTION',
      selection: { id: 'p1', programId: 'performance', cycle: 3, quantity: 1 },
    });
    expect(s.programSelections.some((p) => p.id === 'p1')).toBe(true);

    s = proposalReducer(s, { type: 'UPDATE_PROGRAM_SELECTION', id: 'p1', patch: { cycle: 12, quantity: 2 } });
    const sel = s.programSelections.find((p) => p.id === 'p1');
    expect(sel?.cycle).toBe(12);
    expect(sel?.quantity).toBe(2);

    s = proposalReducer(s, { type: 'REMOVE_PROGRAM_SELECTION', id: 'p1' });
    expect(s.programSelections.some((p) => p.id === 'p1')).toBe(false);
  });
});

describe('proposalReducer — DRE e demais inputs', () => {
  it('clampa imposto entre 0 e 100 e despesas/propostas em ≥ 0', () => {
    let s = proposalReducer(initialProposalState, { type: 'SET_TAX_PERCENT', value: 150 });
    expect(s.dre.taxPercent).toBe(100);
    s = proposalReducer(s, { type: 'SET_TAX_PERCENT', value: -5 });
    expect(s.dre.taxPercent).toBe(0);
    s = proposalReducer(s, { type: 'SET_EXPENSE', key: 'aluguel', value: -100 });
    expect(s.dre.expenses.aluguel).toBe(0);
    s = proposalReducer(s, { type: 'SET_PROPOSALS_PER_MONTH', value: -3 });
    expect(s.dre.proposalsPerMonth).toBe(0);
  });

  it('atualiza tipo de cliente e implantação', () => {
    let s = proposalReducer(initialProposalState, { type: 'SET_CLIENT_TYPE', clientType: 'academia' });
    expect(s.clientType).toBe('academia');
    s = proposalReducer(s, { type: 'SET_IMPLANTATION', implantation: { mode: 'valor', value: 12000 } });
    expect(s.implantation).toEqual({ mode: 'valor', value: 12000 });
  });
});
