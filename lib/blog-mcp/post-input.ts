import matter from 'gray-matter'
import { z } from 'zod-v4'
import { authors, DEFAULT_AUTHOR_ID } from '@/lib/authors'
import type { PostFrontmatter } from '@/lib/blog-schema'

/**
 * Entrada das ferramentas de publicação do MCP (`validate_post`/`publish_post`).
 *
 * As descrições de cada campo são lidas pela IA — são elas que a orientam a
 * preencher o artigo com o que importa para SEO (Google) e GEO (IAs). O schema
 * usa zod v4 (`zod-v4`) porque o SDK do MCP exige Standard Schema com JSON
 * Schema; a validação final do frontmatter usa o schema do site (zod v3).
 */

const AUTHOR_IDS = Object.keys(authors) as [string, ...string[]]

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const imageInputSchema = z
  .object({
    url: z
      .string()
      .url()
      .optional()
      .describe('URL pública (https) da imagem. Preferível ao base64 — não pesa na requisição.'),
    base64: z
      .string()
      .optional()
      .describe('Imagem em base64 (sem o prefixo data:). Use só se não houver URL. Máx. ~3 MB.'),
    alt: z
      .string()
      .min(5)
      .describe(
        'Texto alternativo descritivo, em português, de preferência contendo a palavra-chave de forma natural.',
      ),
    filename: z
      .string()
      .regex(/^[a-z0-9-]+\.(png|jpe?g|webp|avif)$/)
      .optional()
      .describe(
        'Nome do arquivo (minúsculas, hífens, com extensão). Ex.: "fluxo-atendimento.webp".',
      ),
  })
  .refine((img) => !!img.url !== !!img.base64, {
    message: 'Informe exatamente um entre `url` e `base64`.',
  })

export type ImageInput = z.infer<typeof imageInputSchema>

const faqInputSchema = z.object({
  question: z.string().min(8).describe('Pergunta como as pessoas buscam.'),
  answer: z.string().min(20).describe('Resposta direta, factual e autocontida (1–3 frases).'),
})

export const postInputSchema = z.object({
  title: z
    .string()
    .min(10)
    .max(110)
    .describe(
      'Título do artigo — vira o H1 da página. Claro, específico e contendo a palavra-chave foco (de preferência no início).',
    ),
  seoTitle: z
    .string()
    .max(70)
    .optional()
    .describe(
      'Meta title (aba do navegador / resultado do Google), se diferente do título. O site acrescenta " | Prontta Saúde", então mantenha até ~48 caracteres.',
    ),
  description: z
    .string()
    .min(50)
    .max(200)
    .describe(
      'Meta description: 120–160 caracteres, com a palavra-chave foco e um convite ao clique. Também é o resumo usado no llms.txt e nos cards.',
    ),
  slug: z
    .string()
    .regex(SLUG_PATTERN)
    .max(80)
    .optional()
    .describe(
      'URL do artigo (/blog/<slug>): minúsculas, sem acentos, palavras separadas por hífen, 3–6 palavras, contendo a palavra-chave. Se omitido, é gerado a partir do título.',
    ),
  focusKeyword: z
    .string()
    .min(3)
    .describe(
      'Palavra-chave principal (a busca que o artigo quer ranquear). Deve aparecer no título, na description, no slug, no primeiro parágrafo e em pelo menos um H2.',
    ),
  keywords: z
    .array(z.string().min(2))
    .max(12)
    .default([])
    .describe('3–8 palavras-chave secundárias, sinônimos e variações long-tail.'),
  category: z
    .string()
    .min(2)
    .describe('Categoria principal (reuse uma existente — veja get_blog_guidelines).'),
  tags: z
    .array(z.string().min(2))
    .max(8)
    .default([])
    .describe('2–6 tags em minúsculas (reuse as existentes quando fizer sentido).'),
  author: z
    .enum(AUTHOR_IDS)
    .default(DEFAULT_AUTHOR_ID)
    .describe('Id do autor cadastrado no site (veja get_blog_guidelines).'),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe('Data de publicação AAAA-MM-DD. Padrão: hoje.'),
  content: z
    .string()
    .min(200)
    .describe(
      'Corpo do artigo em MDX (Markdown). NÃO inclua o título como "# H1" nem o frontmatter. Comece com "**Resumo (TL;DR):** ..." e use "##" (H2) em forma de pergunta. Componente disponível: <Callout title="...">...</Callout>. Imagens internas: ![alt](/blog/images/<slug>/<arquivo>) enviando o arquivo em `images`.',
    ),
  faq: z
    .array(faqInputSchema)
    .default([])
    .describe(
      '3–6 perguntas frequentes — viram rich result FAQ no Google e respostas prontas para IAs.',
    ),
  coverImage: imageInputSchema
    .optional()
    .describe(
      'Imagem de capa (16:9, idealmente 1200×675 ou maior). Aparece no card do blog e no JSON-LD.',
    ),
  images: z
    .array(imageInputSchema)
    .max(10)
    .default([])
    .describe(
      'Imagens usadas no corpo. Cada uma precisa de `filename`, e o corpo deve referenciá-la como /blog/images/<slug>/<filename>.',
    ),
  draft: z
    .boolean()
    .default(false)
    .describe('true = o post não aparece em produção mesmo após o merge.'),
})

export type PostInput = z.infer<typeof postInputSchema>

/** "Telesaúde híbrida: o que é?" → "telesaude-hibrida-o-que-e" */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

export function resolveSlug(input: Pick<PostInput, 'slug' | 'title'>): string {
  return input.slug ?? slugify(input.title)
}

/** Hoje em AAAA-MM-DD no fuso de Brasília. */
export function todayISO(now = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

/** Pasta pública (URL) das imagens de um post. */
export function imageDir(slug: string): string {
  return `/blog/images/${slug}`
}

/**
 * Monta o frontmatter do post (na ordem em que um humano escreveria), sem
 * campos vazios. `coverImagePath` é o caminho público da capa já enviada.
 */
export function buildFrontmatter(
  input: PostInput,
  opts: { coverImagePath?: string; updatedAt?: string; now?: Date } = {},
): PostFrontmatter {
  const fm: Record<string, unknown> = {
    title: input.title.trim(),
    seoTitle: input.seoTitle?.trim() || undefined,
    description: input.description.trim(),
    publishedAt: input.publishedAt ?? todayISO(opts.now),
    updatedAt: opts.updatedAt,
    author: input.author,
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim()),
    focusKeyword: input.focusKeyword.trim(),
    keywords: input.keywords.length ? input.keywords.map((k) => k.trim()) : undefined,
    coverImage: opts.coverImagePath,
    coverImageAlt: opts.coverImagePath ? input.coverImage?.alt.trim() : undefined,
    draft: input.draft || undefined,
    faq: input.faq.length ? input.faq : undefined,
  }
  for (const key of Object.keys(fm)) if (fm[key] === undefined) delete fm[key]
  return fm as PostFrontmatter
}

/** Serializa frontmatter + corpo no formato de content/blog/*.mdx. */
export function toMdx(frontmatter: PostFrontmatter, content: string): string {
  return matter.stringify(`\n${content.trim()}\n`, frontmatter as Record<string, unknown>)
}
