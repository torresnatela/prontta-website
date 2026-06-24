import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'
import { formatDate } from '@/lib/blog'

/**
 * Card de post para a listagem do blog. Server Component (hover via CSS) para
 * manter a listagem leve e 100% renderizada no servidor (bom p/ SEO).
 */
export function BlogCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-accent-light bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-cyan/10"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent-light via-white to-accent-light">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-display text-xl font-bold gradient-text text-center">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-3 text-xs text-neutral-gray">
            <span className="rounded-full bg-primary-cyan/10 px-2.5 py-0.5 font-medium text-primary-cyan">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-primary-navy leading-snug text-balance transition-colors group-hover:text-primary-cyan">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-neutral-gray">{post.description}</p>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-accent-light">
            <time dateTime={post.publishedAt} className="text-sm text-neutral-gray">
              {formatDate(post.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-cyan">
              Ler
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
