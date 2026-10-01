import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { frontmatterSchema, type PostFrontmatter } from './blog-schema'

/**
 * Camada de dados do blog (MDX baseado em arquivos).
 *
 * Os posts ficam em /content/blog/*.mdx. Adicionar um arquivo .mdx é tudo o
 * que se precisa: ele passa a aparecer na listagem, no sitemap.xml e no
 * llms.txt automaticamente no próximo build. NÃO há lista manual de posts.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export { frontmatterSchema, postKeywords, type PostFrontmatter } from './blog-schema'

export interface PostMeta extends PostFrontmatter {
  slug: string
  /** Tempo de leitura em minutos (arredondado). */
  readingMinutes: number
  /** Número de palavras do corpo (vai para o JSON-LD `wordCount`). */
  wordCount: number
}

export interface Post extends PostMeta {
  /** Corpo MDX cru (sem frontmatter). */
  content: string
}

const isProd = process.env.NODE_ENV === 'production'

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'))
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)

  const parsed = frontmatterSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(
      `Frontmatter inválido em content/blog/${fileName}:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    )
  }

  const stats = readingTime(content)
  return {
    ...parsed.data,
    slug,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    wordCount: stats.words,
    content,
  }
}

/** Todos os posts (sem o corpo), ordenados do mais novo ao mais antigo. */
export function getAllPosts(): PostMeta[] {
  return getMdxFiles()
    .map((file) => {
      const { content: _content, ...meta } = readPost(file)
      return meta
    })
    .filter((post) => !isProd || !post.draft)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
}

/** Um post completo (com corpo MDX) pelo slug, ou null se não existir. */
export function getPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.mdx`
  if (!fs.existsSync(path.join(BLOG_DIR, fileName))) return null
  const post = readPost(fileName)
  if (isProd && post.draft) return null
  return post
}

/** Slugs para generateStaticParams. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug)
}

/** Tags únicas com contagem de posts. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/** Posts relacionados por tags em comum (exclui o próprio). */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getAllPosts().find((p) => p.slug === slug)
  if (!current) return []
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      shared: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.post)
}

/** Formata uma data ISO para exibição em pt-BR (ex.: "23 de junho de 2026"). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
