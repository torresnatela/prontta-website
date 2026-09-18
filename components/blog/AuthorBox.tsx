import { Linkedin } from 'lucide-react'
import type { Author } from '@/lib/authors'
import { Tag } from '@/components/ui'

/**
 * Caixa de autoria (E-E-A-T). Mostrar nome, cargo, credenciais e bio reforça
 * a confiança que Google e IAs esperam de conteúdo de saúde (YMYL).
 */
export function AuthorBox({ author }: { author: Author }) {
  const linkedin = author.sameAs?.find((url) => url.includes('linkedin.com'))
  const initials = author.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="mt-12 flex flex-col gap-4 rounded-card border border-line bg-card p-6 sm:flex-row sm:items-start">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-soft font-display text-lg font-bold text-cyan-soft-ink">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display font-bold text-ink">{author.name}</p>
          {author.credentials && <Tag>{author.credentials}</Tag>}
        </div>
        <p className="text-[14px] text-ink-3">{author.role}</p>
        <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{author.bio}</p>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-cyan-ink hover:underline"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}
