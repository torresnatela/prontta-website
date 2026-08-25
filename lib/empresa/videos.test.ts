import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EMPRESA_CHAPTERS, EMPRESA_HERO_IMAGE } from './videos';

const PUBLIC_DIR = join(process.cwd(), 'public');

describe('EMPRESA_CHAPTERS', () => {
  it('tem ids únicos e nenhum campo vazio', () => {
    const ids = EMPRESA_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const chapter of EMPRESA_CHAPTERS) {
      expect(chapter.title.trim()).not.toBe('');
      expect(chapter.summary.trim()).not.toBe('');
      expect(chapter.bullets.length).toBeGreaterThan(0);
      expect(chapter.durationLabel.trim()).not.toBe('');
    }
  });

  /**
   * Quem compra benefício não tem P&L para ler. `ChapterCue` renderiza null
   * quando o chapterId não existe, então a ausência aqui já basta — nenhum
   * componente precisa saber do modo.
   */
  it('não tem capítulo de DRE', () => {
    expect(EMPRESA_CHAPTERS.some((c) => c.id === 'dre')).toBe(false);
    expect(EMPRESA_CHAPTERS.some((c) => c.id === 'beneficio')).toBe(true);
    expect(EMPRESA_CHAPTERS.some((c) => c.id === 'retorno')).toBe(true);
  });

  it('não fala a língua do revendedor', () => {
    const texto = EMPRESA_CHAPTERS.flatMap((c) => [c.title, c.summary, ...c.bullets]).join(' ');
    expect(texto).not.toMatch(/sua margem|revenda|resultado líquido|DRE/i);
  });

  it('aponta para posters que existem em public/', () => {
    for (const chapter of EMPRESA_CHAPTERS) {
      expect(chapter.poster).toMatch(/^\/proposta-midia\/capitulos\/[a-z-]+\.svg$/);
      expect(existsSync(join(PUBLIC_DIR, chapter.poster))).toBe(true);
    }
    expect(existsSync(join(PUBLIC_DIR, EMPRESA_HERO_IMAGE))).toBe(true);
  });

  it('todo CTA aponta para uma âncora interna da própria página', () => {
    for (const chapter of EMPRESA_CHAPTERS) {
      expect(chapter.cta?.href).toMatch(/^#[a-z-]+$/);
    }
  });
});
