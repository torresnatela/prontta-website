import type { PostFrontmatter } from '@/lib/blog-schema'
import { siteConfig } from '@/lib/site-config'
import type { GithubClient, PullRequest } from './github'
import { prepareImage, type PreparedImage } from './images'
import {
  buildFrontmatter,
  imageDir,
  resolveSlug,
  todayISO,
  toMdx,
  type ImageInput,
  type PostInput,
} from './post-input'
import { checkPost, type CheckResult, type ExistingPost } from './seo-check'

/**
 * Regras de validação e publicação usadas pelas ferramentas do MCP. Não
 * conhece o protocolo MCP nem o disco — recebe os posts existentes e uma
 * fábrica do cliente do GitHub (só chamada na hora de commitar, então validar
 * funciona mesmo sem BLOG_GITHUB_TOKEN), o que deixa tudo testável.
 */

export interface ExistingPostFull extends ExistingPost {
  frontmatter: PostFrontmatter
  content: string
}

export interface ValidationReport extends CheckResult {
  slug: string
  url: string
  frontmatter: PostFrontmatter
}

export interface PublishReport extends ValidationReport {
  pullRequest?: PullRequest & { created: boolean }
  commitSha?: string
}

/** Na validação não baixamos imagens: usamos o caminho que elas terão. */
function plannedImagePaths(input: Pick<PostInput, 'images'>, slug: string): string[] {
  return input.images.filter((i) => i.filename).map((i) => `${imageDir(slug)}/${i.filename}`)
}

function plannedCoverPath(cover: ImageInput | undefined, slug: string): string | undefined {
  if (!cover) return undefined
  const ext =
    cover.filename?.split('.').pop() ?? cover.url?.match(/\.(png|jpe?g|webp|avif)(?:\?|$)/i)?.[1]
  return `${imageDir(slug)}/cover.${(ext ?? 'webp').toLowerCase().replace('jpeg', 'jpg')}`
}

function postUrl(slug: string): string {
  return `${siteConfig.url}/blog/${slug}`
}

export async function validatePost(
  input: PostInput,
  existing: ExistingPost[],
  now = new Date(),
): Promise<ValidationReport> {
  const slug = resolveSlug(input)
  const frontmatter = buildFrontmatter(input, {
    coverImagePath: plannedCoverPath(input.coverImage, slug),
    now,
  })
  const result = await checkPost(frontmatter, input.content, {
    slug,
    existingPosts: existing,
    mode: 'create',
    uploadedImages: plannedImagePaths(input, slug),
  })
  return { ...result, slug, url: postUrl(slug), frontmatter }
}

export async function publishPost(
  input: PostInput,
  existing: ExistingPost[],
  getGithub: () => GithubClient,
  now = new Date(),
): Promise<PublishReport> {
  const slug = resolveSlug(input)
  const missingFilename = input.images.find((i) => !i.filename)
  if (missingFilename) {
    throw new Error(
      'Toda imagem em `images` precisa de `filename` (é o nome que o corpo referencia).',
    )
  }

  const cover = input.coverImage ? await prepareImage(input.coverImage, slug, 'cover') : undefined
  const bodyImages = await Promise.all(input.images.map((img) => prepareImage(img, slug)))

  const frontmatter = buildFrontmatter(input, { coverImagePath: cover?.publicPath, now })
  const result = await checkPost(frontmatter, input.content, {
    slug,
    existingPosts: existing,
    mode: 'create',
    uploadedImages: bodyImages.map((i) => i.publicPath),
  })
  const report: PublishReport = { ...result, slug, url: postUrl(slug), frontmatter }
  if (!result.ok) return report

  return commitAndOpenPr(report, input.content, [cover, ...bodyImages], getGithub, 'novo')
}

/** Campos que `update_post` aceita (todos opcionais, exceto o slug). */
export type PostUpdate = Partial<Omit<PostInput, 'slug' | 'images'>> & {
  slug: string
  images?: PostInput['images']
  /** Se false, não mexe no `updatedAt` (ex.: correção de digitação). */
  bumpUpdatedAt?: boolean
  /** Só valida, sem commit nem PR. */
  dryRun?: boolean
}

export async function updatePost(
  update: PostUpdate,
  existing: ExistingPostFull[],
  getGithub: () => GithubClient,
  now = new Date(),
): Promise<PublishReport> {
  const current = existing.find((p) => p.slug === update.slug)
  if (!current) {
    throw new Error(
      `Não existe post publicado com o slug "${update.slug}". Use publish_post para criar.`,
    )
  }
  const { slug } = current

  const cover = update.coverImage ? await prepareImage(update.coverImage, slug, 'cover') : undefined
  const bodyImages = await Promise.all((update.images ?? []).map((img) => prepareImage(img, slug)))

  const fm: Record<string, unknown> = { ...current.frontmatter }
  const fields = [
    'title',
    'seoTitle',
    'description',
    'focusKeyword',
    'keywords',
    'category',
    'tags',
    'author',
    'publishedAt',
    'faq',
    'draft',
  ] as const
  for (const field of fields) {
    if (update[field] !== undefined) fm[field] = update[field]
  }
  if (cover) {
    fm.coverImage = cover.publicPath
    fm.coverImageAlt = cover.alt
  }
  if (update.bumpUpdatedAt !== false) fm.updatedAt = todayISO(now)
  if (fm.draft === false) delete fm.draft
  const frontmatter = fm as PostFrontmatter
  const content = update.content ?? current.content

  const result = await checkPost(frontmatter, content, {
    slug,
    existingPosts: existing,
    mode: 'update',
    uploadedImages: bodyImages.map((i) => i.publicPath),
  })
  const report: PublishReport = { ...result, slug, url: postUrl(slug), frontmatter }
  if (!result.ok || update.dryRun) return report

  return commitAndOpenPr(report, content, [cover, ...bodyImages], getGithub, 'atualização')
}

async function commitAndOpenPr(
  report: PublishReport,
  content: string,
  images: (PreparedImage | undefined)[],
  getGithub: () => GithubClient,
  kind: 'novo' | 'atualização',
): Promise<PublishReport> {
  const { slug, frontmatter } = report
  const branch = `blog/${slug}`
  const files = [
    {
      path: `content/blog/${slug}.mdx`,
      base64: Buffer.from(toMdx(frontmatter, content)).toString('base64'),
    },
    ...images
      .filter((i): i is PreparedImage => !!i)
      .map((i) => ({ path: i.repoPath, base64: i.base64 })),
  ]
  const github = getGithub()
  const verb = kind === 'novo' ? 'publica' : 'atualiza'
  const commitSha = await github.commitFiles(
    branch,
    files,
    `feat(blog): ${verb} "${frontmatter.title}"\n\nEnviado pelo MCP do blog (score SEO/GEO ${report.score}).`,
  )
  const prTitle = `Blog (${kind}): ${frontmatter.title}`
  const pullRequest = await github.openOrUpdatePr(branch, prTitle, prBody(report, kind))
  return { ...report, commitSha, pullRequest }
}

export function prBody(report: ValidationReport, kind: string): string {
  const fm = report.frontmatter
  const row = (label: string, value: unknown) =>
    `| ${label} | ${value === undefined || value === '' ? '—' : String(value).replace(/\|/g, '\\|')} |`
  const warnings = report.warnings.length
    ? report.warnings.map((w) => `- [ ] ${w}`).join('\n')
    : '- Nenhum aviso 🎉'

  return `Artigo (${kind}) enviado por IA via **MCP do blog**. Revise o preview da Vercel antes do merge.

**URL após o merge:** ${report.url}
**Score SEO/GEO:** ${report.score}/100 · ${report.stats.words} palavras · ${report.stats.h2} H2 (${report.stats.questionH2} em pergunta) · ${report.stats.internalLinks} links internos · ${report.stats.externalLinks} externos · ${report.stats.faq} FAQ

| Campo | Valor |
| --- | --- |
${row('Título (H1)', fm.title)}
${row('Meta title', fm.seoTitle ?? fm.title)}
${row('Description', `${fm.description} (${fm.description.length} car.)`)}
${row('Slug', report.slug)}
${row('Palavra-chave foco', fm.focusKeyword)}
${row('Keywords', fm.keywords?.join(', '))}
${row('Categoria', fm.category)}
${row('Tags', fm.tags?.join(', '))}
${row('Autor', fm.author)}
${row('Publicado em', fm.publishedAt)}
${row('Atualizado em', fm.updatedAt)}
${row('Capa', fm.coverImage)}
${row('Rascunho', fm.draft ? 'sim' : 'não')}

### Avisos do validador
${warnings}

### Checklist de revisão humana
- [ ] Fatos, números e fontes conferidos (conteúdo de saúde é YMYL)
- [ ] Nada sugere que a Prontta é plano de saúde ou que a IA faz diagnóstico
- [ ] Preview renderiza bem (capa, tabelas, links)
`
}
