import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACADEMIA_HERO_IMAGE } from '@/lib/academias/catalog';
import { PROPOSTA_CHAPTERS, heroImageFor } from './videos';

const PUBLIC_DIR = join(process.cwd(), 'public');

describe('PROPOSTA_CHAPTERS', () => {
  it('são os três vídeos gravados, na ordem em que foram gravados', () => {
    expect(PROPOSTA_CHAPTERS.map((c) => c.id)).toEqual(['visao-geral', 'programas', 'dre']);
    expect(PROPOSTA_CHAPTERS.map((c) => c.title)).toEqual([
      'Como fazer uma simulação',
      'Programas de Saúde Assistida',
      'Resultado final da proposta',
    ]);
  });

  it('não tem placeholder do YouTube: todo capítulo é MP4 público no Vercel Blob', () => {
    for (const chapter of PROPOSTA_CHAPTERS) {
      expect(chapter.video.kind).toBe('file');
      if (chapter.video.kind === 'file') {
        expect(chapter.video.src).toMatch(
          /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/proposta\/[a-z-]+\.mp4$/,
        );
      }
    }
  });

  it('preenche todos os campos que o hub renderiza', () => {
    for (const chapter of PROPOSTA_CHAPTERS) {
      expect(chapter.title.trim()).not.toBe('');
      expect(chapter.summary.trim()).not.toBe('');
      expect(chapter.bullets.length).toBeGreaterThan(0);
      expect(chapter.durationLabel).toMatch(/^\d+ min$/);
    }
  });

  it('as capas são frames reais (.jpg) que existem em public/', () => {
    for (const chapter of PROPOSTA_CHAPTERS) {
      expect(chapter.poster).toBe(`/proposta-midia/capitulos/${chapter.id}.jpg`);
      expect(existsSync(join(PUBLIC_DIR, chapter.poster))).toBe(true);
    }
  });

  it('todo CTA aponta para uma âncora interna da própria página', () => {
    for (const chapter of PROPOSTA_CHAPTERS) {
      expect(chapter.cta?.href).toMatch(/^#[a-z-]+$/);
    }
  });
});

describe('heroImageFor', () => {
  it('clínicas e academias usam a foto real do hero de /academias', () => {
    expect(heroImageFor('clinica')).toBe(ACADEMIA_HERO_IMAGE);
    expect(heroImageFor('academia')).toBe(ACADEMIA_HERO_IMAGE);
  });

  it('os demais canais seguem com a arte placeholder', () => {
    expect(heroImageFor('empresa')).toBe('/proposta-midia/hero-proposta.svg');
  });

  it('todo caminho devolvido existe em public/', () => {
    for (const clientType of [
      'clinica',
      'academia',
      'empresa',
      'farmacia',
      'laboratorio',
    ] as const) {
      expect(existsSync(join(PUBLIC_DIR, heroImageFor(clientType)))).toBe(true);
    }
  });
});
