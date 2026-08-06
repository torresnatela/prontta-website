/**
 * Fonte única de verdade para os dados do site.
 *
 * Tudo que descreve a Prontta (URL, contato, redes, descrição) vive aqui e é
 * consumido por: app/layout.tsx, lib/seo.ts, lib/structured-data.ts,
 * app/sitemap.ts, app/robots.ts, app/llms.txt e o Footer.
 *
 * Ao mudar telefone, endereço, redes etc., altere APENAS este arquivo.
 */

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pronttasaude.com.br'
).replace(/\/$/, '')

export const siteConfig = {
  name: 'Prontta Saúde',
  /** URL canônica de produção, sem barra no final. */
  url: siteUrl,
  shortDescription: 'Soluções em Terceirização Médica',
  description:
    'Terceirização de serviços médicos especializados para clínicas e hospitais. Telesaúde híbrida, agenda dedicada e on demand para ampliar a oferta de especialidades com qualidade e redução de custos.',
  /** Imagem OG padrão (precisa existir em /public). */
  ogImage: '/og-image.png',
  logo: '/logo.png',
  locale: 'pt_BR',
  language: 'pt-BR',

  contact: {
    phone: '+55-31-99333-3245',
    phoneDisplay: '(31) 99333-3245',
    phoneHref: 'tel:+5531993333245',
    email: 'contato@pronttasaude.com.br',
    hours: 'Seg - Sex: 8h às 18h',
  },

  address: {
    streetAddress: 'Av. Pres. Eurico Dutra, 608 - Belvedere',
    addressLocality: 'Belo Horizonte',
    addressRegion: 'MG',
    postalCode: '30320-190',
    addressCountry: 'BR',
    full: 'Av. Pres. Eurico Dutra, 608 - Belvedere, Belo Horizonte - MG, 30320-190',
  },

  social: {
    instagram: 'https://instagram.com/pronttasaude',
    linkedin: 'https://linkedin.com/company/pronttasaude',
  },

  /** Variáveis de ambiente para analytics/verificação (configuradas na Vercel). */
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    googleVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
} as const

/** Lista de perfis sociais usada no campo `sameAs` do schema.org. */
export const socialProfiles = [siteConfig.social.instagram, siteConfig.social.linkedin]

/**
 * Link de WhatsApp (wa.me) com mensagem opcional pré-preenchida.
 * Deriva do telefone de `siteConfig` — não duplique o número em outro lugar.
 */
export function whatsappHref(message?: string): string {
  const digits = siteConfig.contact.phone.replace(/\D/g, '')
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${query}`
}

/** Helper para montar URLs absolutas a partir de um path relativo. */
export function absoluteUrl(path = ''): string {
  if (!path) return siteConfig.url
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}
