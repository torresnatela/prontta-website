import type { ReactElement } from 'react';
import type { AcademiaProgramId } from '@/lib/academias/catalog';
import { stroke } from '@/components/simulador/shared/icons';

/**
 * SVGs inline dos modelos comerciais de academia — um por programa do catálogo.
 *
 * Os ícones de ESPECIALIDADE ficam em `components/simulador/shared/icons.tsx`:
 * são chaveados por `lib/pricing/specialties.ts` e servem aos dois simuladores.
 */

export const PROGRAM_ICONS: Record<AcademiaProgramId, ReactElement> = {
  performance: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M13 5l2 2-2 2" />
      <path d="M5 19l5-5 3 2 6-8" />
      <path d="M3 21h18" />
    </svg>
  ),
  'emagrecimento-inteligente': (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M7 5h10" />
      <path d="M6 8h12l-1.4 8.4a2 2 0 0 1-2 1.6H9.4a2 2 0 0 1-2-1.6L6 8z" />
      <path d="M12 8v10" />
      <path d="M4 10h2" />
      <path d="M18 10h2" />
    </svg>
  ),
  'longevidade-ativa': (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 20s-6.5-3.9-8.5-8A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 8.5 6C18.5 16.1 12 20 12 20z" />
      <path d="M8.5 12h2.2l1-2.2 1.6 4.4 1.1-2.2h1.9" />
    </svg>
  ),
  'sono-e-energia': (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M13 3a7 7 0 1 0 8 8 6.5 6.5 0 0 1-8-8z" />
      <path d="M16.5 5.5l.6 1.3 1.4.2-1 .9.2 1.4-1.2-.7-1.2.7.2-1.4-1-.9 1.4-.2z" />
    </svg>
  ),
};
