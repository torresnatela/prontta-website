// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { PostFrontmatter } from '@/lib/blog-schema'
import { checkPost, countWords, normalize, plainText } from './seo-check'

const filler = (n: number) => Array.from({ length: n }, (_, i) => `palavra${i}`).join(' ') + '.'

const goodContent = `**Resumo (TL;DR):** A telemedicina para clínicas permite oferecer especialidades sem contratar médicos fixos, com apoio presencial e especialista por vídeo.

A maioria das clínicas perde pacientes por falta de especialistas. ${filler(80)}

## O que é telemedicina para clínicas?

Telemedicina para clínicas é o atendimento remoto de especialistas dentro da clínica. ${filler(100)}

- Mais especialidades
- Menos custo fixo

## Como a telemedicina para clínicas funciona?

O paciente vai à clínica e o especialista entra por vídeo. ${filler(100)}

<Callout title="Importante">A telessaúde é regulamentada pela [Lei nº 14.510/2022](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14510.htm).</Callout>

## Quanto custa?

Depende do volume de consultas. ${filler(100)} Veja também [telesaúde híbrida](/blog/telesaude-hibrida-o-que-e).

| Modelo | Custo |
| --- | --- |
| Presencial | Alto |

## Próximo passo

${filler(90)} Simule na [proposta para clínicas](/proposta/clinicas). ${filler(100)} ${filler(100)} ${filler(100)}
`

const goodFm: PostFrontmatter = {
  title: 'Telemedicina para clínicas: como ampliar especialidades',
  seoTitle: 'Telemedicina para clínicas: guia completo',
  description:
    'Veja como a telemedicina para clínicas amplia especialidades sem contratar médicos fixos, com custos menores e apoio presencial ao paciente.',
  publishedAt: '2026-09-30',
  author: 'equipe-prontta',
  category: 'Telesaúde',
  tags: ['telesaúde', 'gestão de clínicas'],
  focusKeyword: 'telemedicina para clínicas',
  keywords: ['telemedicina clínica', 'teleconsulta especialista', 'telessaúde para clínicas'],
  coverImage: '/blog/images/telemedicina-para-clinicas/cover.webp',
  coverImageAlt: 'Médico atendendo por vídeo em clínica',
  draft: false,
  faq: [
    { question: 'Telemedicina é permitida?', answer: 'Sim, pela Lei nº 14.510/2022.' },
    {
      question: 'Precisa de equipe presencial?',
      answer: 'Sim, um profissional local apoia o exame.',
    },
    { question: 'Quais especialidades?', answer: 'Cardiologia, endocrinologia e outras.' },
  ],
}

const ctx = {
  slug: 'telemedicina-para-clinicas',
  existingPosts: [
    {
      slug: 'telesaude-hibrida-o-que-e',
      title: 'Telesaúde híbrida',
      keywords: ['telesaúde híbrida'],
    },
  ],
  mode: 'create' as const,
  uploadedImages: [],
}

describe('helpers', () => {
  it('normaliza acentos e caixa', () => {
    expect(normalize('Telessaúde  Híbrida')).toBe('telessaude hibrida')
  })
  it('conta palavras do texto sem marcação', () => {
    expect(countWords(plainText('## Título\n\n**Olá** [mundo](/x) `code`'))).toBe(3)
  })
})

describe('checkPost', () => {
  it('aprova um artigo bem estruturado com score alto', async () => {
    const result = await checkPost(goodFm, goodContent, ctx)
    expect(result.errors).toEqual([])
    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.stats.internalLinks).toBe(2)
    expect(result.stats.externalLinks).toBe(1)
  })

  it('bloqueia H1 no corpo, componente desconhecido e MDX quebrado', async () => {
    const bad = `# Título\n\n<Grafico dados="x" />\n\nTexto com <div> sem fechar.`
    const result = await checkPost(goodFm, bad, ctx)
    expect(result.ok).toBe(false)
    expect(result.score).toBe(0)
    expect(result.errors.join('\n')).toMatch(/H1/)
    expect(result.errors.join('\n')).toMatch(/<Grafico>/)
    expect(result.errors.join('\n')).toMatch(/não compila/)
  })

  it('bloqueia slug duplicado ao criar e autor inexistente', async () => {
    const result = await checkPost({ ...goodFm, author: 'fulano' }, goodContent, {
      ...ctx,
      slug: 'telesaude-hibrida-o-que-e',
    })
    expect(result.errors.join('\n')).toMatch(/Já existe um post/)
    expect(result.errors.join('\n')).toMatch(/Autor "fulano"/)
  })

  it('bloqueia imagem sem alt e imagem do post não enviada', async () => {
    const content = `${goodContent}\n\n![](/blog/images/telemedicina-para-clinicas/a.webp)`
    const result = await checkPost(goodFm, content, ctx)
    expect(result.errors.join('\n')).toMatch(/sem texto alternativo/)
    expect(result.errors.join('\n')).toMatch(/não foi enviada/)
  })

  it('avisa sobre keyword ausente, description curta, canibalização e link quebrado', async () => {
    const result = await checkPost(
      { ...goodFm, focusKeyword: 'telesaúde híbrida', description: 'Curta.' },
      `${goodContent}\n\n[link](/blog/nao-existe)`,
      ctx,
    )
    const all = result.warnings.join('\n')
    expect(all).toMatch(/não aparece no título/)
    expect(all).toMatch(/Description com 6/)
    expect(all).toMatch(/Canibalização/)
    expect(all).toMatch(/\/blog\/nao-existe/)
  })

  it('avisa quando não abre com TL;DR', async () => {
    const result = await checkPost(goodFm, goodContent.replace('**Resumo (TL;DR):**', ''), ctx)
    expect(result.warnings.join('\n')).toMatch(/não abre com um resumo/)
  })
})
