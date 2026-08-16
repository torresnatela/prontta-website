import type { Metadata } from 'next';
import { ProgramasApp } from '@/components/academias/programas/ProgramasApp';
import { getAcademiaProgram } from '@/lib/academias/catalog';
import { parseOfferParams } from '@/lib/academias/params';
import { generateMetadata as buildMetadata } from '@/lib/seo';

/**
 * Variante de COMPARAÇÃO da página do associado: sem player.
 *
 * Mesmo racional de `/academias/simulador/sem-video` — sempre `index: false`,
 * inclusive sem query string, porque é duplicata da canônica
 * `/academias/programas`.
 */

type RawSearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const offer = parseOfferParams(await searchParams);
  const { program } = getAcademiaProgram(offer.programa);

  return buildMetadata({
    title: `${program.name} para associados (versão sem vídeo)`,
    description:
      'Variante de teste da página de programas para associados, com a explicação em passos ilustrados no lugar dos vídeos.',
    path: '/academias/programas/sem-video',
    image: null,
    index: false,
  });
}

export default async function ProgramasSemVideoPage({ searchParams }: PageProps) {
  const offer = parseOfferParams(await searchParams);
  return <ProgramasApp offer={offer} media="imagem" />;
}
