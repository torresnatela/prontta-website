/**
 * Cliente mínimo da API REST do GitHub para o MCP do blog.
 *
 * Cada publicação vira um commit único (Git Data API: blobs → tree → commit →
 * ref) numa branch `blog/<slug>` e um Pull Request contra a branch base. A
 * Vercel gera o preview do PR; o merge publica em produção.
 *
 * Env: BLOG_GITHUB_TOKEN (fine-grained PAT com Contents + Pull requests RW só
 * neste repo), BLOG_GITHUB_REPO (owner/repo) e BLOG_GITHUB_BASE (branch base).
 */

export interface GithubConfig {
  token: string
  repo: string
  base: string
}

export interface FileToCommit {
  path: string
  /** Conteúdo em base64. */
  base64: string
}

export interface PullRequest {
  number: number
  url: string
  title: string
  branch: string
  updatedAt: string
}

export function githubConfig(env = process.env): GithubConfig {
  const token = env.BLOG_GITHUB_TOKEN
  if (!token) {
    throw new Error(
      'BLOG_GITHUB_TOKEN não configurado no servidor — não é possível abrir o PR. Veja docs/BLOG-MCP.md.',
    )
  }
  return {
    token,
    repo: env.BLOG_GITHUB_REPO || 'torresnatela/prontta-website',
    base: env.BLOG_GITHUB_BASE || 'main',
  }
}

export class GithubClient {
  constructor(
    private readonly config: GithubConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.fetchImpl(`https://api.github.com/repos/${this.config.repo}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.config.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new GithubError(
        res.status,
        `GitHub ${method} ${path} → ${res.status}: ${detail.slice(0, 300)}`,
      )
    }
    return (res.status === 204 ? undefined : await res.json()) as T
  }

  /** SHA do topo de uma branch, ou null se ela não existir. */
  async branchSha(branch: string): Promise<string | null> {
    try {
      const ref = await this.request<{ object: { sha: string } }>(
        'GET',
        `/git/ref/heads/${encodeBranch(branch)}`,
      )
      return ref.object.sha
    } catch (err) {
      if (err instanceof GithubError && err.status === 404) return null
      throw err
    }
  }

  async findOpenPr(branch: string): Promise<PullRequest | null> {
    const owner = this.config.repo.split('/')[0]
    const prs = await this.request<RawPr[]>(
      'GET',
      `/pulls?state=open&head=${encodeURIComponent(`${owner}:${branch}`)}`,
    )
    return prs[0] ? toPr(prs[0]) : null
  }

  /** PRs abertos cujas branches começam com `blog/`. */
  async listOpenBlogPrs(): Promise<PullRequest[]> {
    const prs = await this.request<RawPr[]>('GET', '/pulls?state=open&per_page=100')
    return prs.filter((pr) => pr.head.ref.startsWith('blog/')).map(toPr)
  }

  /**
   * Commita `files` num único commit em `branch`. Se a branch já tem PR aberto,
   * empilha o commit (a revisão continua no mesmo PR); caso contrário, (re)cria
   * a branch a partir da base.
   */
  async commitFiles(branch: string, files: FileToCommit[], message: string): Promise<string> {
    const baseSha = await this.branchSha(this.config.base)
    if (!baseSha) throw new Error(`Branch base "${this.config.base}" não encontrada.`)

    const branchSha = await this.branchSha(branch)
    const openPr = branchSha ? await this.findOpenPr(branch) : null
    const parentSha = branchSha && openPr ? branchSha : baseSha

    const parent = await this.request<{ tree: { sha: string } }>('GET', `/git/commits/${parentSha}`)
    const tree = await Promise.all(
      files.map(async (file) => {
        const blob = await this.request<{ sha: string }>('POST', '/git/blobs', {
          content: file.base64,
          encoding: 'base64',
        })
        return { path: file.path, mode: '100644', type: 'blob', sha: blob.sha }
      }),
    )
    const newTree = await this.request<{ sha: string }>('POST', '/git/trees', {
      base_tree: parent.tree.sha,
      tree,
    })
    const commit = await this.request<{ sha: string }>('POST', '/git/commits', {
      message,
      tree: newTree.sha,
      parents: [parentSha],
    })

    if (branchSha) {
      // Sem PR aberto, a branch é resto de um PR antigo: recomeça da base.
      await this.request('PATCH', `/git/refs/heads/${encodeBranch(branch)}`, {
        sha: commit.sha,
        force: !openPr,
      })
    } else {
      await this.request('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha })
    }
    return commit.sha
  }

  /** Abre o PR (ou atualiza título/descrição do que já está aberto). */
  async openOrUpdatePr(
    branch: string,
    title: string,
    body: string,
  ): Promise<PullRequest & { created: boolean }> {
    const existing = await this.findOpenPr(branch)
    if (existing) {
      const pr = await this.request<RawPr>('PATCH', `/pulls/${existing.number}`, { title, body })
      return { ...toPr(pr), created: false }
    }
    const pr = await this.request<RawPr>('POST', '/pulls', {
      title,
      body,
      head: branch,
      base: this.config.base,
    })
    // Rótulo é conveniência para filtrar no GitHub — não falha a publicação.
    await this.request('POST', `/issues/${pr.number}/labels`, { labels: ['blog'] }).catch(() => {})
    return { ...toPr(pr), created: true }
  }
}

export class GithubError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

interface RawPr {
  number: number
  html_url: string
  title: string
  updated_at: string
  head: { ref: string }
}

function toPr(pr: RawPr): PullRequest {
  return {
    number: pr.number,
    url: pr.html_url,
    title: pr.title,
    branch: pr.head.ref,
    updatedAt: pr.updated_at,
  }
}

/** Codifica cada segmento da branch, preservando as barras. */
function encodeBranch(branch: string): string {
  return branch.split('/').map(encodeURIComponent).join('/')
}
