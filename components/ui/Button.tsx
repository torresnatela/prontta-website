'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Receita visual dos botões do site: ciano sólido (primary) ou contorno
 * (ghost). O texto do ghost herda a cor do contexto, então ele funciona tanto
 * no navy do site quanto nos cards claros da área logada.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-cyan text-btn-fg hover:brightness-105',
    ghost: 'bg-transparent text-inherit border-btn-line hover:border-cyan',
    secondary: 'bg-transparent text-inherit border-btn-line hover:border-cyan',
  }
  const sizes: Record<ButtonSize, string> = {
    sm: 'min-h-[46px] px-5 text-[15px]',
    md: 'min-h-[52px] px-[26px] text-[16px]',
    lg: 'min-h-[52px] px-[26px] text-[16px]',
  }
  return cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-[9px] border-[1.5px] border-transparent',
    'font-sans font-semibold leading-none cursor-pointer transition-[filter,border-color] duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, type = 'button', ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

interface ButtonLinkProps {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  /** Abre em nova aba (links externos, WhatsApp). */
  external?: boolean
}

/** O mesmo botão, mas como link (âncoras, rotas, WhatsApp). */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external,
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className })
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export { Button }
