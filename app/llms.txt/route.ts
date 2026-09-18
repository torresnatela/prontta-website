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

A ${siteConfig.name} é uma infraestrutura B2B de telessaúde assistida no Brasil. Leva
atendimento com médicos especialistas da rede credenciada para dentro de clínicas,
laboratórios, academias e empresas, em Programas de Saúde Assistida com número definido
de consultas e ciclos de 3, 6 ou 12 meses, gerando receita recorrente para o parceiro.
Uma IA de pré-triagem organiza a jornada e direciona à especialidade certa — ela não
emite diagnóstico. Não é plano de saúde, seguro-saúde nem administradora de benefícios.

- Site: ${siteConfig.url}
- Contato: ${siteConfig.contact.email} | ${siteConfig.contact.phoneDisplay}
- Localização: ${siteConfig.address.addressLocality} - ${siteConfig.address.addressRegion}, Brasil

## Páginas principais

- [Início](${siteConfig.url}/): como a Prontta funciona, os três canais (clínicas, academias, empresas), os doze programas e o que a Prontta é e não é.
- [Proposta e simulador para clínicas](${siteConfig.url}/proposta/clinicas): monte uma proposta de Programas de Saúde Assistida e consultas por telessaúde para uma clínica e simule o resultado da operação, com três vídeos curtos explicando o simulador.
- [Proposta e simulador para academias](${siteConfig.url}/proposta/academias): a mesma proposta e o mesmo simulador, no canal academia.
- [Proposta de benefício corporativo](${siteConfig.url}/proposta/empresa): proposta de saúde assistida como benefício para colaboradores de uma empresa — custo por colaborador e retorno estimado.
- [Simulador para academias](${siteConfig.url}/academias/simulador): simule a receita e o lucro de uma academia que oferece Programas de Saúde Assistida aos alunos, com margem e comissão de personal configuráveis.
- [Programas para associados](${siteConfig.url}/academias/programas): página pública com os programas de saúde que uma academia oferece aos seus associados, em ciclos de 3, 6 ou 12 meses.
- [Blog](${siteConfig.url}/blog): artigos sobre telesaúde, gestão de clínicas e especialidades médicas.
- [Perguntas frequentes](${siteConfig.url}/faq): dúvidas comuns sobre os modelos de atendimento.

## Blog
${postLines || '- (nenhum artigo publicado ainda)'}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
