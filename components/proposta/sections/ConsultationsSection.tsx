'use client';

import { PLAN_LABELS, SPECIALTIES, getSpecialty, type PlanId } from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';
import { SectionShell } from '../shared/SectionShell';
import { newEntryId, useConsultationsSummary, useProposal } from '../state/ProposalProvider';

const PLAN_IDS: PlanId[] = ['popular', 'intermediario', 'premium'];

const controlClass =
  'w-full rounded-lg border-2 border-accent-light bg-white px-2.5 py-2 text-sm text-primary-navy focus:outline-none focus:border-primary-cyan';

export function ConsultationsSection() {
  const { state, dispatch } = useProposal();
  const summary = useConsultationsSummary();

  const consultationsPerMonthLabel = summary.consultationsPerMonth.toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  });

  return (
    <SectionShell
      id="simulador"
      kicker="Monte sua oferta"
      title="Simulador de consultas avulsas e plantões"
      subtitle="Escolha o plano de referência e monte o bloco de consultas: agenda dedicada fecha plantões de 4 horas por especialidade; a compartilhada é avulsa, sem múltiplo."
      tone="muted"
    >
      <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="Plano de referência">
        {PLAN_IDS.map((plan) => (
          <button
            key={plan}
            type="button"
            aria-pressed={state.referencePlan === plan}
            onClick={() => dispatch({ type: 'SET_REFERENCE_PLAN', plan })}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors',
              state.referencePlan === plan
                ? 'bg-primary-navy border-primary-navy text-white'
                : 'bg-white border-accent-light text-primary-navy hover:border-primary-cyan',
            )}
          >
            {PLAN_LABELS[plan]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {state.consultationLines.map((line) => {
          const specialty = getSpecialty(line.specialtyId);
          const summarized = summary.lines.find((l) => l.lineId === line.id);
          const validation = summarized?.validation ?? null;
          const status =
            line.agenda === 'compartilhada'
              ? { label: 'OK (avulso)', ok: true }
              : validation?.ok
                ? {
                    label: `OK (${validation.shifts} ${validation.shifts === 1 ? 'plantão' : 'plantões'})`,
                    ok: true,
                  }
                : { label: `AJUSTAR: múltiplo de ${validation?.multiple ?? '—'}`, ok: false };

          return (
            <div
              key={line.id}
              className="grid grid-cols-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] gap-3 items-center bg-white rounded-xl border border-accent-light p-4"
            >
              <select
                aria-label={`Especialidade — ${specialty.name}`}
                className={controlClass}
                value={line.specialtyId}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_CONSULTATION_LINE', id: line.id, patch: { specialtyId: e.target.value } })
                }
              >
                {SPECIALTIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                aria-label={`Agenda — ${specialty.name}`}
                className={controlClass}
                value={line.agenda}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CONSULTATION_LINE',
                    id: line.id,
                    patch: { agenda: e.target.value as 'dedicada' | 'compartilhada' },
                  })
                }
              >
                <option value="dedicada">Dedicada</option>
                <option value="compartilhada">Compartilhada</option>
              </select>

              <input
                type="number"
                min={1}
                aria-label={`Quantidade — ${specialty.name}`}
                className={controlClass}
                value={line.quantity}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CONSULTATION_LINE',
                    id: line.id,
                    patch: { quantity: Number(e.target.value) },
                  })
                }
              />

              <select
                aria-label={`Ciclo — ${specialty.name}`}
                className={controlClass}
                value={line.cycleMonths}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_CONSULTATION_LINE',
                    id: line.id,
                    patch: { cycleMonths: Number(e.target.value) },
                  })
                }
              >
                {[3, 6, 12].map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle} meses
                  </option>
                ))}
              </select>

              <div className="text-sm text-neutral-gray">
                <span className="block text-xs uppercase tracking-wide">Consulta</span>
                <span className="font-semibold text-primary-navy">
                  {summarized ? formatCurrency(summarized.unitPrice) : '—'}
                </span>
              </div>

              <div className="text-sm text-neutral-gray">
                <span className="block text-xs uppercase tracking-wide">Subtotal</span>
                <span className="font-semibold text-primary-navy">
                  {summarized ? formatCurrency(summarized.lineTotal) : '—'}
                </span>
                <span
                  className={cn(
                    'block mt-1 text-xs font-semibold rounded-full px-2 py-0.5 w-fit',
                    status.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800',
                  )}
                >
                  {status.label}
                </span>
              </div>

              <button
                type="button"
                aria-label={`Remover ${specialty.name}`}
                onClick={() => dispatch({ type: 'REMOVE_CONSULTATION_LINE', id: line.id })}
                className="justify-self-end text-neutral-gray hover:text-red-500 transition-colors p-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          dispatch({
            type: 'ADD_CONSULTATION_LINE',
            line: {
              id: newEntryId('linha'),
              specialtyId: 'medico-generalista',
              agenda: 'compartilhada',
              quantity: 1,
              cycleMonths: 6,
            },
          })
        }
        className="mt-4 inline-flex items-center gap-2 text-primary-cyan font-semibold hover:text-primary-navy transition-colors"
      >
        <span aria-hidden>＋</span> Adicionar especialidade
      </button>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-accent-light p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-gray mb-1">Ritmo do bloco</p>
          <p className="text-primary-navy font-semibold">
            {consultationsPerMonthLabel} consultas/mês
            {summary.blockCycleMonths > 0 && ` · ciclo de ${summary.blockCycleMonths} meses`}
          </p>
          <p className="text-xs text-neutral-gray mt-1">
            O ciclo do bloco acompanha a linha de maior ciclo.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-accent-light p-5" data-testid="software-mensal">
          <p className="text-xs uppercase tracking-wide text-neutral-gray mb-1">Software mensal</p>
          <p className="text-primary-navy font-semibold">
            {summary.softwareMonthlyFee > 0
              ? `${formatCurrency(summary.softwareMonthlyFee)}/mês`
              : summary.subtotalCost > 0
                ? 'Isento (≥ 150 consultas/mês)'
                : '—'}
          </p>
          <p className="text-xs text-neutral-gray mt-1">
            Cobrado só na compra de consultas; isento a partir de 150 consultas/mês.
          </p>
        </div>

        <div className="bg-primary-navy rounded-xl p-5 text-white" data-testid="consultas-paciente">
          <p className="text-xs uppercase tracking-wide text-white/70 mb-1">
            Valor das consultas na proposta ao paciente
          </p>
          <p className="text-2xl font-display font-bold">{formatCurrency(summary.patientPrice)}</p>
          <p className="text-xs text-white/70 mt-1">
            Inclui jornada assistida, plataforma e IA de pré-triagem · arredondado a R$ 50.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
