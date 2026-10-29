// @vitest-environment node
import matter from 'gray-matter'
import { describe, expect, it, vi } from 'vitest'
import type { GithubClient } from './github'
import { postInputSchema } from './post-input'
import { publishPost, updatePost, validatePost, type ExistingPostFull } from './service'

const PNG_1PX =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

const input = postInputSchema.parse({
  title: 'Telemedicina para clínicas: guia prático',
  description: 'Como a telemedicina para clínicas amplia especialidades.',
  focusKeyword: 'telemedicina para clínicas',
  category: 'Telesaúde',
  content: `**Resumo (TL;DR):** telemedicina para clínicas. ${'texto '.repeat(60)}\n\n![Fluxo](/blog/images/telemedicina-para-clinicas-guia-pratico/fluxo.png)`,
  coverImage: { base64: PNG_1PX, alt: 'Capa do artigo' },
  images: [{ base64: PNG_1PX, alt: 'Fluxo', filename: 'fluxo.png' }],
})

const existing: ExistingPostFull[] = [
  {
    slug: 'antigo',
    title: 'Antigo',
    frontmatter: {
      title: 'Antigo',
      description: 'Descrição antiga.',
      publishedAt: '2026-01-01',
      author: 'equipe-prontta',
      category: 'Geral',
      tags: [],
      draft: false,
    },
    content: '**Resumo (TL;DR):** corpo antigo.\n\n## Seção?\n\nTexto.',
  },
]

function fakeGithub() {
  const gh = {
    commitFiles: vi.fn(async () => 'sha1'),
    openOrUpdatePr: vi.fn(async (branch: string) => ({
      number: 1,
      url: 'https://github.com/o/r/pull/1',
      title: 't',
      branch,
      updatedAt: 'x',
      created: true,
    })),
  }
  return { gh, get: () => gh as unknown as GithubClient }
}

const now = new Date('2026-09-30T15:00:00Z')

describe('validatePost', () => {
  it('gera slug e caminho de capa sem baixar nada', async () => {
    const report = await validatePost(input, existing, now)
    expect(report.slug).toBe('telemedicina-para-clinicas-guia-pratico')
    expect(report.frontmatter.coverImage).toBe(
      '/blog/images/telemedicina-para-clinicas-guia-pratico/cover.webp',
    )
    expect(report.errors).toEqual([])
  })
})

describe('publishPost', () => {
  it('commita mdx + imagens na branch blog/<slug> e abre PR', async () => {
    const { gh, get } = fakeGithub()
    const report = await publishPost(input, existing, get, now)

    expect(report.ok).toBe(true)
    expect(report.pullRequest?.url).toContain('/pull/1')
    const [branch, files] = gh.commitFiles.mock.calls[0] as unknown as [
      string,
      { path: string; base64: string }[],
    ]
    expect(branch).toBe('blog/telemedicina-para-clinicas-guia-pratico')
    expect(files.map((f) => f.path)).toEqual([
      'content/blog/telemedicina-para-clinicas-guia-pratico.mdx',
      'public/blog/images/telemedicina-para-clinicas-guia-pratico/cover.png',
      'public/blog/images/telemedicina-para-clinicas-guia-pratico/fluxo.png',
    ])
    const { data } = matter(Buffer.from(files[0].base64, 'base64').toString())
    expect(data).toMatchObject({
      coverImage: '/blog/images/telemedicina-para-clinicas-guia-pratico/cover.png',
      coverImageAlt: 'Capa do artigo',
      focusKeyword: 'telemedicina para clínicas',
      publishedAt: '2026-09-30',
    })
  })

  it('não chama o GitHub quando há erro de validação', async () => {
    const { gh, get } = fakeGithub()
    const report = await publishPost(
      { ...input, content: `# H1\n\n${input.content}` },
      existing,
      get,
    )
    expect(report.ok).toBe(false)
    expect(gh.commitFiles).not.toHaveBeenCalled()
  })

  it('recusa imagem que não é imagem', async () => {
    const { get } = fakeGithub()
    await expect(
      publishPost(
        { ...input, coverImage: { base64: 'aGVsbG8=', alt: 'Capa inválida' } },
        existing,
        get,
      ),
    ).rejects.toThrow(/não é PNG/)
  })
})

describe('updatePost', () => {
  it('mescla campos, define updatedAt e mantém o resto', async () => {
    const { gh, get } = fakeGithub()
    const report = await updatePost(
      { slug: 'antigo', description: 'Nova descrição.' },
      existing,
      get,
      now,
    )
    expect(report.ok).toBe(true)
    expect(report.frontmatter).toMatchObject({
      title: 'Antigo',
      description: 'Nova descrição.',
      updatedAt: '2026-09-30',
    })
    expect(gh.openOrUpdatePr.mock.calls[0][0]).toBe('blog/antigo')
  })

  it('dryRun não commita', async () => {
    const { gh, get } = fakeGithub()
    await updatePost({ slug: 'antigo', dryRun: true }, existing, get, now)
    expect(gh.commitFiles).not.toHaveBeenCalled()
  })

  it('falha para slug inexistente', async () => {
    await expect(updatePost({ slug: 'nao-existe' }, existing, fakeGithub().get)).rejects.toThrow(
      /Não existe post/,
    )
  })
})
