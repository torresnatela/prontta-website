import type { ReactElement } from 'react';
import type { AcademiaProgramId } from '@/lib/academias/catalog';

/**
 * SVGs inline dos modelos comerciais.
 *
 * Inline de propósito: são ícones de conteúdo, um por modelo comercial, e não
 * valem nem um sprite nem uma dependência de biblioteca de ícones.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

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

const CARDIO = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 20s-7-4.2-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.8-9 9-9 9z" />
    <path d="M7 12h3l1-2 2 4 1-2h3" />
  </svg>
);

const ENDO = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
  </svg>
);

const NUTRITION = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 21c4-3 7-7 7-12-4 0-7 1-9 4-1.5 2.2-1 5.3 2 8z" />
    <path d="M12 21c-2-5-1-10 4-14" />
  </svg>
);

const PSYCH = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8.5 15.5A7 7 0 1 1 15.5 15.5C14.4 16.2 14 17 14 18h-4c0-1-.4-1.8-1.5-2.5z" />
    <path d="M9 10c.7-1.4 2-2 3-2s2.3.6 3 2" />
  </svg>
);

const GERIATRICS = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <circle cx="12" cy="7" r="3" />
    <path d="M8 21v-5a4 4 0 0 1 8 0v5" />
    <path d="M6 14l2 2M18 14l-2 2" />
  </svg>
);

const NEURO = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3" />
    <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3" />
    <path d="M12 3v18M9 8h3M12 13h3M9 17h3" />
  </svg>
);

const GENERAL = (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 21s7-4 7-11V5l-7-3-7 3v5c0 7 7 11 7 11z" />
    <path d="M9 11h6M12 8v6" />
  </svg>
);

const SPECIALTY_ICONS: Record<string, ReactElement> = {
  'cardiologia-adulto': CARDIO,
  endocrinologia: ENDO,
  nutricao: NUTRITION,
  'psicologia-adulto': PSYCH,
  geriatria: GERIATRICS,
  'neurologia-adulto': NEURO,
  'medico-generalista': GENERAL,
};

export function specialtyIcon(specialtyId: string): ReactElement {
  return SPECIALTY_ICONS[specialtyId] ?? GENERAL;
}
