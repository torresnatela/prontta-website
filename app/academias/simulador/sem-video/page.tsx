import type { Metadata } from 'next';
import { SimuladorApp } from '@/components/academias/simulador/SimuladorApp';
import { generateMetadata as buildMetadata } from '@/lib/seo';

/**
 * Variante de COMPARAÇÃO do simulador: mesma camada explicativa, sem player.
 *
 * Existe para medir se o vídeo paga o custo de produção ou se capa + texto já
 * explicam o suficiente. `index: false` de propósito — é conteúdo duplicado de
 * `/academias/simulador`, que continua sendo a URL canônica e a única no
 * sitemap. Ao encerrar o teste, apague esta pasta e o `variantHref` do
 * `SimuladorApp`.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Simulador de receita para academias (versão sem vídeo)',
  description:
    'Variante de teste do simulador de receita para academias, com a explicação em passos ilustrados no lugar dos vídeos.',
  path: '/academias/simulador/sem-video',
  image: null,
  index: false,
});

export default function SimuladorSemVideoPage() {
  // Sem JsonLd de breadcrumb: a página é noindex, não deve disputar SERP com a
  // canônica.
  return <SimuladorApp media="imagem" />;
}
