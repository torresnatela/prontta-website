import { ButtonLink, SectionHead } from '@/components/ui'
import { BlogCard } from '@/components/blog/BlogCard'
import { getAllPosts } from '@/lib/blog'

/** Últimos posts do blog na home. Some sozinha enquanto não houver posts. */
export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section id="blog" className="section-padding border-t border-line">
      <div className="container-custom">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead
            className="mb-0 sm:mb-[38px]"
            title="Conteúdo para quem opera saúde"
            lede="Telessaúde assistida, gestão de clínicas e ampliação de especialidades, na prática."
          />
          <ButtonLink
            href="/blog"
            variant="ghost"
            size="sm"
            className="mb-[38px] self-start sm:self-auto"
          >
            Ver todos os artigos
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
