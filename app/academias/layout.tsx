import './academias.css';

/**
 * Só carrega o CSS escopado das páginas /academias.
 *
 * Sem `metadata` aqui de propósito: as pages são Server Components e exportam a
 * própria (diferente de /proposta, cujo layout precisa cuidar disso porque a
 * page é 'use client').
 */
export default function AcademiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
