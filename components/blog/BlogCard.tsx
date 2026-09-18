import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'
import { formatDate } from '@/lib/blog'
import { Tag } from '@/components/ui'

/**
 * Card de post para a listagem do blog. Server Component (hover via CSS) para
 * manter a listagem leve e 100% renderizada no servidor (bom p/ SEO).
 */
export function BlogCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition-colors hover:border-cyan"
      >
        {/* Capa */}
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <span className="text-center font-display text-xl font-bold text-cyan-ink">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Corpo */}
        <div className="flex flex-1 flex-col gap-3 px-[26px] py-6">
          <div className="flex items-center gap-3 text-xs text-ink-3">
            <Tag>{post.category}</Tag>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min
            </span>
          </div>

          <h3 className="heading text-[21px] font-bold text-balance">{post.title}</h3>

          <p className="line-clamp-3 text-[15px] text-ink-2">{post.description}</p>

          <div className="mt-auto flex items-center justify-between border-t border-line-2 pt-4">
            <time dateTime={post.publishedAt} className="text-[13.5px] text-ink-3">
              {formatDate(post.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-cyan-ink">
              Ler
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
