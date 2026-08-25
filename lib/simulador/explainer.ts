/**
 * Forma dos capítulos da camada explicativa — compartilhada por /academias e
 * /proposta.
 *
 * Só o CONTRATO mora aqui. As listas de capítulos ficam com cada página, porque
 * o conteúdo muda conforme o público: `lib/academias/videos.ts` (dono da
 * academia e associado) e `lib/proposta/videos.ts` (parceiro comercial).
 *
 * Quem renderiza é `components/simulador/shared/ExplainerSection.tsx`.
 */

export interface ExplainerChapter {
  /** Também é o alvo do `<ChapterCue chapterId="…">` espalhado pelos passos. */
  id: string;
  /** Título do capítulo — muda conforme o público. */
  title: string;
  /** Uma ou duas linhas, exibidas abaixo do player. */
  summary: string;
  /** Três pontos-chave. Podem dar lugar a um bloco próprio via `bulletsSlot`. */
  bullets: readonly string[];
  /** ID do vídeo no YouTube (o player usa youtube-nocookie). */
  youtubeId: string;
  /** Rótulo humano da duração, ex.: "2 min". Aparece na lista e no play. */
  durationLabel: string;
  /** Capa 16:9 local. `next/image` serve .svg sem otimizar (as-is). */
  poster: string;
  /** Atalho para a parte da página que o capítulo explica. */
  cta?: { label: string; href: string };
}

/**
 * Vídeo genérico enquanto os oficiais não existem: "Big Buck Bunny", da Blender
 * Foundation (Creative Commons). Escolhido por ser estável, público e
 * obviamente placeholder — ninguém confunde com material comercial da Prontta.
 *
 * ⚠️ Enquanto um capítulo apontar para cá, NÃO publique JSON-LD `VideoObject`
 * para ele: seria dado estruturado descrevendo um vídeo que não é o anunciado.
 */
export const PLACEHOLDER_YOUTUBE_ID = 'aqz-KE-bpKQ';
