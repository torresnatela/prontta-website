import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { Info } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Mapeamento dos elementos MDX para o design da Prontta.
 *
 * Substitui a falta de @tailwindcss/typography por estilos explícitos.
 * Os headings recebem `id` automaticamente via rehype-slug (configurado na
 * rota do artigo) e `scroll-mt-24` para compensar o header fixo nas âncoras.
 */

function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#')
  if (isInternal) {
    return (
      <Link href={href} className="text-primary-cyan font-medium hover:underline" {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-cyan font-medium hover:underline"
      {...props}
    >
      {children}
    </a>
  )
}

/** Callout para destaques/notas dentro do artigo. Uso em MDX: <Callout>...</Callout> */
export function Callout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-6 flex gap-3 rounded-2xl border-2 border-accent-light bg-accent-light/40 p-5">
      <Info className="mt-0.5 h-6 w-6 shrink-0 text-primary-cyan" />
      <div className="text-primary-navy/90">
        {title && <p className="mb-1 font-display font-bold text-primary-navy">{title}</p>}
        <div className="[&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="font-display text-2xl md:text-3xl font-bold text-primary-navy mt-12 mb-4 scroll-mt-24"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-display text-xl md:text-2xl font-bold text-primary-navy mt-8 mb-3 scroll-mt-24"
      {...props}
    />
  ),
  h4: (props) => (
    <h4 className="font-display text-lg font-bold text-primary-navy mt-6 mb-2 scroll-mt-24" {...props} />
  ),
  p: (props) => <p className="text-primary-navy/80 leading-relaxed my-5 text-lg" {...props} />,
  a: Anchor,
  ul: (props) => <ul className="my-5 space-y-2 pl-6 list-disc marker:text-primary-cyan" {...props} />,
  ol: (props) => <ol className="my-5 space-y-2 pl-6 list-decimal marker:text-primary-cyan" {...props} />,
  li: (props) => <li className="text-primary-navy/80 leading-relaxed text-lg pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-primary-cyan bg-accent-light/30 py-2 pl-5 pr-4 rounded-r-xl text-primary-navy/90 italic"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-primary-navy" {...props} />,
  hr: () => <hr className="my-10 border-t border-accent-light" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-base" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b-2 border-accent-light bg-accent-light/40 px-4 py-3 font-display font-bold text-primary-navy" {...props} />
  ),
  td: (props) => <td className="border-b border-accent-light px-4 py-3 text-primary-navy/80" {...props} />,
  code: (props) => (
    <code className="rounded bg-primary-navy/5 px-1.5 py-0.5 font-mono text-[0.9em] text-primary-navy" {...props} />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-primary-navy p-5 text-sm text-white" {...props} />
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element -- imagens de conteúdo têm dimensões desconhecidas; lazy é suficiente
    <img alt={alt ?? ''} loading="lazy" className="my-6 rounded-2xl w-full h-auto" {...props} />
  ),
  Callout,
}
