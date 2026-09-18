import { CalendarDays, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'
import { formatDate } from '@/lib/blog'
import type { Author } from '@/lib/authors'
import { Tag } from '@/components/ui'

/**
 * Cabeçalho do artigo: categoria, título (H1), descrição e metadados
 * (autor, data, tempo de leitura). H1 único por página para SEO.
 */
export function ArticleHeader({ post, author }: { post: PostMeta; author: Author }) {
  return (
    <header className="mb-8 flex flex-col gap-4">
      <div>
        <Tag>{post.category}</Tag>
      </div>

      <h1 className="heading text-[clamp(30px,3.6vw,44px)] font-extrabold text-balance">
        {post.title}
      </h1>

      <p className="text-[19px] text-ink-2">{post.description}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink-3">
        <span className="font-semibold text-ink">{author.name}</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {post.readingMinutes} min de leitura
        </span>
      </div>
    </header>
  )
}
