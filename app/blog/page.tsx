import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'
import { BlogCard } from '@/components/blog/BlogCard'
import { JsonLd } from '@/components/JsonLd'
import { generateMetadata as buildMetadata } from '@/lib/seo'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbSchema } from '@/lib/structured-data'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Conteúdos sobre terceirização médica, telesaúde híbrida, gestão de clínicas e ampliação de especialidades. Insights práticos da Prontta Saúde.',
  path: '/blog',
})

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <>
      <Header />
      <main className="pt-28 md:pt-32">
        {/* Hero */}
        <section className="section-padding pb-8 md:pb-12">
          <div className="container-custom mx-auto text-center">
            <span className="inline-block px-5 py-2.5 bg-primary-cyan/10 text-primary-cyan font-medium rounded-full text-base mb-4">
              Blog Prontta Saúde
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-navy text-balance">
              Ideias para <span className="gradient-text">transformar</span> a saúde
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-neutral-gray">
              Terceirização médica, telesaúde híbrida e gestão de clínicas — conteúdo
              prático para ampliar especialidades com qualidade e eficiência.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="section-padding pt-4">
          <div className="container-custom mx-auto">
            {posts.length === 0 ? (
              <p className="text-center text-lg text-neutral-gray">
                Em breve, novos conteúdos por aqui. 🩺
              </p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} priority={index < 3} />
                ))}
              </div>
            )}
          </div>
        </section>
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
