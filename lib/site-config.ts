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
  shortDescription: 'Infraestrutura B2B de telessaúde assistida',
  description:
    'A Prontta transforma clínicas, academias e empresas em pontos de cuidado especializado. Programas de Saúde Assistida em ciclos de 3, 6 e 12 meses, com receita recorrente para o parceiro. Não é plano de saúde.',
  /** Imagem OG padrão (precisa existir em /public). */
  ogImage: '/og-image.png',
  /** Logomarca para JSON-LD. Gerada por `npm run brand:assets`. */
  logo: '/logo-prontta.png',
  locale: 'pt_BR',
  language: 'pt-BR',

  contact: {
    phone: '+55-31-98492-7635',
    phoneDisplay: '(31) 98492-7635',
    phoneHref: 'tel:+5531984927635',
    email: 'contato@pronttasaude.com.br',
    hours: 'Seg a sex, 8h às 18h',
  },

  address: {
    streetAddress: 'Rua Rio Grande do Norte, 1435, sala 708, 7º pavimento, Savassi',
    addressLocality: 'Belo Horizonte',
    addressRegion: 'MG',
    postalCode: '30130-138',
    addressCountry: 'BR',
    full: 'Rua Rio Grande do Norte, 1435, sala 708, 7º pavimento, Savassi, Belo Horizonte/MG, CEP 30130-138',
  },

  /** Identificação legal exibida no rodapé (Resolução CFM nº 2.336/2023). */
  legal: {
    legalName: 'Prontta Saúde Ltda.',
    cnpj: '63.638.463/0001-01',
    technicalDirector: 'Dr. Romualdo da Silva Gonçalves, médico, CRM-MG 39150',
    /** Inscrição da PJ no CRM-MG — preencha quando o protocolo sair. */
    crmProtocol: '[Nº DO PROTOCOLO]',
    /** Encarregado de dados (LGPD). */
    dpoEmail: 'contato@pronttasaude.com.br',
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
