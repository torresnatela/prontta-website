import { describe, expect, it } from 'vitest';
import {
  calculateDRE,
  ceilToStep,
  consolidateProposal,
  getConsultationPrice,
  getProgramMonthly,
  getProgramPrice,
  getShiftMultiple,
  summarizeConsultations,
  summarizePrograms,
  validateDedicatedQuantity,
} from './engine';

describe('ceilToStep', () => {
  it('retorna 0 para 0', () => {
    expect(ceilToStep(0)).toBe(0);
  });

  it('arredonda para cima ao múltiplo de 50 por padrão', () => {
    expect(ceilToStep(1)).toBe(50);
    expect(ceilToStep(129.72)).toBe(150);
    expect(ceilToStep(151)).toBe(200);
  });

  it('mantém valores já múltiplos do passo', () => {
    expect(ceilToStep(50)).toBe(50);
    expect(ceilToStep(350)).toBe(350);
  });

  it('não sobe um degrau por ruído de ponto flutuante', () => {
    expect(ceilToStep(150.00000000000003)).toBe(150);
  });

  it('aceita passo customizado', () => {
    expect(ceilToStep(5.32, 1)).toBe(6);
  });
});

describe('getConsultationPrice', () => {
  it('deriva o preço golden da Cardiologia Adulto em cada plano', () => {
    // valorHora 120; cons/h 2.5 / 2 / 1; divisor 0.37; ceil múltiplo de 50
    expect(getConsultationPrice('cardiologia-adulto', 'popular')).toBe(150);
    expect(getConsultationPrice('cardiologia-adulto', 'intermediario')).toBe(200);
    expect(getConsultationPrice('cardiologia-adulto', 'premium')).toBe(350);
  });

  it('deriva preços de especialidades de baixo valor-hora (Médico Generalista)', () => {
    expect(getConsultationPrice('medico-generalista', 'popular')).toBe(100);
    expect(getConsultationPrice('medico-generalista', 'intermediario')).toBe(100);
    expect(getConsultationPrice('medico-generalista', 'premium')).toBe(200);
  });

  it('lança erro para especialidade inexistente', () => {
    expect(() => getConsultationPrice('inexistente', 'popular')).toThrow();
  });
});

describe('getShiftMultiple', () => {
  it('calcula o múltiplo do plantão de 4h por plano (Cardiologia)', () => {
    expect(getShiftMultiple('cardiologia-adulto', 'popular')).toBe(10);
    expect(getShiftMultiple('cardiologia-adulto', 'intermediario')).toBe(8);
    expect(getShiftMultiple('cardiologia-adulto', 'premium')).toBe(4);
  });

  it('arredonda para cima consultas/hora fracionárias', () => {
    // Fonoaudiologia popular: 1.33 × 4 = 5.32 → 6
    expect(getShiftMultiple('fonoaudiologia', 'popular')).toBe(6);
    // Nutrição popular: 1.5 × 4 = 6
    expect(getShiftMultiple('nutricao', 'popular')).toBe(6);
  });
});

describe('validateDedicatedQuantity', () => {
  it('aceita quantidade múltipla do plantão e informa nº de plantões', () => {
    expect(validateDedicatedQuantity('cardiologia-adulto', 'popular', 20)).toEqual({
      ok: true,
      multiple: 10,
      shifts: 2,
    });
  });

  it('rejeita quantidade fora do múltiplo', () => {
    expect(validateDedicatedQuantity('cardiologia-adulto', 'popular', 15)).toEqual({
      ok: false,
      multiple: 10,
      shifts: 0,
    });
  });

  it('rejeita quantidade zero', () => {
    expect(validateDedicatedQuantity('cardiologia-adulto', 'popular', 0)).toEqual({
      ok: false,
      multiple: 10,
      shifts: 0,
    });
  });
});

describe('summarizeConsultations', () => {
  const line = (
    specialtyId: string,
    agenda: 'dedicada' | 'compartilhada',
    quantity: number,
    cycleMonths: number,
    id = `${specialtyId}-${agenda}`,
  ) => ({ id, specialtyId, agenda, quantity, cycleMonths });

  it('retorna tudo zerado sem linhas (e não cobra software)', () => {
    const s = summarizeConsultations([], 'popular');
    expect(s.lines).toEqual([]);
    expect(s.subtotalCost).toBe(0);
    expect(s.blockCycleMonths).toBe(0);
    expect(s.consultationsPerMonth).toBe(0);
    expect(s.patientPrice).toBe(0);
    expect(s.softwareMonthlyFee).toBe(0);
  });

  it('reproduz o cenário golden da planilha (subtotal 3.900 → paciente 5.600, software 1.499)', () => {
    const s = summarizeConsultations(
      [
        line('endocrinologia', 'dedicada', 10, 6),
        line('nutricao', 'compartilhada', 3, 6),
        line('psicologia-adulto', 'compartilhada', 6, 6),
        line('cardiologia-adulto', 'dedicada', 10, 6),
      ],
      'popular',
    );
    expect(s.subtotalCost).toBe(3900);
    expect(s.blockCycleMonths).toBe(6);
    expect(s.consultationsPerMonth).toBeCloseTo(29 / 6, 10);
    expect(s.patientPrice).toBe(5600);
    expect(s.softwareMonthlyFee).toBe(1499);
  });

  it('precifica cada linha pelo plano de referência', () => {
    const s = summarizeConsultations([line('cardiologia-adulto', 'dedicada', 8, 6)], 'intermediario');
    expect(s.lines[0].unitPrice).toBe(200);
    expect(s.lines[0].lineTotal).toBe(1600);
  });

  it('usa o MAIOR ciclo entre as linhas como ciclo do bloco', () => {
    const s = summarizeConsultations(
      [line('nutricao', 'compartilhada', 2, 3), line('cardiologia-adulto', 'dedicada', 10, 12)],
      'popular',
    );
    expect(s.blockCycleMonths).toBe(12);
    expect(s.consultationsPerMonth).toBe(1);
  });

  it('isenta o software quando consultas/mês atingem exatamente o gatilho de 150', () => {
    const s = summarizeConsultations([line('psicologia-adulto', 'compartilhada', 900, 6)], 'popular');
    expect(s.consultationsPerMonth).toBe(150);
    expect(s.softwareMonthlyFee).toBe(0);
  });

  it('cobra o software logo abaixo do gatilho', () => {
    const s = summarizeConsultations([line('psicologia-adulto', 'compartilhada', 899, 6)], 'popular');
    expect(s.softwareMonthlyFee).toBe(1499);
  });

  it('valida múltiplo de plantão só em agenda dedicada', () => {
    const s = summarizeConsultations(
      [line('cardiologia-adulto', 'dedicada', 15, 6), line('nutricao', 'compartilhada', 7, 6)],
      'popular',
    );
    expect(s.lines[0].validation).toEqual({ ok: false, multiple: 10, shifts: 0 });
    expect(s.lines[1].validation).toBeNull();
  });
});

describe('programas', () => {
  it('retorna preço oficial e mensalidade por ciclo', () => {
    expect(getProgramPrice('performance', 3)).toBe(1350);
    expect(getProgramMonthly('performance', 3)).toBe(450);
    expect(getProgramMonthly('performance', 12)).toBe(350);
  });

  it('lança erro para programa inexistente', () => {
    expect(() => getProgramPrice('inexistente', 3)).toThrow();
  });

  it('summarizePrograms reproduz o mix golden da planilha (9.000)', () => {
    const s = summarizePrograms([
      { id: 'a', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 1 },
      { id: 'b', programId: 'longevidade-ativa', cycle: 12, quantity: 1 },
      { id: 'c', programId: 'saude-capilar', cycle: 6, quantity: 1 },
    ]);
    expect(s.items.map((i) => i.total)).toEqual([2400, 4800, 1800]);
    expect(s.items[0].monthly).toBe(400);
    expect(s.subtotal).toBe(9000);
  });

  it('multiplica pela quantidade e aceita lista vazia', () => {
    expect(summarizePrograms([]).subtotal).toBe(0);
    const s = summarizePrograms([{ id: 'a', programId: 'saude-capilar', cycle: 6, quantity: 3 }]);
    expect(s.items[0].total).toBe(5400);
    expect(s.subtotal).toBe(5400);
  });
});

describe('consolidateProposal', () => {
  const goldenConsultations = summarizeConsultations(
    [
      { id: '1', specialtyId: 'endocrinologia', agenda: 'dedicada', quantity: 10, cycleMonths: 6 },
      { id: '2', specialtyId: 'nutricao', agenda: 'compartilhada', quantity: 3, cycleMonths: 6 },
      { id: '3', specialtyId: 'psicologia-adulto', agenda: 'compartilhada', quantity: 6, cycleMonths: 6 },
      { id: '4', specialtyId: 'cardiologia-adulto', agenda: 'dedicada', quantity: 10, cycleMonths: 6 },
    ],
    'popular',
  );
  const goldenPrograms = summarizePrograms([
    { id: 'a', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 1 },
    { id: 'b', programId: 'longevidade-ativa', cycle: 12, quantity: 1 },
    { id: 'c', programId: 'saude-capilar', cycle: 6, quantity: 1 },
  ]);

  it('soma consultas ao paciente + programas no total do contrato (golden 14.600)', () => {
    const t = consolidateProposal(goldenConsultations, goldenPrograms, { mode: 'a_combinar' });
    expect(t.consultationsPatientPrice).toBe(5600);
    expect(t.programsSubtotal).toBe(9000);
    expect(t.totalContractValue).toBe(14600);
    expect(t.softwareMonthlyFee).toBe(1499);
    expect(t.implantation).toEqual({ mode: 'a_combinar' });
  });

  it('proposta só de programas não tem software mensal', () => {
    const t = consolidateProposal(summarizeConsultations([], 'popular'), goldenPrograms, {
      mode: 'valor',
      value: 12000,
    });
    expect(t.totalContractValue).toBe(9000);
    expect(t.softwareMonthlyFee).toBe(0);
    expect(t.implantation).toEqual({ mode: 'valor', value: 12000 });
  });
});

describe('calculateDRE', () => {
  const goldenInputs = {
    totalContractValue: 14600,
    proposalsPerMonth: 8,
    taxPercent: 6,
    expenses: { pessoal: 1500, aluguel: 800, fixas: 500, marketing: 600, outras: 0 },
    softwareMonthlyFee: 1499,
  };

  it('reproduz a DRE golden da planilha (resultado 23.133, margem 19,8%)', () => {
    const dre = calculateDRE(goldenInputs);
    expect(dre.receitaBruta).toBe(116800);
    expect(dre.custoProntta).toBe(81760);
    expect(dre.impostos).toBe(7008);
    expect(dre.software).toBe(1499);
    expect(dre.totalDespesas).toBe(11907);
    expect(dre.resultadoLiquido).toBe(23133);
    expect(dre.margemLiquidaPct).toBeCloseTo(19.8057, 3);
  });

  it('não produz NaN com receita zero e reflete despesas fixas no prejuízo', () => {
    const dre = calculateDRE({ ...goldenInputs, proposalsPerMonth: 0 });
    expect(dre.receitaBruta).toBe(0);
    expect(dre.impostos).toBe(0);
    expect(dre.margemLiquidaPct).toBe(0);
    expect(dre.resultadoLiquido).toBe(-(3400 + 1499));
  });

  it('permite resultado negativo com receita baixa', () => {
    const dre = calculateDRE({ ...goldenInputs, totalContractValue: 1000, proposalsPerMonth: 1 });
    expect(dre.resultadoLiquido).toBeLessThan(0);
  });
});
