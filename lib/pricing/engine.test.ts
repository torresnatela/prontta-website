import { describe, expect, it } from 'vitest';
import { DEFAULT_CONSULTA_MARGIN, DEFAULT_PROGRAMA_MARGIN } from './constants';
import {
  calculateDRE,
  ceilToStep,
  consolidateProposal,
  getConsultationCost,
  getConsultationSellPrice,
  getProgramRepasse,
  getProgramSellPrice,
  getShiftMultiple,
  summarizeConsultations,
  summarizePrograms,
  validateDedicatedQuantity,
} from './engine';
import type { ConsultationLine, PlanId } from './types';

describe('ceilToStep', () => {
  it('retorna 0 para 0', () => {
    expect(ceilToStep(0)).toBe(0);
  });

  it('arredonda para cima ao múltiplo de 5 por padrão', () => {
    expect(ceilToStep(1)).toBe(5);
    expect(ceilToStep(129.72)).toBe(130);
    expect(ceilToStep(151)).toBe(155);
  });

  it('mantém valores já múltiplos do passo', () => {
    expect(ceilToStep(50)).toBe(50);
    expect(ceilToStep(350)).toBe(350);
  });

  it('não sobe um degrau por ruído de ponto flutuante', () => {
    expect(ceilToStep(150.00000000000003)).toBe(150);
  });
});

describe('getConsultationCost', () => {
  it('deriva o custo golden da Cardiologia Adulto em cada plano', () => {
    // valorHora 120; cons/h 2.5 / 2 / 1; divisor 0.37; ceil múltiplo de 5
    expect(getConsultationCost('cardiologia-adulto', 'popular')).toBe(130);
    expect(getConsultationCost('cardiologia-adulto', 'intermediario')).toBe(165);
    expect(getConsultationCost('cardiologia-adulto', 'premium')).toBe(325);
  });

  it('lança erro para especialidade inexistente', () => {
    expect(() => getConsultationCost('inexistente', 'popular')).toThrow();
  });
});

describe('getConsultationSellPrice', () => {
  it('aplica a margem padrão de 30% sobre o custo (Cardiologia)', () => {
    // custo/(1−0.3) = custo/0.7, ceil múltiplo de 5
    expect(getConsultationSellPrice('cardiologia-adulto', 'popular', DEFAULT_CONSULTA_MARGIN)).toBe(190);
    expect(getConsultationSellPrice('cardiologia-adulto', 'intermediario', DEFAULT_CONSULTA_MARGIN)).toBe(240);
    expect(getConsultationSellPrice('cardiologia-adulto', 'premium', DEFAULT_CONSULTA_MARGIN)).toBe(465);
  });

  it('reflete margens editáveis diferentes', () => {
    // Nutrição popular: custo 75. @50% → 150; @30% → 110
    expect(getConsultationSellPrice('nutricao', 'popular', 0.5)).toBe(150);
    expect(getConsultationSellPrice('nutricao', 'popular', 0.3)).toBe(110);
  });
});

describe('getShiftMultiple', () => {
  it('calcula o múltiplo do plantão de 4h por plano (Cardiologia)', () => {
    expect(getShiftMultiple('cardiologia-adulto', 'popular')).toBe(10);
    expect(getShiftMultiple('cardiologia-adulto', 'intermediario')).toBe(8);
    expect(getShiftMultiple('cardiologia-adulto', 'premium')).toBe(4);
  });

  it('arredonda para cima consultas/hora fracionárias', () => {
    expect(getShiftMultiple('fonoaudiologia', 'popular')).toBe(6); // 1.33 × 4 = 5.32 → 6
    expect(getShiftMultiple('nutricao', 'popular')).toBe(6); // 1.5 × 4 = 6
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

  it('rejeita quantidade fora do múltiplo e quantidade zero', () => {
    expect(validateDedicatedQuantity('cardiologia-adulto', 'popular', 15)).toEqual({
      ok: false,
      multiple: 10,
      shifts: 0,
    });
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
    plan: PlanId,
    agenda: 'dedicada' | 'compartilhada',
    quantity: number,
    id = `${specialtyId}-${agenda}`,
  ): ConsultationLine => ({ id, specialtyId, plan, agenda, quantity });

  it('retorna tudo zerado sem linhas (e não cobra software)', () => {
    const s = summarizeConsultations([], DEFAULT_CONSULTA_MARGIN);
    expect(s.lines).toEqual([]);
    expect(s.subtotalCost).toBe(0);
    expect(s.patientPrice).toBe(0);
    expect(s.totalQuantity).toBe(0);
    expect(s.softwareMonthlyFee).toBe(0);
  });

  it('reproduz o mix semente das consultas (custo 4.400 → paciente 6.440, software 1.499)', () => {
    const s = summarizeConsultations(
      [
        line('endocrinologia', 'popular', 'dedicada', 20),
        line('nutricao', 'popular', 'dedicada', 12),
        line('psicologia-adulto', 'popular', 'dedicada', 12),
      ],
      DEFAULT_CONSULTA_MARGIN,
    );
    expect(s.subtotalCost).toBe(4400);
    expect(s.patientPrice).toBe(6440);
    expect(s.totalQuantity).toBe(44);
    expect(s.softwareMonthlyFee).toBe(1499);
  });

  it('precifica cada linha pelo seu próprio plano', () => {
    const s = summarizeConsultations(
      [line('cardiologia-adulto', 'intermediario', 'dedicada', 8)],
      DEFAULT_CONSULTA_MARGIN,
    );
    expect(s.lines[0].unitCost).toBe(165);
    expect(s.lines[0].unitSell).toBe(240);
    expect(s.lines[0].lineSell).toBe(1920);
    expect(s.lines[0].lineCost).toBe(1320);
  });

  it('isenta o software quando a quantidade bruta atinge o gatilho de 150', () => {
    const s = summarizeConsultations(
      [line('psicologia-adulto', 'popular', 'compartilhada', 150)],
      DEFAULT_CONSULTA_MARGIN,
    );
    expect(s.totalQuantity).toBe(150);
    expect(s.softwareMonthlyFee).toBe(0);
  });

  it('cobra o software logo abaixo do gatilho', () => {
    const s = summarizeConsultations(
      [line('psicologia-adulto', 'popular', 'compartilhada', 149)],
      DEFAULT_CONSULTA_MARGIN,
    );
    expect(s.softwareMonthlyFee).toBe(1499);
  });

  it('valida múltiplo de plantão só em agenda dedicada', () => {
    const s = summarizeConsultations(
      [line('cardiologia-adulto', 'popular', 'dedicada', 15), line('nutricao', 'popular', 'compartilhada', 7)],
      DEFAULT_CONSULTA_MARGIN,
    );
    expect(s.lines[0].validation).toEqual({ ok: false, multiple: 10, shifts: 0 });
    expect(s.lines[1].validation).toBeNull();
  });
});

describe('programas', () => {
  it('repasse = custo-base + fee e preço deriva pela margem', () => {
    expect(getProgramRepasse('performance', 6)).toBe(1735); // 1485 + 250
    expect(getProgramSellPrice('performance', 3, DEFAULT_PROGRAMA_MARGIN)).toBe(1350);
    expect(getProgramSellPrice('performance', 6, DEFAULT_PROGRAMA_MARGIN)).toBe(2480);
    expect(getProgramSellPrice('longevidade-ativa', 12, DEFAULT_PROGRAMA_MARGIN)).toBe(4795);
  });

  it('lança erro para programa inexistente', () => {
    expect(() => getProgramRepasse('inexistente', 3)).toThrow();
  });

  it('summarizePrograms reproduz o mix semente (venda 14.880, repasse 10.410)', () => {
    const s = summarizePrograms(
      [
        { id: 'a', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 4 },
        { id: 'b', programId: 'longevidade-ativa', cycle: 6, quantity: 2 },
      ],
      DEFAULT_PROGRAMA_MARGIN,
    );
    expect(s.items[0].unitSell).toBe(2295);
    expect(s.items[0].unitRepasse).toBe(1605);
    expect(s.subtotalSell).toBe(14880);
    expect(s.subtotalRepasse).toBe(10410);
  });

  it('aceita lista vazia', () => {
    const s = summarizePrograms([], DEFAULT_PROGRAMA_MARGIN);
    expect(s.subtotalSell).toBe(0);
    expect(s.subtotalRepasse).toBe(0);
  });
});

describe('mix semente completo (consolidação + DRE)', () => {
  const consultations = summarizeConsultations(
    [
      { id: '1', specialtyId: 'endocrinologia', plan: 'popular', agenda: 'dedicada', quantity: 20 },
      { id: '2', specialtyId: 'nutricao', plan: 'popular', agenda: 'dedicada', quantity: 12 },
      { id: '3', specialtyId: 'psicologia-adulto', plan: 'popular', agenda: 'dedicada', quantity: 12 },
    ],
    DEFAULT_CONSULTA_MARGIN,
  );
  const programs = summarizePrograms(
    [
      { id: 'a', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 4 },
      { id: 'b', programId: 'longevidade-ativa', cycle: 6, quantity: 2 },
    ],
    DEFAULT_PROGRAMA_MARGIN,
  );

  it('consolida total ao paciente 21.320 e repasse 14.810', () => {
    const t = consolidateProposal(consultations, programs, { mode: 'a_combinar' });
    expect(t.consultationsPatientPrice).toBe(6440);
    expect(t.programsSubtotal).toBe(14880);
    expect(t.totalContractValue).toBe(21320);
    expect(t.repasse).toBe(14810);
    expect(t.softwareMonthlyFee).toBe(1499);
    expect(t.implantation).toEqual({ mode: 'a_combinar' });
  });

  it('DRE do parceiro: resultado líquido 331,80, margem ~1,6%', () => {
    const t = consolidateProposal(consultations, programs, { mode: 'a_combinar' });
    const dre = calculateDRE({
      totalContractValue: t.totalContractValue,
      repasse: t.repasse,
      taxPercent: 6,
      expenses: { pessoal: 1500, aluguel: 800, fixas: 500, marketing: 600, outras: 0 },
      softwareMonthlyFee: t.softwareMonthlyFee,
    });
    expect(dre.receitaBruta).toBe(21320);
    expect(dre.repasse).toBe(14810);
    expect(dre.margemBruta).toBe(6510);
    expect(dre.impostos).toBeCloseTo(1279.2, 4);
    expect(dre.software).toBe(1499);
    expect(dre.totalDespesas).toBeCloseTo(6178.2, 4);
    expect(dre.resultadoLiquido).toBeCloseTo(331.8, 4);
    expect(dre.margemLiquidaPct).toBeCloseTo(1.56, 2);
  });
});

describe('calculateDRE — casos de borda', () => {
  const base = {
    totalContractValue: 0,
    repasse: 0,
    taxPercent: 6,
    expenses: { pessoal: 1500, aluguel: 800, fixas: 500, marketing: 600, outras: 0 },
    softwareMonthlyFee: 1499,
  };

  it('não produz NaN com receita zero e reflete despesas fixas no prejuízo', () => {
    const dre = calculateDRE(base);
    expect(dre.receitaBruta).toBe(0);
    expect(dre.impostos).toBe(0);
    expect(dre.margemLiquidaPct).toBe(0);
    expect(dre.resultadoLiquido).toBe(-(3400 + 1499));
  });

  it('permite resultado negativo quando o repasse+despesas superam a receita', () => {
    const dre = calculateDRE({ ...base, totalContractValue: 1000, repasse: 700 });
    expect(dre.resultadoLiquido).toBeLessThan(0);
  });
});
