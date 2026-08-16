'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ACADEMIA_PROGRAMS } from '@/lib/academias/catalog';
import type { ExplainerChapter } from '@/lib/academias/videos';
import { cn } from '@/lib/utils';
import { EXPLAINER_SECTION_ID, useExplainer } from './ExplainerProvider';
import { VideoFacade } from './VideoFacade';

interface ExplainerSectionProps {
  /** Rótulo da pílula acima do título. */
  kicker: string;
  title: string;
  lead: string;
  /** Link para a mesma página na outra variante (com ↔ sem vídeo). */
  variantHref?: string;
}

/** Capa do capítulo sem player — a variante /sem-video. */
function ChapterIllustration({ chapter }: { chapter: ExplainerChapter }) {
  return (
    <div className="video-frame chapter-illustration">
      <Image
        className="video-poster"
        src={chapter.poster}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 640px"
      />
    </div>
  );
}

/** Galeria que substitui os bullets no capítulo dos programas.
 *  Existe porque o popover do catálogo some em ≤900px e no toque — sem ela,
 *  ninguém no celular veria as capas. */
function ProgramGallery() {
  return (
    <div className="chapter-gallery">
      {ACADEMIA_PROGRAMS.map((program) => (
        <figure key={program.id} data-card={program.theme}>
          <Image src={program.image} alt="" width={320} height={180} sizes="180px" />
          <figcaption>
            <strong>{program.shortName}</strong>
            <small>{program.tagline}</small>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * O hub "Entenda antes de simular": lista de capítulos à esquerda, player e
 * texto à direita. Estado vem do `ExplainerProvider` para que os atalhos
 * espalhados pelos passos (`ChapterCue`) possam trocar o capítulo daqui.
 */
export function ExplainerSection({ kicker, title, lead, variantHref }: ExplainerSectionProps) {
  const { chapters, media, activeId, setActiveId } = useExplainer();
  const active = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];
  const isVideo = media === 'video';

  return (
    <section className="explainer" id={EXPLAINER_SECTION_ID} aria-labelledby="explainer-title">
      <div className="explainer-head">
        <div className="explainer-head-top">
          <div>
            <div className="step-tag">
              <span className="step-dot" aria-hidden="true">
                {isVideo ? '▶' : '★'}
              </span>{' '}
              {kicker}
            </div>
            <h2 id="explainer-title">{title}</h2>
          </div>
          {variantHref ? (
            <Link className="variant-switch" href={variantHref}>
              {isVideo ? 'Ver esta página sem vídeo →' : 'Ver esta página com vídeo →'}
            </Link>
          ) : null}
        </div>
        <p className="panel-lead">{lead}</p>
      </div>

      <div className="explainer-grid">
        <div className="chapter-list" role="tablist" aria-label="Capítulos do guia">
          {chapters.map((chapter, index) => {
            const isActive = chapter.id === active.id;
            return (
              <button
                key={chapter.id}
                type="button"
                role="tab"
                id={`chapter-tab-${chapter.id}`}
                aria-selected={isActive}
                aria-controls="chapter-panel"
                className={cn('chapter-item', isActive && 'active')}
                onClick={() => setActiveId(chapter.id)}
              >
                <span className="step-dot" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  <strong>{chapter.title}</strong>
                  {/* Duração só faz sentido onde existe algo para assistir. */}
                  {isVideo ? <small>{chapter.durationLabel}</small> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="chapter-body"
          id="chapter-panel"
          role="tabpanel"
          aria-labelledby={`chapter-tab-${active.id}`}
          tabIndex={-1}
        >
          {/* A key remonta o player: trocar de capítulo nunca deixa o vídeo
              anterior tocando por baixo do novo texto. */}
          {isVideo ? (
            <VideoFacade
              key={active.id}
              youtubeId={active.youtubeId}
              title={active.title}
              poster={active.poster}
              durationLabel={active.durationLabel}
            />
          ) : (
            <ChapterIllustration key={active.id} chapter={active} />
          )}

          <h3>{active.title}</h3>
          <p>{active.summary}</p>

          {active.id === 'programas' ? (
            <ProgramGallery />
          ) : (
            <ul className="chapter-bullets">
              {active.bullets.map((bullet) => (
                <li key={bullet}>
                  <b aria-hidden="true">✓</b>
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {active.cta ? (
            <a className="chapter-cta" href={active.cta.href}>
              {active.cta.label} →
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
