import { describe, expect, it } from 'vitest';
import { DEFAULT_PROGRAMA_MARGIN } from './constants';
import {
  getConsultationCost,
  getProgramOfficialMonthly,
  getProgramOfficialPrice,
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
  'cardiologia-adulto': { costs: [130, 165, 325], shifts: [10, 8, 4] },
  dermatologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  endocrinologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  fonoaudiologia: { costs: [125, 85, 165], shifts: [6, 8, 4] },
  gastroenterologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  geriatria: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  'ginecologia-obstetricia': { costs: [130, 165, 325], shifts: [10, 8, 4] },
  hematologia: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  hepatologia: { costs: [220, 275, 545], shifts: [10, 8, 4] },
  infectologia: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  'medicina-da-familia': { costs: [130, 165, 325], shifts: [10, 8, 4] },
  nefrologia: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  'neurologia-adulto': { costs: [105, 205, 410], shifts: [16, 8, 4] },
  neuropediatria: { costs: [275, 340, 680], shifts: [10, 8, 4] },
  nutricao: { costs: [75, 85, 110], shifts: [6, 6, 4] },
  nutrologia: { costs: [145, 180, 355], shifts: [10, 8, 4] },
  oftalmologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  ortopedia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  otorrinolaringologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  pediatria: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  pneumologia: { costs: [105, 205, 410], shifts: [16, 8, 4] },
  proctologia: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  'psicologia-adulto': { costs: [75, 55, 110], shifts: [6, 8, 4] },
  'psicologia-infantil': { costs: [125, 125, 165], shifts: [6, 6, 4] },
  'psiquiatria-adulto': { costs: [130, 165, 325], shifts: [10, 8, 4] },
  'psiquiatria-infantil': { costs: [195, 245, 490], shifts: [10, 8, 4] },
  reumatologia: { costs: [165, 205, 410], shifts: [10, 8, 4] },
  urologia: { costs: [130, 165, 325], shifts: [10, 8, 4] },
  'medico-generalista': { costs: [80, 95, 190], shifts: [10, 8, 4] },
};

const PLANS: PlanId[] = ['popular', 'intermediario', 'premium'];

describe('catálogo de especialidades (golden da tabela oficial)', () => {
  it('tem exatamente as 29 especialidades da tabela', () => {
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

  /**
   * [3m, 6m, 12m] — preço DERIVADO na margem padrão de 30%.
   * É a coluna "Ref. calc. ÷0,70" da aba 4, não o preço de tabela (ver GOLDEN_V8).
   */
  const GOLDEN_SELL_30: Record<string, [number, number, number]> = {
    performance: [1350, 2480, 4190],
    'emagrecimento-inteligente': [1165, 2295, 3820],
    'mente-em-equilibrio': [955, 1980, 3300],
    'desenvolvimento-infantil': [2480, 5035, 8110],
    'desenvolvimento-adolescente': [1890, 3845, 5755],
    'mulher-plena': [1350, 2850, 4560],
    'fertilidade-e-vida': [1535, 2850, 4560],
    'respirar-livre': [1400, 2760, 4330],
    'saude-capilar': [910, 1600, 2685],
    'longevidade-ativa': [1535, 2850, 4795],
    'coracao-em-dia': [1350, 2480, 3820],
    'sono-e-energia': [1275, 2510, 4380],
  };

  /** [3m, 6m, 12m] — coluna "Preço paciente V8": o preço de tabela ao paciente. */
  const GOLDEN_V8: Record<string, [number, number, number]> = {
    performance: [1350, 2700, 4200],
    'emagrecimento-inteligente': [1200, 2400, 3900],
    'mente-em-equilibrio': [1050, 2100, 3300],
    'desenvolvimento-infantil': [2550, 5100, 8400],
    'desenvolvimento-adolescente': [1950, 3900, 6000],
    'mulher-plena': [1350, 3000, 4800],
    'fertilidade-e-vida': [1650, 3000, 4800],
    'respirar-livre': [1500, 3000, 4500],
    'saude-capilar': [1050, 1800, 2700],
    'longevidade-ativa': [1650, 3000, 4800],
    'coracao-em-dia': [1350, 2700, 3900],
    'sono-e-energia': [1350, 2700, 4500],
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

  it.each(Object.entries(GOLDEN_V8))('%s: preço de tabela V8 ao paciente', (id, prices) => {
    CYCLES.forEach((cycle, i) => {
      expect(getProgramOfficialPrice(id, cycle), `V8 ${id}/${cycle}m`).toBe(prices[i]);
    });
  });

  it('nunca sugere um preço de tabela abaixo do derivado na margem padrão', () => {
    // Se o V8 ficasse abaixo, o "preço sugerido Prontta" mostraria ao dono da
    // academia um número que nem cobre a margem de 30% do próprio modelo.
    for (const [id, sell] of Object.entries(GOLDEN_SELL_30)) {
      CYCLES.forEach((cycle, i) => {
        expect(getProgramOfficialPrice(id, cycle), `V8 ${id}/${cycle}m`).toBeGreaterThanOrEqual(
          sell[i],
        );
      });
    }
  });

  it('deriva a mensalidade oficial dividindo o preço de tabela pelo ciclo', () => {
    expect(getProgramOfficialMonthly('performance', 6)).toBe(450);
    expect(getProgramOfficialMonthly('performance', 12)).toBe(350);
    expect(getProgramOfficialMonthly('saude-capilar', 12)).toBe(225);
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
