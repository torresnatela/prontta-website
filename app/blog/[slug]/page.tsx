import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Header, Footer } from '@/components/layout'
import { CTA } from '@/components/sections'
import { JsonLd } from '@/components/JsonLd'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { ArticleHeader } from '@/components/blog/ArticleHeader'
import { AuthorBox } from '@/components/blog/AuthorBox'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { BlogCard } from '@/components/blog/BlogCard'
import { mdxComponents } from '@/components/blog/mdx-components'

import { generateMetadata as buildMetadata } from '@/lib/seo'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { getAuthor } from '@/lib/authors'
import { absoluteUrl } from '@/lib/site-config'
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/structured-data'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Artigo não encontrado' }

  const author = getAuthor(post.author)

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    // OG image é fornecida pelo opengraph-image.tsx (file convention).
    image: null,
    type: 'article',
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [author.name],
      tags: post.tags,
    },
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // MDX compilado pelo bundler (@next/mdx). Apenas slugs válidos chegam aqui
  // via generateStaticParams. O frontmatter é removido por remark-frontmatter.
  const { default: MDXContent } = await import(`../../../content/blog/${slug}.mdx`)

  const author = getAuthor(post.author)
  const related = getRelatedPosts(post.slug)

  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]

  const schemas: object[] = [
    articleSchema({
      title: post.title,
      description: post.description,
      slug: post.slug,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      image: post.coverImage,
      authorName: author.name,
      authorUrl: author.sameAs?.[0],
      authorJobTitle: author.credentials ?? author.role,
    }),
    breadcrumbSchema(breadcrumbs),
  ]
  if (post.faq?.length) schemas.push(faqSchema(post.faq))

  return (
    <>
      <Header />
      <main className="pt-28 md:pt-32">
        <div className="section-padding pt-4">
          <div className="container-custom mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Artigo */}
            <article className="min-w-0 max-w-3xl">
              <Breadcrumbs items={breadcrumbs} />
              <ArticleHeader post={post} author={author} />

              <div className="mt-8 border-t border-accent-light pt-8">
                <MDXContent components={mdxComponents} />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-light px-3 py-1 text-sm text-primary-navy/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <AuthorBox author={author} />
            </article>

            {/* Sumário (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="section-padding pt-0">
            <div className="container-custom mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-navy mb-8">
                Continue lendo
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CTA />
      </main>
      <Footer />

      <JsonLd data={schemas} />
    </>
  )
}
