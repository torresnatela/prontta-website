// @vitest-environment node
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { frontmatterSchema } from '@/lib/blog-schema'
import { buildFrontmatter, postInputSchema, slugify, todayISO, toMdx } from './post-input'

const base = postInputSchema.parse({
  title: 'Telesaúde híbrida: o que é e como funciona',
  description: 'Entenda a telesaúde híbrida e como ela amplia especialidades na sua clínica.',
  focusKeyword: 'telesaúde híbrida',
  keywords: ['telemedicina híbrida'],
  category: 'Telesaúde',
  tags: ['telesaúde'],
  content: '**Resumo (TL;DR):** texto '.repeat(20),
  faq: [
    {
      question: 'O que é telesaúde híbrida?',
      answer: 'Um modelo com apoio presencial e médico remoto.',
    },
  ],
})

describe('slugify', () => {
  it('remove acentos, pontuação e espaços', () => {
    expect(slugify('Telesaúde híbrida: o que é?')).toBe('telesaude-hibrida-o-que-e')
    expect(slugify('  Ações — 2026!! ')).toBe('acoes-2026')
  })
})

describe('todayISO', () => {
  it('usa o fuso de Brasília', () => {
    expect(todayISO(new Date('2026-09-30T02:00:00Z'))).toBe('2026-09-29')
  })
})

describe('postInputSchema', () => {
  it('aplica defaults', () => {
    expect(base.author).toBe('equipe-prontta')
    expect(base.images).toEqual([])
    expect(base.draft).toBe(false)
  })

  it('exige exatamente url ou base64 na imagem', () => {
    const bad = postInputSchema.safeParse({ ...base, coverImage: { alt: 'Capa do artigo' } })
    expect(bad.success).toBe(false)
  })
})

describe('toMdx', () => {
  it('gera frontmatter que o site aceita e mantém datas como texto', () => {
    const fm = buildFrontmatter(base, {
      coverImagePath: '/blog/images/x/cover.webp',
      now: new Date('2026-09-30T15:00:00Z'),
    })
    const mdx = toMdx(fm, base.content)
    const { data, content } = matter(mdx)

    expect(data.publishedAt).toBe('2026-09-30')
    expect(data.coverImageAlt).toBeUndefined() // sem coverImage no input
    expect(data).not.toHaveProperty('draft')
    expect(content.trim().startsWith('**Resumo')).toBe(true)
    expect(frontmatterSchema.safeParse(data).success).toBe(true)
  })
})
