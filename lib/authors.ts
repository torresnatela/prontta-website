import { siteConfig } from './site-config'

/**
 * Registro de autores do blog.
 *
 * Conteúdo de saúde é YMYL: o Google (e as IAs) valorizam autoria com
 * credenciais reais (E-E-A-T). Preencha `credentials` (ex.: "CRM-MG 00000")
 * e `sameAs` (LinkedIn/Lattes) sempre que possível.
 *
 * O campo `frontmatter.author` de cada post deve bater com uma chave aqui.
 */
export interface Author {
  id: string
  name: string
  role: string
  bio: string
  /** Credenciais profissionais — ex.: "CRM-MG 12345". Reforça E-E-A-T. */
  credentials?: string
  /** Caminho do avatar em /public (ex.: '/blog/authors/equipe.png'). */
  avatar?: string
  /** Perfis externos (LinkedIn, Lattes) — vira `sameAs` no schema. */
  sameAs?: string[]
}

export const authors = {
  'equipe-prontta': {
    id: 'equipe-prontta',
    name: 'Equipe Prontta Saúde',
    role: 'Time editorial',
    bio: 'O time da Prontta Saúde reúne especialistas em gestão de clínicas, telesaúde e operação médica, ajudando instituições a ampliar a oferta de especialidades com qualidade e eficiência.',
    avatar: '/blog/authors/equipe-prontta.png',
    sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram],
  },
} as const satisfies Record<string, Author>

export type AuthorId = keyof typeof authors

export const DEFAULT_AUTHOR_ID: AuthorId = 'equipe-prontta'

/** Retorna o autor pelo id; cai no autor padrão se não encontrar. */
export function getAuthor(id?: string): Author {
  if (id && id in authors) return authors[id as AuthorId]
  return authors[DEFAULT_AUTHOR_ID]
}
