import { CalendarDays, Clock, Tag } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'
import { formatDate } from '@/lib/blog'
import type { Author } from '@/lib/authors'

/**
 * Cabeçalho do artigo: categoria, título (H1), descrição e metadados
 * (autor, data, tempo de leitura). H1 único por página para SEO.
 */
export function ArticleHeader({ post, author }: { post: PostMeta; author: Author }) {
  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-cyan/10 px-3 py-1 text-sm font-medium text-primary-cyan">
          <Tag className="h-3.5 w-3.5" />
          {post.category}
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy text-balance leading-tight">
        {post.title}
      </h1>

      <p className="mt-4 text-xl text-neutral-gray leading-relaxed">{post.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-gray">
        <span className="font-medium text-primary-navy">{author.name}</span>
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
