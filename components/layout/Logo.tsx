import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'
import lockup from '@/public/logo-prontta.png'
import lockupWhite from '@/public/logo-prontta-branco.png'
import mark from '@/public/icone-prontta.png'

interface LogoProps {
  className?: string
  /** `false` mostra só o ícone do P. */
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** `white` usa a versão de fundo escuro (rodapé, capas). */
  variant?: 'default' | 'white'
  /** Só no cabeçalho, que fica acima da dobra. */
  priority?: boolean
}

/**
 * Logomarca oficial (`assets/brand/`, derivados gerados por `npm run brand:assets`).
 *
 * Sem `next/image` responsivo por trás: a altura é fixa por tamanho e a largura
 * sai da proporção do arquivo (`w-auto`), então o lockup nunca distorce.
 */
export function Logo({
  className = '',
  showText = true,
  size = 'md',
  variant = 'default',
  priority = false,
}: LogoProps) {
  const heights = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
  const source = showText ? (variant === 'white' ? lockupWhite : lockup) : mark

  return (
    <Image
      src={source}
      alt={siteConfig.name}
      className={`${heights[size]} w-auto ${className}`}
      priority={priority}
    />
  )
}
