import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod-v4'
import { getAllPosts, getPostBySlug, postKeywords, type PostMeta } from '@/lib/blog'
import type { PostFrontmatter } from '@/lib/blog-schema'
import { siteConfig } from '@/lib/site-config'
import { toMdx } from './post-input'
import { GithubClient, githubConfig } from './github'
import { buildGuidelines, writeArticlePrompt } from './guidelines'
import { postInputSchema, postUpdateFieldsSchema, SLUG_PATTERN } from './post-input'
import { publishPost, updatePost, validatePost, type ExistingPostFull } from './service'

/**
 * Ferramentas do MCP de publicação do blog. Montado em app/api/blog/mcp.
 * Guia de conexão e uso: docs/BLOG-MCP.md.
 */

export const SERVER_INSTRUCTIONS = `Servidor de publicação do blog da Prontta Saúde (telessaúde assistida B2B).
Antes de escrever, chame get_blog_guidelines e list_posts. Depois valide com validate_post e publique com publish_post (ou update_post para posts existentes).
Toda publicação abre um Pull Request para revisão humana — informe o link do PR ao usuário.
Só chame merge_post (coloca o post no ar) quando o usuário pedir explicitamente para publicar.`

type ToolResult = {
  content: { type: 'text'; text: string }[]
  isError?: boolean
}

function text(value: unknown, isError = false): ToolResult {
  const body = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  return { content: [{ type: 'text', text: body }], ...(isError ? { isError: true } : {}) }
}

/** Envolve o handler para devolver erros como resultado legível pela IA. */
function safe<A>(fn: (args: A) => Promise<ToolResult> | ToolResult) {
  return async (args: A): Promise<ToolResult> => {
    try {
      return await fn(args)
    } catch (err) {
      return text(`Erro: ${err instanceof Error ? err.message : String(err)}`, true)
    }
  }
}

function existingPosts(): ExistingPostFull[] {
  return getAllPosts().map((meta) => {
    const post = getPostBySlug(meta.slug)
    const {
      slug,
      readingMinutes: _r,
      wordCount: _w,
      content,
      ...frontmatter
    } = post ?? {
      ...meta,
      content: '',
    }
    return {
      slug,
      title: meta.title,
      focusKeyword: meta.focusKeyword,
      keywords: meta.keywords,
      frontmatter: frontmatter as PostFrontmatter,
      content,
    }
  })
}

function summarize(post: PostMeta) {
  return {
    slug: post.slug,
    url: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    focusKeyword: post.focusKeyword ?? post.keywords?.[0] ?? null,
    keywords: postKeywords(post),
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt ?? null,
    words: post.wordCount,
  }
}

const getGithub = () => new GithubClient(githubConfig())

const updateInputSchema = postUpdateFieldsSchema.extend({
  slug: z.string().regex(SLUG_PATTERN).describe('Slug do post publicado que será atualizado.'),
  bumpUpdatedAt: z
    .boolean()
    .default(true)
    .describe(
      'true (padrão) define updatedAt = hoje — sinal de conteúdo atualizado para Google e IAs. Use false só para correções mínimas.',
    ),
  dryRun: z.boolean().default(false).describe('true = só valida, sem abrir PR.'),
})

export function registerBlogTools(server: McpServer) {
  server.registerTool(
    'get_blog_guidelines',
    {
      title: 'Guia editorial SEO/GEO do blog',
      description:
        'Retorna o guia de escrita do blog da Prontta Saúde: fatos da marca, regras YMYL, estrutura obrigatória do artigo, metadados de SEO/GEO, componentes MDX, autores, categorias, tags e páginas para links internos. CHAME PRIMEIRO, antes de escrever.',
      annotations: { readOnlyHint: true },
    },
    safe(() => text(buildGuidelines(getAllPosts()))),
  )

  server.registerTool(
    'list_posts',
    {
      title: 'Listar posts do blog',
      description:
        'Lista os posts publicados (slug, título, description, categoria, tags, palavra-chave foco) e os PRs de blog ainda em revisão. Use para escolher links internos e evitar repetir a palavra-chave de outro post.',
      annotations: { readOnlyHint: true },
    },
    safe(async () => {
      const published = getAllPosts().map(summarize)
      let inReview: unknown = []
      try {
        inReview = await getGithub().listOpenBlogPrs()
      } catch (err) {
        inReview = `indisponível: ${err instanceof Error ? err.message : String(err)}`
      }
      return text({ published, inReview })
    }),
  )

  server.registerTool(
    'get_post',
    {
      title: 'Ler um post',
      description:
        'Retorna o arquivo MDX completo (frontmatter + corpo) de um post publicado. Use antes de update_post.',
      inputSchema: z.object({ slug: z.string().regex(SLUG_PATTERN).describe('Slug do post.') }),
      annotations: { readOnlyHint: true },
    },
    safe(({ slug }) => {
      const post = existingPosts().find((p) => p.slug === slug)
      if (!post) return text(`Post "${slug}" não encontrado. Veja list_posts.`, true)
      return text(toMdx(post.frontmatter, post.content))
    }),
  )

  server.registerTool(
    'validate_post',
    {
      title: 'Validar artigo (SEO/GEO)',
      description:
        'Valida um artigo novo sem publicar: schema, MDX (compila como no build), palavra-chave, títulos, description, estrutura, FAQ, links e imagens. Retorna erros (bloqueiam), avisos, score 0–100 e o frontmatter final. Mesmos campos de publish_post.',
      inputSchema: postInputSchema,
      annotations: { readOnlyHint: true },
    },
    safe(async (input) => {
      const report = await validatePost(input, existingPosts())
      return text(report)
    }),
  )

  server.registerTool(
    'publish_post',
    {
      title: 'Publicar artigo (abre PR)',
      description:
        'Publica um artigo NOVO: valida, envia capa/imagens, commita content/blog/<slug>.mdx na branch blog/<slug> e abre um Pull Request para revisão (o preview da Vercel sai no PR; o merge coloca no ar). Chamar de novo com o mesmo slug atualiza o PR aberto. Se houver erros de validação, nada é enviado.',
      inputSchema: postInputSchema,
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    safe(async (input) => {
      const report = await publishPost(input, existingPosts(), getGithub)
      if (!report.ok) {
        return text(
          { message: 'Não publicado: corrija os erros e tente de novo.', ...report },
          true,
        )
      }
      return text({
        message: `PR ${report.pullRequest?.created ? 'aberto' : 'atualizado'}: ${report.pullRequest?.url}. Após o merge, o artigo fica em ${report.url}.`,
        ...report,
      })
    }),
  )

  server.registerTool(
    'update_post',
    {
      title: 'Atualizar post existente (abre PR)',
      description:
        'Atualiza um post já publicado: envie o slug e SÓ os campos que mudam (o corpo `content`, se enviado, substitui o anterior inteiro). Define updatedAt = hoje, valida e abre um Pull Request. Use get_post antes para ler a versão atual.',
      inputSchema: updateInputSchema,
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    safe(async (input) => {
      const report = await updatePost(input, existingPosts(), getGithub)
      if (!report.ok) {
        return text(
          { message: 'Não atualizado: corrija os erros e tente de novo.', ...report },
          true,
        )
      }
      if (input.dryRun) return text({ message: 'Validação ok (dryRun — nada enviado).', ...report })
      return text({
        message: `PR ${report.pullRequest?.created ? 'aberto' : 'atualizado'}: ${report.pullRequest?.url}.`,
        ...report,
      })
    }),
  )

  server.registerTool(
    'merge_post',
    {
      title: 'Publicar no site (merge do PR)',
      description:
        'Faz o merge do PR aberto de um post (branch blog/<slug>) — é o que coloca o artigo NO AR. Só chame quando o USUÁRIO pedir explicitamente para publicar/aprovar, depois de revisar o preview; nunca logo após publish_post por conta própria. Recusa se o PR tiver conflito ou se o preview da Vercel não tiver passado. Posts com draft: true continuam ocultos após o merge.',
      inputSchema: z.object({
        slug: z
          .string()
          .regex(SLUG_PATTERN)
          .describe('Slug do post (o PR é o da branch blog/<slug>).'),
        confirm: z
          .literal(true)
          .describe('Precisa ser true: confirma que o usuário pediu para publicar.'),
      }),
      annotations: { destructiveHint: true, idempotentHint: false, openWorldHint: true },
    },
    safe(async ({ slug }) => {
      const merged = await getGithub().mergeBlogPr(`blog/${slug}`)
      return text({
        message: `PR #${merged.number} mesclado. O deploy de produção da Vercel leva ~2 minutos; depois o artigo fica em ${siteConfig.url}/blog/${slug}.`,
        ...merged,
      })
    }),
  )

  server.registerPrompt(
    'escrever_artigo',
    {
      title: 'Escrever artigo para o blog',
      description: 'Roteiro para escrever e publicar um artigo otimizado para SEO e GEO.',
      argsSchema: z.object({
        tema: z.string().describe('Assunto do artigo.'),
        palavra_chave: z.string().describe('Palavra-chave foco.'),
        publico: z.string().optional().describe('Público-alvo (opcional).'),
      }),
    },
    (args) => ({
      messages: [{ role: 'user', content: { type: 'text', text: writeArticlePrompt(args) } }],
    }),
  )
}
