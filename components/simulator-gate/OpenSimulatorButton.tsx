'use client'

import type { ReactNode } from 'react'
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'
import { useSimulatorGate, type GateSegment } from './SimulatorGateProvider'

interface OpenSimulatorButtonProps {
  /** Segmento já escolhido — pula a pergunta "Qual é o seu negócio?". */
  segment?: GateSegment
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  /** Chamado antes de abrir o gate (ex.: fechar o menu mobile). */
  onClick?: () => void
  children: ReactNode
}

/**
 * Botão que abre o gate do simulador. É o único ponto de contato entre as
 * seções (Server Components) e o modal (client), então elas não precisam
 * virar client components para ter um CTA.
 */
export function OpenSimulatorButton({
  segment,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  children,
}: OpenSimulatorButtonProps) {
  const { open } = useSimulatorGate()
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onClick?.()
        open(segment)
      }}
    >
      {children}
    </Button>
  )
}
