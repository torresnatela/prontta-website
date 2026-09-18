import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Peças tipográficas pequenas que se repetem em todas as seções do site:
 * o eyebrow com ponto ciano, a nota jurídica com filete à esquerda, a tag de
 * card e o cabeçalho de seção (título + lede).
 */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[9px] text-[12.5px] font-semibold uppercase tracking-[0.1em] text-cyan-ink',
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan" />
      {children}
    </span>
  )
}

export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'border-l-2 border-line pl-[14px] text-[13.5px] leading-[1.6] text-ink-3',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Tag({ children, tone = 'cyan' }: { children: ReactNode; tone?: 'cyan' | 'amber' }) {
  const tones = {
    cyan: 'bg-cyan-soft text-cyan-soft-ink',
    amber: 'bg-amber-soft text-amber-soft-ink',
  }
  return (
    <span
      className={cn(
        'inline-flex h-[26px] items-center rounded-md px-[11px] text-xs font-semibold tracking-[0.04em]',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function SectionHead({
  title,
  lede,
  className,
  ledeClassName,
}: {
  title: ReactNode
  lede?: ReactNode
  className?: string
  ledeClassName?: string
}) {
  return (
    <div className={cn('mb-[38px] flex max-w-[740px] flex-col gap-3', className)}>
      <h2 className="heading text-[clamp(28px,3.2vw,40px)] font-extrabold">{title}</h2>
      {lede ? <p className={cn('text-[17px] text-ink-2', ledeClassName)}>{lede}</p> : null}
    </div>
  )
}
