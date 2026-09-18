import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { Info } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Mapeamento dos elementos MDX para o design da Prontta.
 *
 * Substitui a falta de @tailwindcss/typography por estilos explícitos.
 * Os headings recebem `id` automaticamente via rehype-slug (configurado na
 * rota do artigo) e `scroll-mt-28` para compensar o header fixo nas âncoras.
 */

const linkClass = 'font-semibold text-cyan-ink hover:underline'

function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  // Âncoras de heading (rehype-autolink-headings envolve o título num <a>):
  // herdam a cor do título em vez de virar link ciano.
  if (href.startsWith('#')) {
    return (
      <a href={href} className="text-inherit no-underline" {...props}>
        {children}
      </a>
    )
  }
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={linkClass} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
      {children}
    </a>
  )
}

/** Callout para destaques/notas dentro do artigo. Uso em MDX: <Callout>...</Callout> */
export function Callout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-line bg-surface-2 p-5">
      <Info className="mt-0.5 h-6 w-6 shrink-0 text-cyan" />
      <div className="text-ink-2">
        {title && <p className="mb-1 font-display font-bold text-ink">{title}</p>}
        <div className="[&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="heading mb-4 mt-12 scroll-mt-28 text-[26px] font-extrabold md:text-[30px]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="heading mb-3 mt-8 scroll-mt-28 text-[21px] font-bold md:text-[24px]"
      {...props}
    />
  ),
  h4: (props) => <h4 className="heading mb-2 mt-6 scroll-mt-28 text-[18px] font-bold" {...props} />,
  p: (props) => <p className="my-5 text-[17px] leading-[1.7] text-ink-2" {...props} />,
  a: Anchor,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-cyan" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-cyan" {...props} />,
  li: (props) => <li className="pl-1 text-[17px] leading-[1.7] text-ink-2" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 rounded-r-xl border-l-2 border-cyan bg-surface-2 py-2 pl-5 pr-4 italic text-ink-2"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  hr: () => <hr className="my-10 border-t border-line-2" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-left text-[15px]" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-line bg-surface-2 px-4 py-3 font-display font-bold text-ink"
      {...props}
    />
  ),
  td: (props) => <td className="border-b border-line-2 px-4 py-3 text-ink-2" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-ink"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-line bg-foot p-5 text-sm text-ink"
      {...props}
    />
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element -- imagens de conteúdo têm dimensões desconhecidas; lazy é suficiente
    <img
      alt={alt ?? ''}
      loading="lazy"
      className="my-6 h-auto w-full rounded-[14px] border border-line"
      {...props}
    />
  ),
  Callout,
}
