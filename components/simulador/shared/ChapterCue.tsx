'use client';

import { useExplainer } from './ExplainerProvider';

interface ChapterCueProps {
  /** `id` do capítulo em `SIMULADOR_CHAPTERS` / `PROGRAMAS_CHAPTERS`. */
  chapterId: string;
  /** Rótulo no modo vídeo. Sem isto: "Ver vídeo · 2 min". */
  label?: string;
  /** Rótulo no modo imagem. Sem isto: "Entender este passo". */
  labelImagem?: string;
}

/**
 * Atalho "▶ ver vídeo" ao lado do título de um passo: ativa o capítulo
 * correspondente e rola até o hub.
 *
 * Some sozinho quando o capítulo não existe para o público daquela página — é o
 * que permite deixar o atalho da DRE no código sem vazá-lo para o associado.
 */
export function ChapterCue({ chapterId, label, labelImagem }: ChapterCueProps) {
  const { chapters, media, openChapter } = useExplainer();
  const chapter = chapters.find((entry) => entry.id === chapterId);

  if (!chapter) return null;

  const isVideo = media === 'video';
  const text = isVideo
    ? (label ?? `Ver vídeo · ${chapter.durationLabel}`)
    : (labelImagem ?? 'Entender este passo');

  return (
    <button
      type="button"
      className="chapter-cue"
      onClick={() => openChapter(chapter.id)}
      aria-label={`${isVideo ? 'Ver o vídeo' : 'Ler a explicação'}: ${chapter.title}`}
    >
      <span aria-hidden="true">{isVideo ? '▶' : '↓'}</span>
      {text}
    </button>
  );
}
