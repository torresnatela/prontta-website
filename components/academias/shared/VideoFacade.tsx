'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VideoFacadeProps {
  youtubeId: string;
  title: string;
  /** Capa local 16:9. */
  poster: string;
  durationLabel?: string;
}

/** `rel=0` mantém as sugestões do fim dentro do canal; `playsinline` evita o
 *  fullscreen forçado do iOS. */
const EMBED_PARAMS = 'autoplay=1&rel=0&modestbranding=1&playsinline=1';

/**
 * Player "facade": mostra só a capa até o clique.
 *
 * Nenhum iframe, script ou cookie do YouTube antes do play — o mesmo cuidado que
 * `components/CookieConsent.tsx` toma com o GA. Depois do clique o embed vem de
 * `youtube-nocookie.com`.
 *
 * Não usa o `YouTubeEmbed` de `@next/third-parties` de propósito: ele baixa o
 * lite-youtube de uma CDN externa e aponta para o domínio com cookie.
 */
export function VideoFacade({ youtubeId, title, poster, durationLabel }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video-frame">
        <iframe
          className="video-embed"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${EMBED_PARAMS}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video-frame video-facade"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${title}`}
    >
      {/* Decorativa: o título do vídeo já está no aria-label e no texto ao lado. */}
      <Image
        className="video-poster"
        src={poster}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 640px"
      />
      <span className="video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
      <span className="video-meta" aria-hidden="true">
        <strong>Assistir ao vídeo</strong>
        {durationLabel ? <small>{durationLabel}</small> : null}
      </span>
    </button>
  );
}
