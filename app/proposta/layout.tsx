import type { Metadata } from 'next';
import '../simulador-ui.css';
import './proposta.css';

export const metadata: Metadata = {
  title: 'Proposta e Simulador',
  description:
    'Monte sua proposta de Programas de Saúde Assistida e consultas por telessaúde e simule o resultado da sua operação com a Prontta Saúde.',
  alternates: { canonical: '/proposta' },
};

/**
 * Carrega o design system dos simuladores (compartilhado com /academias) mais
 * as peças exclusivas da proposta.
 *
 * A `metadata` mora aqui, e não na page, porque a page é 'use client'.
 */
export default function PropostaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
