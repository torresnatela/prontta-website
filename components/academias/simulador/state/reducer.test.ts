import { describe, expect, it } from 'vitest';
import { simulateAcademiaOwner } from '@/lib/academias/pricing';
import {
  initialSimuladorState,
  simuladorReducer,
  type SimuladorAction,
  type SimuladorState,
} from './reducer';

const apply = (actions: SimuladorAction[], from: SimuladorState = initialSimuladorState) =>
  actions.reduce(simuladorReducer, from);

describe('initialSimuladorState', () => {
  it('produz o cenário golden da página', () => {
    const s = initialSimuladorState;
    const result = simulateAcademiaOwner({
      programId: s.programId,
      cycle: s.cycle,
      students: s.students,
      personalSales: s.personalSales,
      ownerMarginPercent: s.ownerMarginPercent,
      personalCommissionPercent: s.personalCommissionPercent,
      manualMonthlyPrice: s.manualMonthlyPrice,
    });
    expect(result.monthlyPrice).toBe(450);
    expect(result.monthlyRevenue).toBe(11_250);
    expect(result.academyProfitMonthly).toBeCloseTo(3458.3333, 4);
  });

  it('começa com despesas zeradas — a academia já paga aluguel e equipe', () => {
    expect(initialSimuladorState.expenses).toEqual({
      pessoal: 0,
      aluguel: 0,
      fixas: 0,
      marketing: 0,
      outras: 0,
    });
    expect(initialSimuladorState.taxPercent).toBe(6);
  });
});

describe('SET_STUDENTS', () => {
  it('nunca deixa a academia com menos de 1 aluno', () => {
    expect(apply([{ type: 'SET_STUDENTS', students: 0 }]).students).toBe(1);
    expect(apply([{ type: 'SET_STUDENTS', students: -5 }]).students).toBe(1);
  });

  it('arredonda para inteiro', () => {
    expect(apply([{ type: 'SET_STUDENTS', students: 12.9 }]).students).toBe(12);
  });

  it('campo vazio (NaN) não envenena o estado', () => {
    expect(apply([{ type: 'SET_STUDENTS', students: Number.NaN }]).students).toBe(1);
  });

  it('cascateia o clamp em personalSales — o invariante que justifica o reducer', () => {
    // 25 alunos / 25 vendas → cai para 10 alunos: as vendas têm de acompanhar.
    const state = apply([{ type: 'SET_STUDENTS', students: 10 }]);
    expect(state.students).toBe(10);
    expect(state.personalSales).toBe(10);
  });

  it('não sobe personalSales ao aumentar os alunos', () => {
    const state = apply([
      { type: 'SET_PERSONAL_SALES', personalSales: 5 },
      { type: 'SET_STUDENTS', students: 50 },
    ]);
    expect(state.personalSales).toBe(5);
  });
});

describe('SET_PERSONAL_SALES / SET_ALL_SALES', () => {
  it('limita ao número de alunos', () => {
    expect(apply([{ type: 'SET_PERSONAL_SALES', personalSales: 999 }]).personalSales).toBe(25);
  });

  it('aceita zero e rejeita negativos', () => {
    expect(apply([{ type: 'SET_PERSONAL_SALES', personalSales: 0 }]).personalSales).toBe(0);
    expect(apply([{ type: 'SET_PERSONAL_SALES', personalSales: -3 }]).personalSales).toBe(0);
  });

  it('"aplicar a todos" iguala às adesões', () => {
    const state = apply([
      { type: 'SET_STUDENTS', students: 40 },
      { type: 'SET_PERSONAL_SALES', personalSales: 2 },
      { type: 'SET_ALL_SALES' },
    ]);
    expect(state.personalSales).toBe(40);
  });
});

describe('margens e comissão', () => {
  it('clampa a margem do dono em 0..70', () => {
    expect(apply([{ type: 'SET_OWNER_MARGIN', percent: 999 }]).ownerMarginPercent).toBe(70);
    expect(apply([{ type: 'SET_OWNER_MARGIN', percent: -5 }]).ownerMarginPercent).toBe(0);
    expect(apply([{ type: 'SET_OWNER_MARGIN', percent: Number.NaN }]).ownerMarginPercent).toBe(0);
  });

  it('clampa a comissão do personal em 0..20', () => {
    expect(apply([{ type: 'SET_COMMISSION', percent: 999 }]).personalCommissionPercent).toBe(20);
    expect(apply([{ type: 'SET_COMMISSION', percent: -1 }]).personalCommissionPercent).toBe(0);
  });

  it('mexer na margem ou na comissão descarta o preço digitado à mão', () => {
    const comPrecoManual = apply([{ type: 'SET_MANUAL_PRICE', price: 600 }]);
    expect(comPrecoManual.manualMonthlyPrice).toBe(600);

    expect(
      apply([{ type: 'SET_OWNER_MARGIN', percent: 35 }], comPrecoManual).manualMonthlyPrice,
    ).toBeNull();
    expect(
      apply([{ type: 'SET_COMMISSION', percent: 3 }], comPrecoManual).manualMonthlyPrice,
    ).toBeNull();
  });
});

describe('SET_MANUAL_PRICE', () => {
  it('aceita um preço e permite voltar ao derivado', () => {
    const manual = apply([{ type: 'SET_MANUAL_PRICE', price: 520 }]);
    expect(manual.manualMonthlyPrice).toBe(520);
    expect(apply([{ type: 'SET_MANUAL_PRICE', price: null }], manual).manualMonthlyPrice).toBeNull();
  });

  it('trata zero, negativo e NaN como "sem override"', () => {
    for (const price of [0, -10, Number.NaN]) {
      expect(apply([{ type: 'SET_MANUAL_PRICE', price }]).manualMonthlyPrice).toBeNull();
    }
  });
});

describe('SET_PROGRAM / SET_CYCLE', () => {
  it('trocar de programa ou ciclo descarta o preço do contexto anterior', () => {
    const manual = apply([{ type: 'SET_MANUAL_PRICE', price: 600 }]);
    expect(
      apply([{ type: 'SET_PROGRAM', programId: 'longevidade-ativa' }], manual).manualMonthlyPrice,
    ).toBeNull();
    expect(apply([{ type: 'SET_CYCLE', cycle: 12 }], manual).manualMonthlyPrice).toBeNull();
  });

  it('guarda o programa e o ciclo escolhidos', () => {
    const state = apply([
      { type: 'SET_PROGRAM', programId: 'sono-e-energia' },
      { type: 'SET_CYCLE', cycle: 3 },
    ]);
    expect(state.programId).toBe('sono-e-energia');
    expect(state.cycle).toBe(3);
  });
});

describe('DRE', () => {
  it('clampa o imposto em 0..100 e as despesas em ≥ 0', () => {
    expect(apply([{ type: 'SET_TAX_PERCENT', percent: 150 }]).taxPercent).toBe(100);
    expect(apply([{ type: 'SET_TAX_PERCENT', percent: Number.NaN }]).taxPercent).toBe(0);
    expect(
      apply([{ type: 'SET_EXPENSE', key: 'aluguel', value: -500 }]).expenses.aluguel,
    ).toBe(0);
    expect(
      apply([{ type: 'SET_EXPENSE', key: 'pessoal', value: Number.NaN }]).expenses.pessoal,
    ).toBe(0);
  });

  it('altera só a despesa endereçada', () => {
    const state = apply([{ type: 'SET_EXPENSE', key: 'marketing', value: 900 }]);
    expect(state.expenses.marketing).toBe(900);
    expect(state.expenses.aluguel).toBe(0);
  });
});

describe('SET_BASE_MEMBERS', () => {
  it('aceita zero e clampa negativos', () => {
    expect(apply([{ type: 'SET_BASE_MEMBERS', baseMembers: 0 }]).baseMembers).toBe(0);
    expect(apply([{ type: 'SET_BASE_MEMBERS', baseMembers: -10 }]).baseMembers).toBe(0);
    expect(apply([{ type: 'SET_BASE_MEMBERS', baseMembers: 1200 }]).baseMembers).toBe(1200);
  });
});
