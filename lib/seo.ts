import { Metadata } from 'next'
import { siteConfig, absoluteUrl } from './site-config'

interface SeoInput {
  title: string
  description: string
  /** Path relativo da página, ex.: '/blog/meu-post'. */
  path?: string
  /**
   * Imagem OG (path relativo ou URL absoluta). Default: OG do site.
   * Passe `null` para NÃO emitir og:image/twitter:image — útil quando a rota
   * tem um opengraph-image.tsx (file convention) cuidando disso.
   */
  image?: string | null
  /** 'website' (padrão) ou 'article' para posts do blog. */
  type?: 'website' | 'article'
  /** Metadados extras para artigos. */
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
  }
  /** Define como `false` para gerar uma página com noindex. */
  index?: boolean
}

/**
 * Gera o objeto Metadata do Next a partir de dados de uma página.
 * Usa siteConfig como fonte única e metadataBase (definido no layout) para
 * resolver URLs relativas (canonical, OG image).
 */
export function generateMetadata({
  title,
  description,
  path = '',
  image = siteConfig.ogImage,
  type = 'website',
  article,
  index = true,
}: SeoInput): Metadata {
  const url = absoluteUrl(path)
  const fullTitle = `${title} | ${siteConfig.name}`
  const ogImages = image === null ? undefined : [{ url: image, width: 1200, height: 630, alt: title }]

  return {
    title,
    description,
    alternates: {
      canonical: path || '/',
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      ...(ogImages ? { images: ogImages } : {}),
      locale: siteConfig.locale,
      type,
      ...(type === 'article' && article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            tags: article.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(image === null ? {} : { images: [image] }),
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  }
}
