import { describe, expect, it } from 'vitest';
import { DEFAULT_PROGRAMA_MARGIN } from './constants';
import {
  getConsultationCost,
  getProgramRepasse,
  getProgramSellPrice,
  getShiftMultiple,
} from './engine';
import { PROGRAMS } from './programs';
import { SPECIALTIES } from './specialties';
import type { PlanId } from './types';

/**
 * Golden fixture da tabela oficial de especialidades
 * (`[nome, valorHora, consH_pop, consH_int, consH_prem]`). Custo por consulta e múltiplo de
 * plantão esperados por plano [popular, intermediário, premium]. Trava erros de digitação.
 */
const GOLDEN: Record<string, { costs: [number, number, number]; shifts: [number, number, number] }> = {
  'cardiologia-adulto': { costs: [150, 200, 350], shifts: [10, 8, 4] },
  dermatologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  endocrinologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  fonoaudiologia: { costs: [150, 100, 200], shifts: [6, 8, 4] },
  gastroenterologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  geriatria: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  'ginecologia-obstetricia': { costs: [150, 200, 350], shifts: [10, 8, 4] },
  hematologia: { costs: [200, 250, 450], shifts: [10, 8, 4] },
  infectologia: { costs: [200, 250, 450], shifts: [10, 8, 4] },
  'medicina-da-familia': { costs: [150, 200, 350], shifts: [10, 8, 4] },
  nefrologia: { costs: [200, 250, 450], shifts: [10, 8, 4] },
  'neurologia-adulto': { costs: [150, 250, 450], shifts: [16, 8, 4] },
  neuropediatria: { costs: [300, 350, 700], shifts: [10, 8, 4] },
  nutricao: { costs: [100, 100, 150], shifts: [6, 6, 4] },
  nutrologia: { costs: [150, 200, 400], shifts: [10, 8, 4] },
  oftalmologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  ortopedia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  otorrinolaringologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  pediatria: { costs: [200, 250, 450], shifts: [10, 8, 4] },
  pneumologia: { costs: [150, 250, 450], shifts: [16, 8, 4] },
  'psicologia-adulto': { costs: [100, 100, 150], shifts: [6, 8, 4] },
  'psicologia-infantil': { costs: [150, 150, 200], shifts: [6, 6, 4] },
  'psiquiatria-adulto': { costs: [150, 200, 350], shifts: [10, 8, 4] },
  'psiquiatria-infantil': { costs: [200, 250, 500], shifts: [10, 8, 4] },
  reumatologia: { costs: [200, 250, 450], shifts: [10, 8, 4] },
  urologia: { costs: [150, 200, 350], shifts: [10, 8, 4] },
  'medico-generalista': { costs: [100, 100, 200], shifts: [10, 8, 4] },
};

const PLANS: PlanId[] = ['popular', 'intermediario', 'premium'];

describe('catálogo de especialidades (golden da tabela oficial)', () => {
  it('tem exatamente as 27 especialidades da tabela', () => {
    expect(SPECIALTIES.map((s) => s.id).sort()).toEqual(Object.keys(GOLDEN).sort());
  });

  it.each(Object.entries(GOLDEN))('%s: custos e plantões por plano', (id, expected) => {
    PLANS.forEach((plan, i) => {
      expect(getConsultationCost(id, plan), `custo ${id}/${plan}`).toBe(expected.costs[i]);
      expect(getShiftMultiple(id, plan), `plantão ${id}/${plan}`).toBe(expected.shifts[i]);
    });
  });

  it('toda especialidade tem nome legível', () => {
    for (const s of SPECIALTIES) {
      expect(s.name.length).toBeGreaterThan(2);
    }
  });
});

describe('catálogo de programas (custo-base oficial)', () => {
  /** [3m, 6m, 12m] — custo-base do programa (dado oficial que alimenta a fórmula). */
  const GOLDEN_COSTS: Record<string, [number, number, number]> = {
    performance: [844, 1485, 2532],
    'emagrecimento-inteligente': [714, 1355, 2272],
    'mente-em-equilibrio': [568, 1136, 1910],
    'desenvolvimento-infantil': [1636, 3272, 5274],
    'desenvolvimento-adolescente': [1220, 2440, 3627],
    'mulher-plena': [844, 1745, 2792],
    'fertilidade-e-vida': [974, 1745, 2792],
    'respirar-livre': [877, 1681, 2631],
    'saude-capilar': [536, 869, 1478],
    'longevidade-ativa': [974, 1745, 2955],
    'coracao-em-dia': [844, 1485, 2272],
    'sono-e-energia': [790, 1507, 2663],
  };

  /** [3m, 6m, 12m] — preço ao paciente derivado na margem padrão de 30%. */
  const GOLDEN_SELL_30: Record<string, [number, number, number]> = {
    performance: [1350, 2500, 4200],
    'emagrecimento-inteligente': [1200, 2300, 3850],
    'mente-em-equilibrio': [1000, 2000, 3300],
    'desenvolvimento-infantil': [2500, 5050, 8150],
    'desenvolvimento-adolescente': [1900, 3850, 5800],
    'mulher-plena': [1350, 2850, 4600],
    'fertilidade-e-vida': [1550, 2850, 4600],
    'respirar-livre': [1400, 2800, 4350],
    'saude-capilar': [950, 1600, 2700],
    'longevidade-ativa': [1550, 2850, 4800],
    'coracao-em-dia': [1350, 2500, 3850],
    'sono-e-energia': [1300, 2550, 4400],
  };

  const CYCLES = [3, 6, 12] as const;
  const FEE = { 3: 100, 6: 250, 12: 400 } as const;

  it('tem exatamente os 12 programas da linha', () => {
    expect(PROGRAMS.map((p) => p.id).sort()).toEqual(Object.keys(GOLDEN_COSTS).sort());
  });

  it.each(Object.entries(GOLDEN_COSTS))('%s: repasse = custo-base + fee por ciclo', (id, costs) => {
    CYCLES.forEach((cycle, i) => {
      expect(getProgramRepasse(id, cycle), `repasse ${id}/${cycle}m`).toBe(costs[i] + FEE[cycle]);
    });
  });

  it.each(Object.entries(GOLDEN_SELL_30))('%s: preço ao paciente na margem padrão 30%', (id, sell) => {
    CYCLES.forEach((cycle, i) => {
      expect(getProgramSellPrice(id, cycle, DEFAULT_PROGRAMA_MARGIN), `venda ${id}/${cycle}m`).toBe(
        sell[i],
      );
    });
  });

  it('toda composição referencia especialidades válidas com quantidades positivas', () => {
    const validIds = new Set(SPECIALTIES.map((s) => s.id));
    for (const program of PROGRAMS) {
      expect(program.description.length).toBeGreaterThan(10);
      expect(program.channels.length).toBeGreaterThan(0);
      for (const cycle of CYCLES) {
        const composition = program.compositionByCycle[cycle];
        expect(composition.length, `${program.id}/${cycle}m`).toBeGreaterThan(0);
        for (const item of composition) {
          expect(validIds.has(item.specialtyId), `${program.id}/${cycle}m → ${item.specialtyId}`).toBe(true);
          expect(item.quantity).toBeGreaterThan(0);
        }
      }
    }
  });
});
