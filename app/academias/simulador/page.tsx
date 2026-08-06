import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SimuladorApp } from '@/components/academias/simulador/SimuladorApp';
import { generateMetadata as buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Simulador de receita para academias',
  description:
    'Simule quanto sua academia fatura e lucra oferecendo Programas de Saúde Assistida aos alunos. Escolha o programa, o ciclo, sua margem e a comissão dos personais — o resultado aparece em tempo real.',
  path: '/academias/simulador',
  // O opengraph-image.tsx da rota cuida da imagem.
  image: null,
});

export default function SimuladorAcademiasPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Simulador para academias', path: '/academias/simulador' },
        ])}
      />
      <SimuladorApp />
    </>
  );
}
