'use client';

import Image from 'next/image';
import { ACADEMIA_PROGRAMS, type AcademiaProgramId } from '@/lib/academias/catalog';
import { cn } from '@/lib/utils';
import { PROGRAM_ICONS } from './icons';

interface ProgramPickerProps {
  selectedId: AcademiaProgramId;
  onSelect: (id: AcademiaProgramId) => void;
  /**
   * Mostra o popover "Conheça este atendimento" no hover/foco do card.
   * Só a página do associado usa — o simulador do dono não tem essa peça.
   */
  withPopover?: boolean;
}

/**
 * Os 4 cards de programa. Mesma peça nas duas páginas: o simulador do dono usa
 * a versão simples, a página do associado liga o popover do catálogo.
 */
export function ProgramPicker({ selectedId, onSelect, withPopover = false }: ProgramPickerProps) {
  return (
    <div className="programs">
      {ACADEMIA_PROGRAMS.map((entry) => {
        const active = entry.id === selectedId;
        return (
          <div className={cn('program-slot', withPopover && 'has-popover')} key={entry.id}>
            <button
              type="button"
              className={cn('program', active && 'active')}
              data-card={entry.theme}
              aria-pressed={active}
              aria-describedby={withPopover ? `popover-${entry.id}` : undefined}
              onClick={() => onSelect(entry.id)}
            >
              <span className="check" aria-hidden="true">
                ✓
              </span>
              <span className="icon">{PROGRAM_ICONS[entry.id]}</span>
              <strong>{entry.shortName}</strong>
              <small>{entry.tagline}</small>
            </button>

            {withPopover ? (
              <div className="program-popover" id={`popover-${entry.id}`} role="tooltip">
                <div className="program-popover-accent" aria-hidden="true" />
                <div className="program-popover-inner">
                  <div className="program-popover-kicker">Conheça este atendimento</div>
                  <h4>{entry.program.name}</h4>
                  <div className="program-popover-doctor">Equipe multidisciplinar Prontta</div>
                  <p className="program-popover-summary">{entry.program.description}</p>
                </div>
                <div className="program-popover-cover">
                  {/* Decorativa: o nome e a descrição do programa já estão acima. */}
                  <Image
                    className="program-popover-image"
                    src={entry.image}
                    alt=""
                    width={420}
                    height={236}
                    sizes="420px"
                  />
                  <strong>O que este programa cobre</strong>
                  <div className="program-popover-list">
                    {entry.audience.map((item) => (
                      <div className="program-popover-item" key={item}>
                        <b aria-hidden="true">✓</b>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
