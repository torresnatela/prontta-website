import type { PackageLine } from '@/lib/academias/pricing';
import { plural } from '@/components/simulador/shared/format';
import { specialtyIcon } from '@/components/simulador/shared/icons';

interface SpecialistGridProps {
  lines: PackageLine[];
}

/** Grade "quem atende" — mesma peça nas duas páginas. */
export function SpecialistGrid({ lines }: SpecialistGridProps) {
  return (
    <div className="specialist-grid">
      {lines.map((line) => (
        <div className="specialist-card" key={line.specialtyId}>
          <span className="spec-icon">{specialtyIcon(line.specialtyId)}</span>
          <span>
            <strong>{line.specialtyName}</strong>
            <small>
              {line.quantity} {plural(line.quantity, 'atendimento', 'atendimentos')}
            </small>
          </span>
        </div>
      ))}
    </div>
  );
}

const INCLUDED = [
  'Pré-triagem com IA',
  'Prontuário integrado',
  'Prescrição digital',
  'Acompanhamento durante o ciclo',
];

export function IncludedChips({ items = INCLUDED }: { items?: readonly string[] }) {
  return (
    <div className="included-row">
      {items.map((item) => (
        <span className="included-chip" key={item}>
          <b aria-hidden="true">✓</b>
          {item}
        </span>
      ))}
    </div>
  );
}
