import Image from 'next/image';

interface HeroMediaProps {
  /** Caminho em /public. Proporção ~2.33:1 (o hero tem min-height 430px). */
  src: string;
}

/**
 * Foto de fundo do hero dos simuladores.
 *
 * Vai por `next/image` (e não pelo slot `--hero-image` do CSS) porque os
 * arquivos passam de 1 MB: assim o Next entrega AVIF/WebP e `srcset` por
 * largura. O véu em gradiente que garante contraste do texto está no CSS
 * (`.hero-media::after`), junto do resto do hero.
 *
 * Decorativa de propósito — toda a informação já está no texto ao lado.
 */
export function HeroMedia({ src }: HeroMediaProps) {
  return (
    <div className="hero-media" aria-hidden="true">
      <Image src={src} alt="" fill priority sizes="(max-width: 900px) 100vw, 1328px" />
    </div>
  );
}
