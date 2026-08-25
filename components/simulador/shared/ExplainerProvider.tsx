'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ExplainerChapter } from '@/lib/academias/videos';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** id da <section> do hub — alvo da rolagem do `<ChapterCue>`. */
export const EXPLAINER_SECTION_ID = 'entenda';

/**
 * Como cada capítulo é apresentado.
 *
 * `video`  — player facade do YouTube (rotas principais).
 * `imagem` — só a capa ilustrada, sem player (rotas /sem-video).
 *
 * As duas variantes existem lado a lado de propósito, para comparar se o vídeo
 * paga o custo de produção ou se texto + imagem já explicam o suficiente.
 */
export type ExplainerMedia = 'video' | 'imagem';

interface ExplainerContextValue {
  chapters: readonly ExplainerChapter[];
  media: ExplainerMedia;
  activeId: string;
  /** Troca o capítulo sem rolar — usado pela própria lista do hub. */
  setActiveId: (id: string) => void;
  /** Troca o capítulo E rola até o hub — usado pelos atalhos nos passos. */
  openChapter: (id: string) => void;
}

const ExplainerContext = createContext<ExplainerContextValue | null>(null);

interface ExplainerProviderProps {
  /** Lista do público desta página: `SIMULADOR_CHAPTERS` ou `PROGRAMAS_CHAPTERS`. */
  chapters: readonly ExplainerChapter[];
  media?: ExplainerMedia;
  children: ReactNode;
}

/**
 * Estado do hub de capítulos.
 *
 * Fica em contexto (e não dentro de `ExplainerSection`) por um motivo só: os
 * atalhos "▶ ver vídeo" moram longe, espalhados pelos passos do simulador, e
 * precisam ativar o capítulo certo sem que a página inteira passe props.
 */
export function ExplainerProvider({
  chapters,
  media = 'video',
  children,
}: ExplainerProviderProps) {
  const [activeId, setActiveId] = useState(chapters[0].id);
  const prefersReducedMotion = usePrefersReducedMotion();

  const openChapter = useCallback(
    (id: string) => {
      setActiveId(id);
      document.getElementById(EXPLAINER_SECTION_ID)?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [prefersReducedMotion],
  );

  const value = useMemo(
    () => ({ chapters, media, activeId, setActiveId, openChapter }),
    [chapters, media, activeId, openChapter],
  );

  return <ExplainerContext.Provider value={value}>{children}</ExplainerContext.Provider>;
}

export function useExplainer(): ExplainerContextValue {
  const context = useContext(ExplainerContext);
  if (!context) {
    throw new Error('useExplainer deve ser usado dentro de <ExplainerProvider>');
  }
  return context;
}
