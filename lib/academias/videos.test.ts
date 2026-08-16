import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PLACEHOLDER_YOUTUBE_ID,
  PROGRAMAS_CHAPTERS,
  SIMULADOR_CHAPTERS,
  type ExplainerChapter,
} from './videos';

const PUBLIC_DIR = join(process.cwd(), 'public');

const LISTS: Array<[string, readonly ExplainerChapter[]]> = [
  ['SIMULADOR_CHAPTERS', SIMULADOR_CHAPTERS],
  ['PROGRAMAS_CHAPTERS', PROGRAMAS_CHAPTERS],
];

describe.each(LISTS)('%s', (_name, chapters) => {
  it('não tem capítulo repetido', () => {
    const ids = chapters.map((chapter) => chapter.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('preenche todos os campos que o hub renderiza', () => {
    for (const chapter of chapters) {
      expect(chapter.title.length).toBeGreaterThan(0);
      expect(chapter.summary.length).toBeGreaterThan(0);
      expect(chapter.youtubeId.length).toBeGreaterThan(0);
      expect(chapter.durationLabel.length).toBeGreaterThan(0);
      expect(chapter.bullets.length).toBeGreaterThan(0);
    }
  });

  it('aponta para um poster que existe em public/', () => {
    for (const chapter of chapters) {
      expect(chapter.poster).toMatch(/^\/academias\/capitulos\/[a-z-]+\.svg$/);
      expect(existsSync(join(PUBLIC_DIR, chapter.poster))).toBe(true);
    }
  });

  it('só usa CTA para âncora interna', () => {
    for (const chapter of chapters) {
      if (chapter.cta) {
        expect(chapter.cta.href.startsWith('#')).toBe(true);
        expect(chapter.cta.label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('escopo por público', () => {
  it('dá ao dono os quatro capítulos, incluindo a DRE', () => {
    expect(SIMULADOR_CHAPTERS.map((chapter) => chapter.id)).toEqual([
      'visao-geral',
      'programas',
      'ciclo',
      'dre',
    ]);
  });

  it('nunca expõe DRE ao associado', () => {
    // Custo Prontta, comissão e margem são informação interna da academia —
    // a página pública esconde tudo isso de propósito.
    expect(PROGRAMAS_CHAPTERS.some((chapter) => chapter.id === 'dre')).toBe(false);
    expect(PROGRAMAS_CHAPTERS.map((chapter) => chapter.id)).toEqual([
      'visao-geral',
      'programas',
      'ciclo',
    ]);
  });

  it('reaproveita os mesmos ids nos dois públicos, com títulos próprios', () => {
    // O `ChapterCue` casa por id; os títulos mudam porque a voz muda.
    for (const chapter of PROGRAMAS_CHAPTERS) {
      const owner = SIMULADOR_CHAPTERS.find((entry) => entry.id === chapter.id);
      expect(owner).toBeDefined();
      expect(chapter.title).not.toBe(owner?.title);
    }
  });
});

describe('ids do YouTube', () => {
  it('mantém o formato de 11 caracteres, inclusive no placeholder', () => {
    // Continua valendo depois da troca pelos vídeos definitivos: pega URL
    // inteira colada por engano no lugar do id.
    const ID = /^[\w-]{11}$/;
    expect(PLACEHOLDER_YOUTUBE_ID).toMatch(ID);
    for (const chapter of [...SIMULADOR_CHAPTERS, ...PROGRAMAS_CHAPTERS]) {
      expect(chapter.youtubeId).toMatch(ID);
    }
  });
});
