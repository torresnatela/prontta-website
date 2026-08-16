import Image from 'next/image';

/**
 * Foto de fundo do hero das páginas /academias.
 *
 * Vai por `next/image` (e não pelo slot `--hero-image` do CSS) porque o arquivo
 * é um PNG de ~1,1 MB: assim o Next entrega AVIF/WebP e `srcset` por largura.
 * O véu em gradiente que garante contraste do texto está no CSS
 * (`.hero-media::after`), junto do resto do hero.
 *
 * Decorativa de propósito — toda a informação já está no texto ao lado.
 */
export function HeroMedia() {
  return (
    <div className="hero-media" aria-hidden="true">
      <Image
        src="/academias/hero-academias.png"
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 1328px"
      />
    </div>
  );
}
