/**
 * Helpers de dados estruturados (JSON-LD / schema.org).
 *
 * Cada função retorna um objeto pronto para ser injetado em
 * <script type="application/ld+json">. Centralizar aqui garante consistência
 * entre páginas e facilita manter os schemas válidos (Rich Results).
 */

import { siteConfig, socialProfiles, absoluteUrl } from './site-config'

/** Organização — usado no layout raiz (aparece em todas as páginas). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.ogImage),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'sales',
      email: siteConfig.contact.email,
      availableLanguage: ['Portuguese'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    sameAs: socialProfiles,
  }
}

/** WebSite com SearchAction — habilita a caixa de busca de sitelinks no Google. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: { '@id': `${siteConfig.url}/#organization` },
  }
}

export interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  image?: string
  authorName: string
  authorUrl?: string
  authorJobTitle?: string
}

/** Article — usado em cada post do blog. */
export function articleSchema(post: ArticleSchemaInput) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image ?? `/blog/${post.slug}/opengraph-image`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: siteConfig.language,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: post.authorName,
      ...(post.authorUrl ? { url: post.authorUrl } : {}),
      ...(post.authorJobTitle ? { jobTitle: post.authorJobTitle } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.logo) },
    },
  }
}

export interface BreadcrumbItem {
  name: string
  /** Path relativo, ex.: '/blog'. */
  path: string
}

/** BreadcrumbList — trilha de navegação para rich results. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export interface FaqItem {
  question: string
  answer: string
}

/** FAQPage — alimenta rich results de FAQ no Google e respostas de IA. */
export function faqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
