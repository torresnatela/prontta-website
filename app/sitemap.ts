import { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site-config'
import { getAllPosts } from '@/lib/blog'

/**
 * Sitemap dinâmico e AUTO-ATUALIZÁVEL.
 *
 * - As rotas estáticas ficam em STATIC_ROUTES (abaixo).
 *   👉 Ao criar uma NOVA página estática, adicione a rota aqui.
 * - Os posts do blog são incluídos automaticamente a partir de content/blog —
 *   nenhum arquivo .mdx precisa ser listado manualmente; basta criá-lo.
 */

const STATIC_ROUTES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/proposta', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/academias/simulador', changeFrequency: 'monthly', priority: 0.8 },
  // A variante com ?programa/?ciclo/?preco é link de distribuição (noindex);
  // aqui entra só a URL limpa, que é a canônica.
  { path: '/academias/programas', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...postEntries]
}
