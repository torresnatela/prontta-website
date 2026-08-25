'use client';

import { ChapterCue } from '@/components/simulador/shared/ChapterCue';

interface StepHeaderProps {
  /** Número exibido no `.step-dot`. */
  step: number;
  /** Rótulo curto ao lado do número, ex.: "Monte as consultas". */
  tag: string;
  title: string;
  lead?: string;
  /** Capítulo da camada explicativa que este passo abre. */
  chapterId?: string;
}

/**
 * Cabeçalho de um passo do simulador: número + rótulo à esquerda, atalho para o
 * vídeo à direita.
 *
 * Mesma receita de `components/academias/simulador/StepsColumn.tsx` — existe
 * como componente aqui porque /proposta tem seis passos, e repetir a marcação
 * seis vezes é onde ela começa a divergir entre um passo e outro.
 */
export function StepHeader({ step, tag, title, lead, chapterId }: StepHeaderProps) {
  return (
    <div className="section-head">
      <div>
        <div className="step-tag">
          <span className="step-dot" aria-hidden="true">
            {step}
          </span>{' '}
          {tag}
        </div>
        <h2>{title}</h2>
        {lead ? <p>{lead}</p> : null}
      </div>
      {chapterId ? <ChapterCue chapterId={chapterId} /> : null}
    </div>
  );
}
