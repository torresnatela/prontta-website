import { z } from 'zod'
import { DEFAULT_AUTHOR_ID } from './authors'

/**
 * Schema do frontmatter dos posts (content/blog/*.mdx).
 *
 * Fica separado de lib/blog.ts (que lê o disco e é server-only) porque também
 * é usado pelo MCP de publicação (lib/blog-mcp) para validar um artigo ANTES de
 * ele virar arquivo — e pelos testes.
 */
export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  /** Meta title (≤ 60 caracteres). Se ausente, o `title` (H1) é usado. */
  seoTitle: z.string().optional(),
  description: z.string().min(1),
  publishedAt: z.string().min(1), // ISO date: 2026-06-23
  updatedAt: z.string().optional(),
  author: z.string().default(DEFAULT_AUTHOR_ID),
  category: z.string().default('Geral'),
  tags: z.array(z.string()).default([]),
  /** Palavra-chave principal do artigo (a busca que ele quer ranquear). */
  focusKeyword: z.string().optional(),
  /** Palavras-chave secundárias / long-tail. */
  keywords: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  /** Texto alternativo da capa (acessibilidade + SEO de imagem). */
  coverImageAlt: z.string().optional(),
  draft: z.boolean().default(false),
  faq: z.array(faqItemSchema).optional(),
})

export type PostFrontmatter = z.infer<typeof frontmatterSchema>

/** Palavra-chave foco + secundárias, sem duplicatas (para meta e JSON-LD). */
export function postKeywords(post: Pick<PostFrontmatter, 'focusKeyword' | 'keywords'>): string[] {
  const all = [post.focusKeyword, ...(post.keywords ?? [])].filter(
    (k): k is string => !!k && k.trim().length > 0,
  )
  return [...new Set(all.map((k) => k.trim()))]
}
