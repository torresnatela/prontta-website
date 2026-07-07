'use client';

import { useState } from 'react';
import {
  PROGRAMS,
  getProgram,
  getProgramMonthly,
  getSpecialty,
  type Cycle,
  type Program,
} from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';
import { SectionShell } from '../shared/SectionShell';
import { newEntryId, useProgramsSummary, useProposal } from '../state/ProposalProvider';

const CYCLES: Cycle[] = [3, 6, 12];

function ProgramCard({ program }: { program: Program }) {
  const { dispatch } = useProposal();
  const [cycle, setCycle] = useState<Cycle>(3);
  const price = program.priceByCycle[cycle];
  const monthly = getProgramMonthly(program.id, cycle);

  return (
    <div className="bg-white rounded-2xl border border-accent-light p-6 flex flex-col">
      <h3 className="font-display text-lg font-bold text-primary-navy">{program.name}</h3>
      <p className="text-sm text-neutral-gray mt-2 flex-none">{program.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {program.channels.map((channel) => (
          <span key={channel} className="text-[11px] bg-accent-light text-primary-navy rounded-full px-2 py-0.5">
            {channel}
          </span>
        ))}
      </div>

      <div className="flex gap-1.5 mt-5" role="group" aria-label={`Ciclo — ${program.name}`}>
        {CYCLES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cycle === c}
            onClick={() => setCycle(c)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              cycle === c
                ? 'bg-primary-cyan border-primary-cyan text-white'
                : 'bg-white border-accent-light text-primary-navy hover:border-primary-cyan',
            )}
          >
            {c} meses
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-display font-bold text-primary-navy">{formatCurrency(price)}</p>
        <p className="text-sm text-neutral-gray">
          {cycle}× de {formatCurrency(monthly)}/mês
        </p>
      </div>

      <ul className="mt-4 space-y-1 text-sm text-neutral-gray flex-1">
        {program.compositionByCycle[cycle].map((item) => (
          <li key={item.specialtyId} className="flex justify-between gap-2">
            <span>{getSpecialty(item.specialtyId).name}</span>
            <span className="font-semibold text-primary-navy">{item.quantity}</span>
          </li>
        ))}
        <li className="flex justify-between gap-2 text-primary-cyan font-medium">
          <span>IA Prontta · pré-triagem</span>
          <span>inclusa</span>
        </li>
      </ul>

      <button
        type="button"
        aria-label={`Adicionar ${program.name} à proposta`}
        onClick={() =>
          dispatch({
            type: 'ADD_PROGRAM_SELECTION',
            selection: { id: newEntryId('programa'), programId: program.id, cycle, quantity: 1 },
          })
        }
        className="mt-5 w-full rounded-full border-2 border-primary-navy text-primary-navy font-semibold py-2.5 text-sm hover:bg-primary-navy hover:text-white transition-colors"
      >
        Adicionar à proposta
      </button>
    </div>
  );
}

export function ProgramsSection() {
  const { state, dispatch } = useProposal();
  const summary = useProgramsSummary();

  return (
    <SectionShell
      id="programas"
      kicker="Linha de cuidado recorrente"
      title="12 Programas de Saúde Assistida"
      subtitle="Jornadas completas por linha de cuidado, em ciclos de 3, 6 e 12 meses. Todos incluem a IA Prontta de pré-triagem e a plataforma de telessaúde."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <div className="mt-10 bg-accent-light/50 rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold text-primary-navy mb-4">Programas na proposta</h3>
        {state.programSelections.length === 0 ? (
          <p className="text-sm text-neutral-gray">
            Nenhum programa adicionado ainda — escolha um ciclo e clique em “Adicionar à proposta”.
          </p>
        ) : (
          <ul className="space-y-3">
            {state.programSelections.map((selection) => {
              const program = getProgram(selection.programId);
              const item = summary.items.find((i) => i.selectionId === selection.id);
              return (
                <li
                  key={selection.id}
                  className="grid grid-cols-2 md:grid-cols-[minmax(0,2fr)_auto_auto_auto_auto] items-center gap-3 bg-white rounded-xl border border-accent-light px-4 py-3"
                >
                  <span className="font-medium text-primary-navy text-sm">
                    {program.name}
                    <span className="text-neutral-gray font-normal"> · {selection.cycle} meses</span>
                  </span>
                  <input
                    type="number"
                    min={1}
                    aria-label={`Quantidade — ${program.name}`}
                    className="w-20 rounded-lg border-2 border-accent-light px-2.5 py-1.5 text-sm text-primary-navy focus:outline-none focus:border-primary-cyan"
                    value={selection.quantity}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_PROGRAM_SELECTION',
                        id: selection.id,
                        patch: { quantity: Number(e.target.value) },
                      })
                    }
                  />
                  <span className="text-sm text-neutral-gray">
                    {item ? `${formatCurrency(item.monthly)}/mês` : '—'}
                  </span>
                  <span className="text-sm font-semibold text-primary-navy">
                    {item ? formatCurrency(item.total) : '—'}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remover ${program.name}`}
                    onClick={() => dispatch({ type: 'REMOVE_PROGRAM_SELECTION', id: selection.id })}
                    className="justify-self-end text-neutral-gray hover:text-red-500 transition-colors p-1.5"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SectionShell>
  );
}
