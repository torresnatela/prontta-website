import { authors } from '@/lib/authors'
import type { PostMeta } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'
import { ALLOWED_COMPONENTS, INTERNAL_ROUTES } from './seo-check'

/**
 * Playbook editorial entregue à IA pela ferramenta `get_blog_guidelines` (e
 * pelo prompt `escrever_artigo`). É a "fonte da verdade" de como escrever para
 * o blog da Prontta com SEO e GEO — mantenha alinhado a content/blog/README.md.
 */

const ROUTE_NOTES: Record<string, string> = {
  '/': 'Home — como a Prontta funciona, os três canais e os programas.',
  '/blog': 'Listagem do blog.',
  '/faq': 'Perguntas frequentes sobre os modelos de atendimento.',
  '/proposta': 'Atalho para /proposta/clinicas (redirect).',
  '/proposta/clinicas': 'Proposta + simulador para CLÍNICAS (principal CTA de conversão).',
  '/proposta/academias': 'Proposta + simulador para ACADEMIAS.',
  '/proposta/empresa': 'Proposta de benefício corporativo para EMPRESAS.',
  '/academias/simulador': 'Simulador de receita/lucro para academias.',
  '/academias/programas': 'Programas de saúde que a academia oferece aos associados.',
}

export function buildGuidelines(posts: PostMeta[]): string {
  const categories = [...new Set(posts.map((p) => p.category))]
  const tags = [...new Set(posts.flatMap((p) => p.tags))]
  const authorLines = Object.values(authors)
    .map(
      (a) =>
        `- \`${a.id}\` — ${a.name} (${a.role}${'credentials' in a && a.credentials ? `, ${a.credentials}` : ''})`,
    )
    .join('\n')
  const postLines = posts.length
    ? posts
        .map(
          (p) =>
            `- /blog/${p.slug} — "${p.title}" · keyword foco: ${p.focusKeyword ?? p.keywords?.[0] ?? '—'}`,
        )
        .join('\n')
    : '- (nenhum)'

  return `# Blog da ${siteConfig.name} — guia de publicação (SEO + GEO)

Você vai escrever um artigo para ${siteConfig.url}/blog e enviá-lo pelas ferramentas deste MCP.
O envio abre um Pull Request no GitHub; um humano revisa o preview e faz o merge.

## Fluxo obrigatório
1. \`list_posts\` — veja o que já existe (evite repetir a palavra-chave foco de outro post e colete links internos).
2. Escreva o artigo seguindo as regras abaixo.
3. \`validate_post\` — corrija TODOS os erros e o máximo de avisos (mire score ≥ 85).
4. \`publish_post\` (novo) ou \`update_post\` (post existente). Informe ao usuário o link do PR.
   Para ajustar um artigo ainda em revisão, chame \`publish_post\` de novo com o MESMO slug — o PR é atualizado.

## Sobre a ${siteConfig.name} (use estes fatos; não invente outros)
- ${siteConfig.description}
- Infraestrutura B2B de telessaúde assistida no Brasil: leva médicos especialistas da rede credenciada
  para dentro de clínicas, laboratórios, academias e empresas, em Programas de Saúde Assistida com número
  definido de consultas e ciclos de 3, 6 ou 12 meses, gerando receita recorrente para o parceiro.
- Telesaúde híbrida: o paciente é atendido presencialmente no parceiro, com apoio de um profissional local,
  enquanto o especialista participa por vídeo.
- Uma IA de pré-triagem organiza a jornada e direciona à especialidade certa — ela NÃO emite diagnóstico.
- A Prontta NÃO é plano de saúde, seguro-saúde nem administradora de benefícios. Nunca sugira o contrário.
- Sede: ${siteConfig.address.addressLocality}/${siteConfig.address.addressRegion}. Contato: ${siteConfig.contact.email}.
- Público do blog: donos e gestores de clínicas, academias e RH de empresas (B2B), não pacientes.

## Regras de conteúdo de saúde (YMYL / E-E-A-T)
- Nada de promessas de cura, diagnóstico ou resultado clínico garantido. Tom informativo e responsável.
- Números e afirmações regulatórias precisam de fonte: Lei nº 14.510/2022 (telessaúde), resoluções do CFM
  (ex.: Resolução CFM nº 2.314/2022 — telemedicina), Ministério da Saúde, ANS, IBGE, estudos. Linke a fonte oficial.
- Não invente estatísticas. Se não tiver o dado, descreva qualitativamente.
- Português do Brasil, frases curtas, voz ativa, sem jargão desnecessário.

## Estrutura do artigo (o que o \`content\` deve ter)
- NÃO escreva "# Título" (o H1 é o campo \`title\`) nem frontmatter.
- 1º parágrafo: \`**Resumo (TL;DR):** ...\` com 2–3 frases que respondem a pergunta principal e contêm a palavra-chave foco.
  É o trecho que Google e IAs mais citam.
- 1 parágrafo de contexto (a dor do leitor).
- 4–7 seções \`## \` (H2), a maioria formulada como PERGUNTA que o público busca. Logo abaixo de cada H2,
  responda em 1–2 frases diretas; depois aprofunde. Use \`### \` (H3) para subtópicos.
- Parágrafos curtos (≤ 120 palavras) e autocontidos — cada bloco deve fazer sentido se citado sozinho.
- Pelo menos uma lista e, quando houver comparação, uma tabela Markdown.
- Definições explícitas ("X é ...") e dados concretos com fonte.
- 2+ links internos (artigos relacionados + uma página de conversão) e 1+ link externo para fonte oficial.
- Termine com uma seção de próximo passo/CTA levando a /proposta/clinicas, /proposta/academias ou /proposta/empresa.
- 1.000–2.000 palavras.

### Markdown/MDX disponível
- Markdown com GFM (tabelas, listas, citações, negrito, links).
- Componentes: ${ALLOWED_COMPONENTS.map((c) => `<${c}>`).join(', ')} — uso: \`<Callout title="Opcional">Texto de destaque.</Callout>\`
  (deixe uma linha em branco antes e depois).
- NÃO use outros componentes, import/export, HTML com atributos JS, nem "{" ou "<" soltos no texto (escape como "\\{" e "&lt;").
- Imagens no corpo: \`![texto alternativo](/blog/images/<slug>/<arquivo>)\` e envie o arquivo no campo \`images\`
  (com o mesmo \`filename\`). Todas as imagens precisam de alt descritivo.

## Metadados (SEO)
- \`focusKeyword\`: a busca principal (ex.: "telemedicina para clínicas"). Deve estar no título, na description,
  no slug, no TL;DR, em pelo menos um H2 e aparecer 3+ vezes no texto (densidade ≤ 3%).
- \`title\` (H1): até ~70 caracteres, keyword no início.
- \`seoTitle\`: meta title de até ~48 caracteres (o site acrescenta " | ${siteConfig.name}"). Use quando o título for longo.
- \`description\`: 120–160 caracteres, com a keyword e um motivo para clicar.
- \`slug\`: 3–6 palavras, minúsculas, sem acento, com a keyword. Não muda depois de publicado.
- \`keywords\`: 3–8 variações/long-tail/sinônimos (ex.: plural, "como ...", "quanto custa ...").
- \`category\`: reuse uma existente quando fizer sentido. \`tags\`: 2–6, minúsculas.
- \`faq\`: 3–6 perguntas reais (terminam com "?") com respostas diretas de 1–3 frases — viram rich result FAQPage
  e respostas prontas para IAs. Não repita literalmente os H2.
- \`coverImage\`: 16:9 (≥ 1200×675), URL https ou base64, com \`alt\` descritivo. Sem capa, o card mostra só a categoria.
- \`author\`: um dos ids abaixo.

## Autores
${authorLines}

## Categorias existentes
${categories.length ? categories.map((c) => `- ${c}`).join('\n') : '- (nenhuma)'}

## Tags existentes
${tags.length ? tags.join(', ') : '(nenhuma)'}

## Páginas para links internos
${INTERNAL_ROUTES.map((r) => `- ${r} — ${ROUTE_NOTES[r] ?? ''}`).join('\n')}

## Posts publicados
${postLines}

## O que o site faz sozinho (não repita no conteúdo)
Meta tags, Open Graph (imagem gerada a partir do título), JSON-LD Article + FAQPage + BreadcrumbList,
sitemap.xml, llms.txt, sumário lateral, box do autor e posts relacionados.
`
}

export function writeArticlePrompt(args: {
  tema: string
  palavra_chave: string
  publico?: string
}): string {
  return `Escreva e publique um artigo para o blog da ${siteConfig.name}.

- Tema: ${args.tema}
- Palavra-chave foco: ${args.palavra_chave}
- Público: ${args.publico ?? 'donos e gestores de clínicas, academias e empresas'}

Passos:
1. Chame \`get_blog_guidelines\` e siga TODAS as regras.
2. Chame \`list_posts\` para evitar canibalização e escolher 2+ links internos.
3. Escreva o artigo completo (TL;DR, H2 em perguntas, dados com fonte, FAQ, CTA).
4. Chame \`validate_post\`, corrija os erros e o máximo de avisos (score ≥ 85).
5. Chame \`publish_post\` e me devolva o link do Pull Request e um resumo dos metadados (title, description, slug, keywords).`
}
