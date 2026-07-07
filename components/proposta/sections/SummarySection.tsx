'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import type { Implantation } from '@/lib/pricing';
import { formatCurrency } from '@/lib/utils';
import { SectionShell } from '../shared/SectionShell';
import { useProposal, useProposalTotals } from '../state/ProposalProvider';

const controlClass =
  'rounded-lg border-2 border-accent-light bg-white px-3 py-2 text-sm text-primary-navy focus:outline-none focus:border-primary-cyan';

function implantationLabel(implantation: Implantation): string {
  switch (implantation.mode) {
    case 'a_combinar':
      return 'A combinar';
    case 'isento':
      return 'Isenta';
    case 'valor':
      return formatCurrency(implantation.value);
  }
}

export function SummarySection() {
  const { state, dispatch } = useProposal();
  const totals = useProposalTotals();

  return (
    <SectionShell
      id="consolidador"
      kicker="Consolidador"
      title="Sua proposta, consolidada"
      subtitle="Consultas montadas + programas escolhidos formam o valor de uma proposta completa ao paciente — a base da simulação de resultado logo abaixo."
      tone="navy"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6">
        <div className="bg-white/5 border border-white/15 rounded-2xl p-6 md:p-8">
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-4" data-testid="total-consultas">
              <dt className="text-white/80">Consultas na proposta ao paciente</dt>
              <dd className="font-semibold">{formatCurrency(totals.consultationsPatientPrice)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4" data-testid="total-programas">
              <dt className="text-white/80">Programas de Saúde Assistida</dt>
              <dd className="font-semibold">{formatCurrency(totals.programsSubtotal)}</dd>
            </div>
            <div
              className="flex items-baseline justify-between gap-4 border-t border-white/20 pt-4"
              data-testid="total-contrato"
            >
              <dt className="text-lg font-semibold">Total da proposta ao paciente</dt>
              <dd className="text-3xl font-display font-bold text-primary-cyan">
                {formatCurrency(totals.totalContractValue)}
              </dd>
            </div>
            {totals.softwareMonthlyFee > 0 && (
              <div className="flex items-baseline justify-between gap-4 text-sm text-white/70">
                <dt>+ Software mensal (recorrente, só nas consultas)</dt>
                <dd>{formatCurrency(totals.softwareMonthlyFee)}/mês</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 text-sm text-white/70" data-testid="implantacao">
              <dt>+ Taxa de implantação (única)</dt>
              <dd>{implantationLabel(totals.implantation)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white/5 border border-white/15 rounded-2xl p-6 md:p-8">
          <h3 className="font-display font-bold text-lg mb-4">Implantação</h3>
          <label className="block text-sm text-white/80 mb-2" htmlFor="implantacao-modo">
            Taxa de implantação
          </label>
          <select
            id="implantacao-modo"
            className={`${controlClass} w-full`}
            value={state.implantation.mode}
            onChange={(e) => {
              const mode = e.target.value as Implantation['mode'];
              dispatch({
                type: 'SET_IMPLANTATION',
                implantation: mode === 'valor' ? { mode, value: 12000 } : { mode },
              });
            }}
          >
            <option value="a_combinar">A combinar</option>
            <option value="isento">Isenta</option>
            <option value="valor">Valor definido</option>
          </select>

          {state.implantation.mode === 'valor' && (
            <div className="mt-4">
              <label className="block text-sm text-white/80 mb-2" htmlFor="implantacao-valor">
                Valor da implantação (R$)
              </label>
              <input
                id="implantacao-valor"
                type="number"
                min={0}
                step={500}
                className={`${controlClass} w-full`}
                value={state.implantation.value}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_IMPLANTATION',
                    implantation: { mode: 'valor', value: Math.max(0, Number(e.target.value) || 0) },
                  })
                }
              />
            </div>
          )}

          <p className="text-xs text-white/60 mt-4">{PROPOSAL_CONTENT.implantationNote}</p>
          <p className="text-xs text-white/60 mt-2">{PROPOSAL_CONTENT.softwareRule}</p>
          <p className="text-xs text-white/60 mt-2">{PROPOSAL_CONTENT.proposalValidity}</p>
        </div>
      </div>
    </SectionShell>
  );
}
