import Link from 'next/link'
import GithubSlugger from 'github-slugger'

/**
 * Sumário (índice) do artigo, gerado a partir dos headings H2/H3 do MDX.
 * Usa o mesmo slugger do rehype-slug, então as âncoras batem com os ids
 * gerados no conteúdo. Bom para usabilidade e para leitura por IA.
 */

interface Heading {
  level: 2 | 3
  text: string
  id: string
}

export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let inFence = false

  for (const line of content.split('\n')) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    // Remove marcações inline simples (negrito/itálico/código/links) do texto.
    const text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .trim()

    headings.push({
      level: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    })
  }

  return headings
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content).filter((h) => h.level === 2 || h.level === 3)
  if (headings.length < 3) return null

  return (
    <nav aria-label="Sumário" className="rounded-xl border border-line bg-card p-5">
      <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-cyan-ink">
        Neste artigo
      </p>
      <ul className="space-y-2 text-[14px]">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <Link
              href={`#${heading.id}`}
              className="line-clamp-2 text-ink-2 transition-colors hover:text-ink"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
