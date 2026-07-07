import { getAllPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'

/**
 * /llms.txt — índice curado do site para modelos de IA (padrão emergente
 * llmstxt.org). Resume a Prontta e lista os artigos publicados, facilitando
 * que IAs descubram, entendam e citem o conteúdo (AEO/GEO).
 *
 * Gerado estaticamente: novos posts entram automaticamente a cada build.
 */
export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const postLines = posts
    .map((post) => `- [${post.title}](${siteConfig.url}/blog/${post.slug}): ${post.description}`)
    .join('\n')

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

A ${siteConfig.name} é uma empresa de terceirização de serviços médicos para clínicas e
hospitais no Brasil. Oferece telesaúde híbrida (atendimento presencial com apoio de
especialista remoto), agenda médica dedicada e agenda on demand, ajudando instituições
de saúde a ampliar a oferta de especialidades com qualidade e menor custo operacional.

- Site: ${siteConfig.url}
- Contato: ${siteConfig.contact.email} | ${siteConfig.contact.phoneDisplay}
- Localização: ${siteConfig.address.addressLocality} - ${siteConfig.address.addressRegion}, Brasil

## Páginas principais

- [Início](${siteConfig.url}/): visão geral dos serviços de terceirização médica e telesaúde híbrida.
- [Proposta e simulador](${siteConfig.url}/proposta): monte uma proposta de Programas de Saúde Assistida e consultas por telessaúde e simule o resultado da operação.
- [Blog](${siteConfig.url}/blog): artigos sobre telesaúde, gestão de clínicas e especialidades médicas.
- [Perguntas frequentes](${siteConfig.url}/faq): dúvidas comuns sobre os modelos de atendimento.

## Blog
${postLines || '- (nenhum artigo publicado ainda)'}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
