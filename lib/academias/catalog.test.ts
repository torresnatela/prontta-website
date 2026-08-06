import { describe, expect, it } from 'vitest';
import { getSpecialty } from '@/lib/pricing';
import {
  ACADEMIA_CYCLES,
  ACADEMIA_PROGRAMS,
  DEFAULT_ACADEMIA_CYCLE,
  DEFAULT_ACADEMIA_PROGRAM_ID,
  getAcademiaProgram,
  isAcademiaCycle,
  isAcademiaProgramId,
} from './catalog';

describe('ACADEMIA_PROGRAMS', () => {
  it('tem exatamente os 4 programas do nicho academia', () => {
    expect(ACADEMIA_PROGRAMS.map((p) => p.id)).toEqual([
      'performance',
      'emagrecimento-inteligente',
      'longevidade-ativa',
      'sono-e-energia',
    ]);
  });

  it('resolve todos os ids no catálogo oficial sem lançar', () => {
    for (const entry of ACADEMIA_PROGRAMS) {
      expect(entry.program.id).toBe(entry.id);
      expect(entry.program.costByCycle[6]).toBeGreaterThan(0);
    }
  });

  it('usa um tema visual distinto por programa', () => {
    const themes = ACADEMIA_PROGRAMS.map((p) => p.theme);
    expect(new Set(themes).size).toBe(themes.length);
  });

  it('não declara preço — só copy e apresentação', () => {
    for (const entry of ACADEMIA_PROGRAMS) {
      expect(entry).not.toHaveProperty('price');
      expect(entry).not.toHaveProperty('monthly');
      expect(entry.image).toBeNull();
    }
  });

  it('mantém todas as especialidades das composições resolvíveis', () => {
    // Guarda contra uma edição em programs.ts que órfã uma especialidade.
    for (const entry of ACADEMIA_PROGRAMS) {
      for (const cycle of ACADEMIA_CYCLES) {
        for (const item of entry.program.compositionByCycle[cycle]) {
          expect(() => getSpecialty(item.specialtyId)).not.toThrow();
          expect(item.quantity).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('defaults', () => {
  it('abre em Performance e no ciclo de 6 meses', () => {
    expect(DEFAULT_ACADEMIA_PROGRAM_ID).toBe('performance');
    expect(DEFAULT_ACADEMIA_CYCLE).toBe(6);
    expect(ACADEMIA_CYCLES).toEqual([3, 6, 12]);
  });
});

describe('guards', () => {
  it('isAcademiaProgramId aceita só os 4 do catálogo', () => {
    expect(isAcademiaProgramId('performance')).toBe(true);
    expect(isAcademiaProgramId('sono-e-energia')).toBe(true);
    // Existe em lib/pricing, mas está fora do nicho academia.
    expect(isAcademiaProgramId('mente-em-equilibrio')).toBe(false);
    expect(isAcademiaProgramId('inexistente')).toBe(false);
    expect(isAcademiaProgramId(undefined)).toBe(false);
    expect(isAcademiaProgramId(6)).toBe(false);
  });

  it('isAcademiaCycle aceita só 3, 6 e 12', () => {
    expect(isAcademiaCycle(3)).toBe(true);
    expect(isAcademiaCycle(6)).toBe(true);
    expect(isAcademiaCycle(12)).toBe(true);
    expect(isAcademiaCycle(9)).toBe(false);
    expect(isAcademiaCycle('6')).toBe(false);
    expect(isAcademiaCycle(NaN)).toBe(false);
  });

  it('getAcademiaProgram lança para id fora do catálogo', () => {
    expect(() => getAcademiaProgram('mulher-plena' as never)).toThrow();
  });
});
