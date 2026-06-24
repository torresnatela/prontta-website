import { Linkedin } from 'lucide-react'
import type { Author } from '@/lib/authors'

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
    <div className="mt-12 flex flex-col gap-4 rounded-2xl border-2 border-accent-light bg-accent-light/30 p-6 sm:flex-row sm:items-start">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-cyan/15 font-display text-lg font-bold text-primary-cyan">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <p className="font-display font-bold text-primary-navy">{author.name}</p>
          {author.credentials && (
            <span className="rounded-full bg-primary-cyan/10 px-2.5 py-0.5 text-xs font-medium text-primary-cyan">
              {author.credentials}
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-gray">{author.role}</p>
        <p className="mt-2 text-primary-navy/80 leading-relaxed">{author.bio}</p>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-cyan hover:underline"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}
