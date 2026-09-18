import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbItem } from '@/lib/structured-data'

/**
 * Trilha de navegação visual. O JSON-LD correspondente (BreadcrumbList) é
 * injetado separadamente via breadcrumbSchema() para os rich results.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="line-clamp-1 text-ink-2" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-ink">
                    {item.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-3/60" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
