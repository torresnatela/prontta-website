import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { authors } from '@/lib/authors'
import { frontmatterSchema, type PostFrontmatter } from '@/lib/blog-schema'
import { siteConfig } from '@/lib/site-config'
import { SLUG_PATTERN, imageDir, slugify } from './post-input'

/**
 * Checagem de SEO (Google) e GEO (IAs generativas) de um artigo antes de ele
 * virar PR. Erros bloqueiam a publicação (quebrariam o build ou a página);
 * avisos são recomendações editoriais que a IA deve tentar resolver.
 */

export interface ExistingPost {
  slug: string
  title: string
  focusKeyword?: string
  keywords?: string[]
}

export interface CheckContext {
  slug: string
  /** Posts já publicados (para links internos e canibalização). */
  existingPosts: ExistingPost[]
  /** 'create' exige slug novo; 'update' exige slug existente. */
  mode: 'create' | 'update'
  /** Caminhos públicos das imagens enviadas junto (ex.: /blog/images/x/a.webp). */
  uploadedImages?: string[]
}

export interface CheckResult {
  ok: boolean
  /** 0–100: 100 menos 5 pontos por aviso (0 se houver erro). */
  score: number
  errors: string[]
  warnings: string[]
  stats: {
    words: number
    h2: number
    questionH2: number
    internalLinks: number
    externalLinks: number
    faq: number
    effectiveTitleLength: number
    descriptionLength: number
  }
}

/** Componentes JSX disponíveis no MDX (components/blog/mdx-components.tsx). */
export const ALLOWED_COMPONENTS = ['Callout']

/** Rotas internas válidas para links (além de /blog/<slug> dos posts). */
export const INTERNAL_ROUTES = [
  '/',
  '/blog',
  '/faq',
  '/proposta',
  '/proposta/clinicas',
  '/proposta/academias',
  '/proposta/empresa',
  '/academias/simulador',
  '/academias/programas',
]

const TITLE_SUFFIX = ` | ${siteConfig.name}`

/** Minúsculas e sem acentos — para comparar palavras-chave. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Remove blocos de código e código inline (não contam como conteúdo/JSX). */
function stripCode(content: string): string {
  return content.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '')
}

/** Texto "legível" do MDX, sem marcação — para contar palavras e keywords. */
export function plainText(content: string): string {
  return stripCode(content)
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function countWords(text: string): number {
  return text ? text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let i = haystack.indexOf(needle)
  while (i !== -1) {
    count++
    i = haystack.indexOf(needle, i + needle.length)
  }
  return count
}

/** Primeiro parágrafo de texto (ignora headings, imagens e componentes). */
function firstParagraph(content: string): string {
  const blocks = stripCode(content)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  return blocks.find((b) => !/^(#|!\[|<|\||---)/.test(b)) ?? ''
}

async function compileError(content: string): Promise<string | null> {
  try {
    await compile(content, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] })
    return null
  } catch (err) {
    const e = err as { message?: string; line?: number; column?: number }
    const where = e.line ? ` (linha ${e.line}${e.column ? `, coluna ${e.column}` : ''})` : ''
    return `O MDX não compila${where}: ${e.message ?? String(err)}. Dica: escape "<" e "{" em texto (use "&lt;" / "\\{") e feche todas as tags.`
  }
}

export async function checkPost(
  frontmatter: PostFrontmatter,
  content: string,
  ctx: CheckContext,
): Promise<CheckResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const { slug } = ctx
  const others = ctx.existingPosts.filter((p) => p.slug !== slug)

  // ── Estrutura / build ────────────────────────────────────────────────────
  const parsed = frontmatterSchema.safeParse(frontmatter)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`Frontmatter inválido — ${issue.path.join('.')}: ${issue.message}`)
    }
  }
  if (!(frontmatter.author in authors)) {
    errors.push(
      `Autor "${frontmatter.author}" não existe. Use um de: ${Object.keys(authors).join(', ')}.`,
    )
  }

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(
      `Slug "${slug}" inválido: use minúsculas, números e hífens (ex.: "${slugify(slug)}").`,
    )
  }
  const slugExists = ctx.existingPosts.some((p) => p.slug === slug)
  if (ctx.mode === 'create' && slugExists) {
    errors.push(
      `Já existe um post com o slug "${slug}". Escolha outro slug ou use update_post para editá-lo.`,
    )
  }
  if (ctx.mode === 'update' && !slugExists) {
    errors.push(`Não existe post publicado com o slug "${slug}". Use publish_post para criar.`)
  }

  const code = stripCode(content)
  if (/^---\s*$/m.test(content.split('\n')[0] ?? '')) {
    errors.push('O corpo começa com "---": não inclua frontmatter no `content`, só o texto.')
  }
  if (/^#\s/m.test(code)) {
    errors.push('O corpo tem "# H1". O título já é o H1 da página — use "##" (H2) e "###" (H3).')
  }
  const components = [...code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1])
  const unknown = [...new Set(components.filter((c) => !ALLOWED_COMPONENTS.includes(c)))]
  if (unknown.length) {
    errors.push(
      `Componente(s) inexistente(s) no MDX: ${unknown.map((c) => `<${c}>`).join(', ')}. Disponíveis: ${ALLOWED_COMPONENTS.map((c) => `<${c}>`).join(', ')}.`,
    )
  }
  if (/\bimport\s.+\sfrom\s|^export\s/m.test(code)) {
    errors.push('Não use import/export no MDX — só Markdown e os componentes disponíveis.')
  }
  const mdxError = await compileError(content)
  if (mdxError) errors.push(mdxError)

  // Imagens
  const images = [...content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)]
  for (const [, alt, src] of images) {
    if (!alt.trim()) errors.push(`Imagem sem texto alternativo: ${src}. Descreva-a no ![alt](...).`)
    if (src.startsWith(`${imageDir(slug)}/`) && ctx.uploadedImages && ctx.mode === 'create') {
      if (!ctx.uploadedImages.includes(src)) {
        errors.push(`A imagem ${src} é usada no corpo mas não foi enviada em \`images\`.`)
      }
    } else if (src.startsWith('/') && !src.startsWith('/blog/images/')) {
      warnings.push(`Imagem ${src} aponta para um caminho local que talvez não exista.`)
    }
  }

  // ── SEO ──────────────────────────────────────────────────────────────────
  const metaTitle = frontmatter.seoTitle ?? frontmatter.title
  const effectiveTitleLength = (metaTitle + TITLE_SUFFIX).length
  if (effectiveTitleLength > 65) {
    warnings.push(
      `Meta title com ${effectiveTitleLength} caracteres (com "${TITLE_SUFFIX.trim()}") — o Google corta por volta de 60–65. Informe um \`seoTitle\` de até ~48 caracteres.`,
    )
  }
  const descriptionLength = frontmatter.description.length
  if (descriptionLength < 120 || descriptionLength > 160) {
    warnings.push(
      `Description com ${descriptionLength} caracteres — o ideal é 120–160 para não ser cortada nem desperdiçar espaço.`,
    )
  }

  const text = plainText(content)
  const words = countWords(text)
  if (words < 800) {
    warnings.push(
      `Corpo com ${words} palavras. Artigos de 1.000–2.000 palavras tendem a ranquear e ser citados melhor.`,
    )
  }

  const headings = [...code.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length,
    text: m[2].trim(),
  }))
  const h2 = headings.filter((h) => h.level === 2)
  const questionH2 = h2.filter((h) => h.text.endsWith('?')).length
  if (h2.length < 3) {
    warnings.push(`Só ${h2.length} H2. Use pelo menos 3 seções "##" para estruturar o artigo.`)
  }

  // Posts antigos não têm `focusKeyword`: a 1ª keyword faz as vezes dela.
  const focus = frontmatter.focusKeyword ?? frontmatter.keywords?.[0]
  const keyword = focus ? normalize(focus) : ''
  if (!frontmatter.focusKeyword) {
    warnings.push('Sem `focusKeyword`: defina a palavra-chave principal do artigo.')
  }
  if (keyword) {
    if (!normalize(`${frontmatter.title} ${metaTitle}`).includes(keyword)) {
      warnings.push(`A palavra-chave "${focus}" não aparece no título.`)
    }
    if (!normalize(frontmatter.description).includes(keyword)) {
      warnings.push(`A palavra-chave "${focus}" não aparece na description.`)
    }
    const keywordSlugWords = slugify(keyword)
      .split('-')
      .filter((w) => w.length > 2)
    if (!keywordSlugWords.every((w) => slug.includes(w))) {
      warnings.push(`O slug "${slug}" não contém a palavra-chave "${focus}".`)
    }
    if (!normalize(plainText(firstParagraph(content))).includes(keyword)) {
      warnings.push('A palavra-chave não aparece no primeiro parágrafo (o TL;DR).')
    }
    if (!headings.some((h) => normalize(h.text).includes(keyword))) {
      warnings.push('A palavra-chave não aparece em nenhum H2/H3.')
    }
    const occurrences = countOccurrences(normalize(text), keyword)
    const density = words ? (occurrences * keyword.split(' ').length * 100) / words : 0
    if (occurrences < 3) {
      warnings.push(
        `A palavra-chave aparece só ${occurrences}× no corpo — use-a (e variações) de forma natural ao longo do texto.`,
      )
    } else if (density > 3) {
      warnings.push(
        `Densidade da palavra-chave em ${density.toFixed(1)}% — acima de ~3% soa como keyword stuffing.`,
      )
    }

    const rival = others.find(
      (p) =>
        (p.focusKeyword && normalize(p.focusKeyword) === keyword) ||
        (!p.focusKeyword && p.keywords?.[0] && normalize(p.keywords[0]) === keyword),
    )
    if (rival) {
      warnings.push(
        `Canibalização: o post "${rival.title}" (/blog/${rival.slug}) já mira "${focus}". Escolha outro ângulo/keyword ou atualize aquele post.`,
      )
    }
  }
  if (!frontmatter.keywords?.length || frontmatter.keywords.length < 3) {
    warnings.push('Informe 3–8 `keywords` secundárias (sinônimos e long-tail).')
  }
  if (!frontmatter.tags.length) warnings.push('Sem tags — informe 2–6 tags.')
  if (!frontmatter.coverImage) {
    warnings.push('Sem imagem de capa — o card do blog fica só com a categoria.')
  }

  // Links
  // Inclui os src de imagens (mesma sintaxe ![]()), descontados logo abaixo.
  const links = [...code.matchAll(/\]\(([^)\s]+)[^)]*\)|href="([^"]+)"/g)].map((m) => m[1] ?? m[2])
  const imageSrcs = new Set(images.map((m) => m[2]))
  const internal = links.filter((l) => l.startsWith('/') && !imageSrcs.has(l))
  const external = links.filter((l) => /^https?:\/\//.test(l) && !l.startsWith(siteConfig.url))
  const validPaths = new Set([
    ...INTERNAL_ROUTES,
    ...ctx.existingPosts.map((p) => `/blog/${p.slug}`),
  ])
  for (const link of internal) {
    const path = link.split(/[?#]/)[0].replace(/\/$/, '') || '/'
    if (!validPaths.has(path)) {
      warnings.push(`Link interno possivelmente quebrado: ${link}.`)
    }
  }
  if (internal.length < 2) {
    warnings.push(
      'Menos de 2 links internos. Linke artigos relacionados (/blog/...) e uma página de conversão (/proposta/clinicas, /proposta/academias ou /proposta/empresa).',
    )
  }

  // ── GEO / AEO ────────────────────────────────────────────────────────────
  const first = firstParagraph(content)
  if (!/tl;?dr|resumo/i.test(first)) {
    warnings.push(
      'O artigo não abre com um resumo. Comece com "**Resumo (TL;DR):** ..." — é o trecho que IAs e o Google mais citam.',
    )
  }
  if (h2.length && questionH2 < Math.ceil(h2.length / 2)) {
    warnings.push(
      `Só ${questionH2} de ${h2.length} H2 são perguntas. Escreva H2 como as perguntas que as pessoas fazem e responda logo abaixo.`,
    )
  }
  const faq = frontmatter.faq ?? []
  if (faq.length < 3 || faq.length > 6) {
    warnings.push(
      `FAQ com ${faq.length} itens — o ideal é 3–6 (vira rich result e resposta de IA).`,
    )
  }
  for (const item of faq) {
    if (!item.question.trim().endsWith('?')) {
      warnings.push(`Pergunta do FAQ sem "?": "${item.question}".`)
    }
    if (item.answer.length > 320) {
      warnings.push(
        `Resposta do FAQ longa (${item.answer.length} car.) para "${item.question}" — seja direto.`,
      )
    }
  }
  if (!external.length) {
    warnings.push(
      'Nenhuma fonte externa. Conteúdo de saúde (YMYL) ganha confiança citando fontes oficiais (lei, CFM, Ministério da Saúde, estudos).',
    )
  }
  const longParagraphs = code
    .split(/\n\s*\n/)
    .filter((b) => !/^(#|\||<|!\[|[-*]\s|\d+\.)/.test(b.trim()))
    .filter((b) => countWords(plainText(b)) > 120).length
  if (longParagraphs) {
    warnings.push(
      `${longParagraphs} parágrafo(s) com mais de 120 palavras — quebre em blocos curtos e autocontidos (mais fáceis de citar por IAs).`,
    )
  }
  if (!/^\s*([-*]|\d+\.)\s/m.test(code) && !/^\|.+\|/m.test(code)) {
    warnings.push(
      'Sem listas nem tabelas — conteúdo estruturado é mais extraído por IAs e snippets.',
    )
  }

  const ok = errors.length === 0
  return {
    ok,
    score: ok ? Math.max(0, 100 - warnings.length * 5) : 0,
    errors,
    warnings,
    stats: {
      words,
      h2: h2.length,
      questionH2,
      internalLinks: internal.length,
      externalLinks: external.length,
      faq: faq.length,
      effectiveTitleLength,
      descriptionLength,
    },
  }
}
