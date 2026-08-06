import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { ProgramasApp } from '@/components/academias/programas/ProgramasApp';
import { getAcademiaProgram } from '@/lib/academias/catalog';
import { hasOfferParams, parseOfferParams } from '@/lib/academias/params';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

type RawSearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  /** No Next 16 `searchParams` é uma Promise — precisa de await. */
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const raw = await searchParams;
  const offer = parseOfferParams(raw);
  const { program, publicDescription } = getAcademiaProgram(offer.programa);

  return buildMetadata({
    title: `${program.name} para associados`,
    description: publicDescription,
    // Canonical SEM query string: o link parametrizado é canal de distribuição,
    // não ativo de SEO (`?preco=` geraria variantes infinitas).
    path: '/academias/programas',
    image: null,
    index: !hasOfferParams(raw),
  });
}

export default async function ProgramasAcademiasPage({ searchParams }: PageProps) {
  // Resolvido no servidor: sem <Suspense>, sem mismatch de hidratação, e o preço
  // já sai no HTML (o que importa para o preview do link no WhatsApp).
  const offer = parseOfferParams(await searchParams);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Programas para associados', path: '/academias/programas' },
        ])}
      />
      <ProgramasApp offer={offer} />
    </>
  );
}
