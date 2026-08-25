import { describe, expect, it } from 'vitest';
import {
  calculateDRE,
  consolidateProposal,
  summarizeConsultations,
  summarizePrograms,
} from '@/lib/pricing';
import { calculateBenefitCost } from '@/lib/empresa/pricing';
import { createInitialProposalState, initialProposalState, proposalReducer } from './reducer';

describe('initialProposalState', () => {
  it('nasce com o mix semente válido e reproduz os totais oficiais', () => {
    const s = initialProposalState;
    expect(s.clientType).toBe('clinica');
    expect(s.margins).toEqual({ consulta: 0.3, programa: 0.3 });
    expect(s.implantation).toEqual({ mode: 'a_combinar' });

    const consultations = summarizeConsultations(s.consultationLines, s.margins.consulta);
    const programs = summarizePrograms(s.programSelections, s.margins.programa);
    const totals = consolidateProposal(consultations, programs, s.implantation);
    expect(totals.totalContractValue).toBe(21320);

    // toda linha semente fecha plantão (sem alertas ao abrir)
    for (const line of consultations.lines) {
      expect(line.validation?.ok ?? true).toBe(true);
    }

    const dre = calculateDRE({
      totalContractValue: totals.totalContractValue,
      repasse: totals.repasse,
      taxPercent: s.dre.taxPercent,
      expenses: s.dre.expenses,
      softwareMonthlyFee: totals.softwareMonthlyFee,
    });
    expect(dre.resultadoLiquido).toBeCloseTo(331.8, 4);
  });
});

describe('proposalReducer — consultas', () => {
  it('adiciona, atualiza e remove linhas de consulta', () => {
    let s = proposalReducer(initialProposalState, {
      type: 'ADD_CONSULTATION_LINE',
      line: { id: 'x', specialtyId: 'dermatologia', plan: 'popular', agenda: 'compartilhada', quantity: 2 },
    });
    expect(s.consultationLines.some((l) => l.id === 'x')).toBe(true);

    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 5, plan: 'premium' } });
    const updated = s.consultationLines.find((l) => l.id === 'x');
    expect(updated?.quantity).toBe(5);
    expect(updated?.plan).toBe('premium');

    s = proposalReducer(s, { type: 'REMOVE_CONSULTATION_LINE', id: 'x' });
    expect(s.consultationLines.some((l) => l.id === 'x')).toBe(false);
  });

  it('clampa quantidade para inteiro ≥ 1', () => {
    let s = proposalReducer(initialProposalState, {
      type: 'ADD_CONSULTATION_LINE',
      line: { id: 'x', specialtyId: 'nutricao', plan: 'popular', agenda: 'compartilhada', quantity: 3 },
    });
    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 0 } });
    expect(s.consultationLines.find((l) => l.id === 'x')?.quantity).toBe(1);
    s = proposalReducer(s, { type: 'UPDATE_CONSULTATION_LINE', id: 'x', patch: { quantity: 2.7 } });
    expect(s.consultationLines.find((l) => l.id === 'x')?.quantity).toBe(2);
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

describe('proposalReducer — margens, DRE, seller e demais inputs', () => {
  it('recebe margem em % e trava a fração em [0.01, 0.90]', () => {
    let s = proposalReducer(initialProposalState, { type: 'SET_CONSULTA_MARGIN', value: 45 });
    expect(s.margins.consulta).toBe(0.45);
    s = proposalReducer(s, { type: 'SET_CONSULTA_MARGIN', value: 150 });
    expect(s.margins.consulta).toBe(0.9);
    s = proposalReducer(s, { type: 'SET_PROGRAMA_MARGIN', value: 0 });
    expect(s.margins.programa).toBe(0.01);
  });

  it('clampa imposto entre 0 e 100 e despesas em ≥ 0', () => {
    let s = proposalReducer(initialProposalState, { type: 'SET_TAX_PERCENT', value: 150 });
    expect(s.dre.taxPercent).toBe(100);
    s = proposalReducer(s, { type: 'SET_TAX_PERCENT', value: -5 });
    expect(s.dre.taxPercent).toBe(0);
    s = proposalReducer(s, { type: 'SET_EXPENSE', key: 'aluguel', value: -100 });
    expect(s.dre.expenses.aluguel).toBe(0);
  });

  it('atualiza tipo de cliente, implantação e vendedor', () => {
    let s = proposalReducer(initialProposalState, { type: 'SET_CLIENT_TYPE', clientType: 'academia' });
    expect(s.clientType).toBe('academia');
    s = proposalReducer(s, { type: 'SET_IMPLANTATION', implantation: { mode: 'valor', value: 12000 } });
    expect(s.implantation).toEqual({ mode: 'valor', value: 12000 });
    s = proposalReducer(s, { type: 'SET_SELLER', patch: { name: 'Ana', email: 'ana@x.com' } });
    expect(s.seller).toEqual({ name: 'Ana', email: 'ana@x.com', phone: '' });
  });
});

describe('createInitialProposalState — modo benefício', () => {
  it('não mexe no estado de revenda', () => {
    expect(createInitialProposalState({ mode: 'revenda' })).toEqual(initialProposalState);
    expect(createInitialProposalState()).toEqual(initialProposalState);
    expect(createInitialProposalState({ clientType: 'academia' })).toEqual({
      ...initialProposalState,
      clientType: 'academia',
    });
  });

  it('abre sem margem — a empresa paga o repasse', () => {
    const s = createInitialProposalState({ mode: 'beneficio', clientType: 'empresa' });
    expect(s.mode).toBe('beneficio');
    expect(s.clientType).toBe('empresa');
    expect(s.margins).toEqual({ consulta: 0, programa: 0 });
  });

  it('semeia um mix com cara de benefício, e todas as linhas fecham plantão', () => {
    const s = createInitialProposalState({ mode: 'beneficio' });
    const summary = summarizeConsultations(s.consultationLines, s.margins.consulta);

    expect(s.consultationLines.map((l) => l.specialtyId)).toEqual([
      'medico-generalista',
      'psicologia-adulto',
      'nutricao',
    ]);
    for (const line of summary.lines) {
      expect(line.validation?.ok).toBe(true);
    }
    // Com margem 0, preço ao contratante === repasse.
    expect(summary.patientPrice).toBe(summary.subtotalCost);
    expect(summary.patientPrice).toBe(3850);
  });

  it('reproduz os números que o hero da empresa promete', () => {
    const s = createInitialProposalState({ mode: 'beneficio' });
    const consultations = summarizeConsultations(s.consultationLines, s.margins.consulta);
    const cost = calculateBenefitCost({
      consultationsMonthly: consultations.patientPrice,
      programSelections: s.programSelections,
      softwareMonthlyFee: consultations.softwareMonthlyFee,
      headcount: s.benefit.headcount,
      adhesionPercent: s.benefit.adhesionPercent,
      funding: s.benefit.funding,
    });

    expect(cost.monthlyTotal).toBeCloseTo(6627.67, 2);
    expect(cost.costPerEligible).toBeCloseTo(20.71, 2);
    expect(cost.eligible).toBe(320);
    expect(cost.adherents).toBe(144);
  });
});

describe('actions do modo benefício', () => {
  const base = createInitialProposalState({ mode: 'beneficio' });

  it('o modelo remoto isenta a implantação por definição', () => {
    const remoto = proposalReducer(base, { type: 'SET_SERVICE_MODEL', value: 'remoto' });
    expect(remoto.benefit.serviceModel).toBe('remoto');
    expect(remoto.implantation).toEqual({ mode: 'isento' });

    const voltou = proposalReducer(remoto, { type: 'SET_SERVICE_MODEL', value: 'ponto_de_acesso' });
    expect(voltou.implantation).toEqual({ mode: 'a_combinar' });
  });

  it('trava população, adesão e coparticipação', () => {
    expect(proposalReducer(base, { type: 'SET_HEADCOUNT', value: -5 }).benefit.headcount).toBe(0);
    expect(proposalReducer(base, { type: 'SET_HEADCOUNT', value: 12.9 }).benefit.headcount).toBe(12);
    expect(proposalReducer(base, { type: 'SET_ADHESION', value: 180 }).benefit.adhesionPercent).toBe(100);
    expect(proposalReducer(base, { type: 'SET_ADHESION', value: NaN }).benefit.adhesionPercent).toBe(0);

    const copay = proposalReducer(base, {
      type: 'SET_FUNDING',
      funding: { mode: 'coparticipacao', employeePercent: 150 },
    });
    expect(copay.benefit.funding).toEqual({ mode: 'coparticipacao', employeePercent: 100 });
  });

  it('trava as premissas de retorno', () => {
    const salario = proposalReducer(base, {
      type: 'SET_RETURN_ASSUMPTION',
      key: 'avgSalary',
      value: -100,
    });
    expect(salario.benefit.roi.avgSalary).toBe(0);

    const reducao = proposalReducer(base, {
      type: 'SET_RETURN_ASSUMPTION',
      key: 'absenceReductionPercent',
      value: 250,
    });
    expect(reducao.benefit.roi.absenceReductionPercent).toBe(100);
  });

  it('abre com as premissas de retorno zeradas — nada é projetado sem alguém assumir', () => {
    expect(base.benefit.roi.avgSalary).toBe(0);
    expect(base.benefit.roi.absenceDaysPerYear).toBe(0);
    expect(base.benefit.roi.absenceReductionPercent).toBe(0);
  });
});
