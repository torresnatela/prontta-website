import '../simulador-ui.css';

/**
 * Só carrega o design system dos simuladores (compartilhado com /proposta).
 *
 * Sem `metadata` aqui de propósito: as pages são Server Components e exportam a
 * própria (diferente de /proposta, cujo layout precisa cuidar disso porque a
 * page é 'use client').
 */
export default function AcademiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
