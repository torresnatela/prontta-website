import { describe, expect, it } from 'vitest';
import { getConsultationPrice, getProgramPrice, getShiftMultiple } from './engine';
import { PROGRAMS } from './programs';
import { SPECIALTIES } from './specialties';
import type { PlanId } from './types';

/**
 * Golden fixture extraído da planilha oficial "Prontta_Simulador_Precos_DRE"
 * (aba 2. Especialidades). Preços e plantões esperados por plano
 * [popular, intermediário, premium]. Trava erros de digitação em
 * valorHora/consultsPerHour do catálogo.
 */
const GOLDEN: Record<string, { prices: [number, number, number]; shifts: [number, number, number] }> = {
  'cardiologia-adulto': { prices: [150, 200, 350], shifts: [10, 8, 4] },
  dermatologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  endocrinologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  fonoaudiologia: { prices: [150, 100, 200], shifts: [6, 8, 4] },
  gastroenterologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  geriatria: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  'ginecologia-obstetricia': { prices: [150, 200, 350], shifts: [10, 8, 4] },
  hematologia: { prices: [200, 250, 450], shifts: [10, 8, 4] },
  infectologia: { prices: [200, 250, 450], shifts: [10, 8, 4] },
  'medicina-da-familia': { prices: [150, 200, 350], shifts: [10, 8, 4] },
  nefrologia: { prices: [200, 250, 450], shifts: [10, 8, 4] },
  'neurologia-adulto': { prices: [150, 250, 450], shifts: [16, 8, 4] },
  neuropediatria: { prices: [300, 350, 700], shifts: [10, 8, 4] },
  nutricao: { prices: [100, 100, 150], shifts: [6, 6, 4] },
  nutrologia: { prices: [150, 200, 400], shifts: [10, 8, 4] },
  oftalmologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  ortopedia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  otorrinolaringologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  pediatria: { prices: [200, 250, 450], shifts: [10, 8, 4] },
  pneumologia: { prices: [150, 250, 450], shifts: [16, 8, 4] },
  'psicologia-adulto': { prices: [100, 100, 150], shifts: [6, 8, 4] },
  'psicologia-infantil': { prices: [150, 150, 200], shifts: [6, 6, 4] },
  'psiquiatria-adulto': { prices: [150, 200, 350], shifts: [10, 8, 4] },
  'psiquiatria-infantil': { prices: [200, 250, 500], shifts: [10, 8, 4] },
  reumatologia: { prices: [200, 250, 450], shifts: [10, 8, 4] },
  urologia: { prices: [150, 200, 350], shifts: [10, 8, 4] },
  'medico-generalista': { prices: [100, 100, 200], shifts: [10, 8, 4] },
};

const PLANS: PlanId[] = ['popular', 'intermediario', 'premium'];

describe('catálogo de especialidades (golden da planilha)', () => {
  it('tem exatamente as 27 especialidades da planilha', () => {
    expect(SPECIALTIES.map((s) => s.id).sort()).toEqual(Object.keys(GOLDEN).sort());
  });

  it.each(Object.entries(GOLDEN))('%s: preços e plantões por plano', (id, expected) => {
    PLANS.forEach((plan, i) => {
      expect(getConsultationPrice(id, plan), `preço ${id}/${plan}`).toBe(expected.prices[i]);
      expect(getShiftMultiple(id, plan), `plantão ${id}/${plan}`).toBe(expected.shifts[i]);
    });
  });

  it('toda especialidade tem nome legível', () => {
    for (const s of SPECIALTIES) {
      expect(s.name.length).toBeGreaterThan(2);
    }
  });
});

describe('catálogo de programas (golden V8)', () => {
  /** [3m, 6m, 12m] — preços oficiais ao paciente (doc V8 / planilha aba 4). */
  const GOLDEN_PROGRAMS: Record<string, [number, number, number]> = {
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

  it('tem exatamente os 12 programas da linha V8', () => {
    expect(PROGRAMS.map((p) => p.id).sort()).toEqual(Object.keys(GOLDEN_PROGRAMS).sort());
  });

  it.each(Object.entries(GOLDEN_PROGRAMS))('%s: preços por ciclo', (id, prices) => {
    CYCLES.forEach((cycle, i) => {
      expect(getProgramPrice(id, cycle), `preço ${id}/${cycle}m`).toBe(prices[i]);
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
