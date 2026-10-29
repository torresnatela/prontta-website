// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { GithubClient } from './github'

type Route = { method: string; path: RegExp; status?: number; body?: unknown }

/** fetch falso que responde por método + regex do caminho e grava as chamadas. */
function fakeFetch(routes: Route[]) {
  const calls: { method: string; path: string; body?: unknown }[] = []
  const fn = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const path = String(url).replace('https://api.github.com/repos/o/r', '')
    const method = init?.method ?? 'GET'
    calls.push({ method, path, body: init?.body ? JSON.parse(String(init.body)) : undefined })
    const route = routes.find((r) => r.method === method && r.path.test(path))
    if (!route) return new Response('not found', { status: 404 })
    return Response.json(route.body ?? {}, { status: route.status ?? 200 })
  })
  return { fn: fn as unknown as typeof fetch, calls }
}

const common: Route[] = [
  { method: 'GET', path: /^\/git\/ref\/heads\/main$/, body: { object: { sha: 'base' } } },
  { method: 'GET', path: /^\/git\/commits\//, body: { tree: { sha: 'tree0' } } },
  { method: 'POST', path: /^\/git\/blobs$/, body: { sha: 'blob1' } },
  { method: 'POST', path: /^\/git\/trees$/, body: { sha: 'tree1' } },
  { method: 'POST', path: /^\/git\/commits$/, body: { sha: 'commit1' } },
]

const pr = {
  number: 7,
  html_url: 'https://github.com/o/r/pull/7',
  title: 't',
  updated_at: 'x',
  head: { ref: 'blog/a' },
}
const client = (fn: typeof fetch) => new GithubClient({ token: 't', repo: 'o/r', base: 'main' }, fn)

describe('GithubClient', () => {
  it('cria branch nova a partir da base e abre PR com label', async () => {
    const { fn, calls } = fakeFetch([
      ...common,
      { method: 'POST', path: /^\/git\/refs$/, body: {} },
      { method: 'GET', path: /^\/pulls\?state=open&head=/, body: [] },
      { method: 'POST', path: /^\/pulls$/, body: pr },
      { method: 'POST', path: /^\/issues\/7\/labels$/, body: [] },
    ])
    const gh = client(fn)
    const sha = await gh.commitFiles(
      'blog/a',
      [{ path: 'content/blog/a.mdx', base64: 'eA==' }],
      'msg',
    )
    const result = await gh.openOrUpdatePr('blog/a', 'Título', 'corpo')

    expect(sha).toBe('commit1')
    expect(calls.find((c) => c.path === '/git/commits' && c.method === 'POST')?.body).toMatchObject(
      {
        parents: ['base'],
      },
    )
    expect(calls.find((c) => c.path === '/git/refs')?.body).toEqual({
      ref: 'refs/heads/blog/a',
      sha: 'commit1',
    })
    expect(result).toMatchObject({ number: 7, created: true })
    expect(calls.some((c) => c.path === '/issues/7/labels')).toBe(true)
  })

  it('empilha commit na branch que já tem PR aberto e atualiza o PR', async () => {
    const { fn, calls } = fakeFetch([
      ...common,
      { method: 'GET', path: /^\/git\/ref\/heads\/blog\/a$/, body: { object: { sha: 'head' } } },
      { method: 'GET', path: /^\/pulls\?state=open&head=/, body: [pr] },
      { method: 'PATCH', path: /^\/git\/refs\/heads\/blog\/a$/, body: {} },
      { method: 'PATCH', path: /^\/pulls\/7$/, body: pr },
    ])
    const gh = client(fn)
    await gh.commitFiles('blog/a', [{ path: 'x', base64: 'eA==' }], 'msg')
    const result = await gh.openOrUpdatePr('blog/a', 'Título', 'corpo')

    expect(calls.find((c) => c.path === '/git/commits' && c.method === 'POST')?.body).toMatchObject(
      {
        parents: ['head'],
      },
    )
    expect(calls.find((c) => c.path === '/git/refs/heads/blog/a')?.body).toEqual({
      sha: 'commit1',
      force: false,
    })
    expect(result.created).toBe(false)
  })

  it('recomeça da base (force) quando a branch sobrou de PR fechado', async () => {
    const { fn, calls } = fakeFetch([
      ...common,
      { method: 'GET', path: /^\/git\/ref\/heads\/blog\/a$/, body: { object: { sha: 'old' } } },
      { method: 'GET', path: /^\/pulls\?state=open&head=/, body: [] },
      { method: 'PATCH', path: /^\/git\/refs\/heads\/blog\/a$/, body: {} },
    ])
    await client(fn).commitFiles('blog/a', [{ path: 'x', base64: 'eA==' }], 'msg')
    expect(calls.find((c) => c.path === '/git/commits' && c.method === 'POST')?.body).toMatchObject(
      {
        parents: ['base'],
      },
    )
    expect(calls.find((c) => c.path === '/git/refs/heads/blog/a')?.body).toMatchObject({
      force: true,
    })
  })
})
