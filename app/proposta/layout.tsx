import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulador de Proposta | Prontta Saúde',
  description:
    'Monte sua proposta comercial personalizada e simule a rentabilidade da sua operação de telemedicina com a Prontta Saúde.',
}

export default function PropostaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
