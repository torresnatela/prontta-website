'use client'

import { forwardRef, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  pulse?: boolean
  children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, pulse, children, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-primary-cyan text-white hover:bg-primary-navy hover:shadow-lg hover:shadow-primary-cyan/25',
      secondary: 'bg-transparent border-2 border-primary-navy text-primary-navy hover:bg-primary-navy hover:text-white',
      ghost: 'bg-transparent text-primary-navy hover:bg-accent-light',
    }

    const sizes = {
      sm: 'px-5 py-2.5 text-base',
      md: 'px-7 py-3.5 text-lg',
      lg: 'px-9 py-4.5 text-xl',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          pulse && 'pulse-ring',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
