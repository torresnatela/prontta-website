import Image from 'next/image';
import { ACADEMIA_PROGRAMS } from '@/lib/academias/catalog';

/**
 * Galeria de capas que substitui os bullets no capítulo "programas" das páginas
 * /academias.
 *
 * Existe porque o popover do catálogo some em ≤900px e no toque — sem ela,
 * ninguém no celular veria as capas.
 *
 * Mora aqui, e não dentro de `ExplainerSection`, porque é conteúdo de academia:
 * o hub é compartilhado com /proposta, que também tem um capítulo `programas`
 * (Programas de Saúde Assistida) e não deve mostrar este catálogo.
 */
export function ProgramGallery() {
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
