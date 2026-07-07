import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposta e Simulador',
  description:
    'Monte sua proposta de Programas de Saúde Assistida e consultas por telessaúde e simule o resultado da sua operação com a Prontta Saúde.',
  alternates: { canonical: '/proposta' },
};

export default function PropostaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
