import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from '@/components/blog/mdx-components'

/**
 * Arquivo exigido pelo @next/mdx (App Router): define os componentes usados ao
 * renderizar qualquer .mdx importado. Reaproveita o mapeamento de
 * components/blog/mdx-components.tsx (estilos da Prontta + <Callout/>).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, ...mdxComponents }
}
