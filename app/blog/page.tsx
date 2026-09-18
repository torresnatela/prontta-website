import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'
import { FinalCTA } from '@/components/sections'
import { Eyebrow } from '@/components/ui'
import { BlogCard } from '@/components/blog/BlogCard'
import { JsonLd } from '@/components/JsonLd'
import { generateMetadata as buildMetadata } from '@/lib/seo'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbSchema } from '@/lib/structured-data'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Conteúdos sobre telessaúde assistida, gestão de clínicas, academias e empresas e ampliação de especialidades. Insights práticos da Prontta Saúde.',
  path: '/blog',
})

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <>
      <Header />
      <main>
        <section className="container-custom pb-10 pt-14 lg:pt-20">
          <div className="flex max-w-[740px] flex-col gap-4">
            <Eyebrow>Conteúdo</Eyebrow>
            <h1 className="heading text-[clamp(34px,4.4vw,52px)] font-extrabold">
              Ideias para transformar a saúde
            </h1>
            <p className="text-[17px] text-ink-2">
              Telessaúde assistida, gestão de clínicas, academias e empresas — conteúdo prático para
              ampliar especialidades com qualidade e eficiência.
            </p>
          </div>
        </section>

        <section className="container-custom pb-20">
          {posts.length === 0 ? (
            <p className="text-ink-2">Em breve, novos conteúdos por aqui.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} priority={index < 3} />
              ))}
            </div>
          )}
        </section>

        <FinalCTA />
      </main>
      <Footer />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${siteConfig.url}/blog#blog`,
            name: `Blog ${siteConfig.name}`,
            url: `${siteConfig.url}/blog`,
            inLanguage: siteConfig.language,
            publisher: { '@id': `${siteConfig.url}/#organization` },
            blogPost: posts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              url: `${siteConfig.url}/blog/${post.slug}`,
              datePublished: post.publishedAt,
            })),
          },
        ]}
      />
    </>
  )
}
