'use client';

import { formatCurrency } from '@/lib/utils';
import { SectionShell } from '../shared/SectionShell';
import { useDRE, useProposal } from '../state/ProposalProvider';

const controlClass =
  'w-full rounded-lg border-2 border-accent-light bg-white px-3 py-2 text-sm text-primary-navy focus:outline-none focus:border-primary-cyan';

const EXPENSE_FIELDS = [
  { key: 'pessoal', label: 'Pessoal / equipe dedicada (R$/mês)' },
  { key: 'aluguel', label: 'Aluguel / espaço do ponto de acesso (R$/mês)' },
  { key: 'fixas', label: 'Despesas fixas — energia, internet, limpeza (R$/mês)' },
  { key: 'marketing', label: 'Marketing e captação local (R$/mês)' },
  { key: 'outras', label: 'Outras despesas (R$/mês)' },
] as const;

function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function DRESection() {
  const { state, dispatch } = useProposal();
  const dre = useDRE();
  const operationalExpenses = dre.totalDespesas - dre.impostos - dre.software;

  return (
    <SectionShell
      id="resultado"
      kicker="Simulação de resultado"
      title="Quanto essa operação gera por mês"
      subtitle="Defina quantas propostas iguais a essa você vende por mês e ajuste os custos da sua operação. A simulação é uma estimativa e não constitui promessa de resultado."
      tone="muted"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-accent-light p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-primary-navy">Premissas da sua operação</h3>

          <div>
            <label className="block text-sm font-medium text-primary-navy mb-1.5" htmlFor="dre-propostas">
              Propostas vendidas por mês
            </label>
            <input
              id="dre-propostas"
              type="number"
              min={0}
              className={controlClass}
              value={state.dre.proposalsPerMonth}
              onChange={(e) => dispatch({ type: 'SET_PROPOSALS_PER_MONTH', value: Number(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-navy mb-1.5" htmlFor="dre-impostos">
              Impostos sobre a receita (%)
            </label>
            <input
              id="dre-impostos"
              type="number"
              min={0}
              max={100}
              step={0.5}
              className={controlClass}
              value={state.dre.taxPercent}
              onChange={(e) => dispatch({ type: 'SET_TAX_PERCENT', value: Number(e.target.value) || 0 })}
            />
          </div>

          {EXPENSE_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-primary-navy mb-1.5" htmlFor={`dre-${field.key}`}>
                {field.label}
              </label>
              <input
                id={`dre-${field.key}`}
                type="number"
                min={0}
                step={100}
                className={controlClass}
                value={state.dre.expenses[field.key]}
                onChange={(e) =>
                  dispatch({ type: 'SET_EXPENSE', key: field.key, value: Number(e.target.value) || 0 })
                }
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-accent-light p-6">
            <h3 className="font-display text-lg font-bold text-primary-navy mb-4">DRE mensal estimada</h3>
            <dl className="divide-y divide-accent-light text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-neutral-gray">(=) Receita bruta mensal</dt>
                <dd className="font-semibold text-primary-navy">{formatCurrency(dre.receitaBruta)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-neutral-gray">(−) Custo Prontta (serviços médicos e plataforma)</dt>
                <dd className="font-semibold text-primary-navy">{formatCurrency(dre.custoProntta)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-neutral-gray">(−) Impostos sobre a receita</dt>
                <dd className="font-semibold text-primary-navy">{formatCurrency(dre.impostos)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-neutral-gray">(−) Despesas operacionais</dt>
                <dd className="font-semibold text-primary-navy">{formatCurrency(operationalExpenses)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-neutral-gray">(−) Software mensal Prontta</dt>
                <dd className="font-semibold text-primary-navy">{formatCurrency(dre.software)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-primary-navy rounded-2xl p-6 text-white">
            <div className="flex flex-wrap items-baseline justify-between gap-4" data-testid="resultado-liquido">
              <p className="text-white/80">(=) Resultado líquido estimado</p>
              <p className="text-3xl md:text-4xl font-display font-bold text-primary-cyan">
                {formatCurrency(dre.resultadoLiquido)}
                <span className="text-base font-sans font-normal text-white/70">/mês</span>
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-4 mt-2 text-sm" data-testid="margem-liquida">
              <p className="text-white/70">Margem líquida sobre a receita</p>
              <p className="font-semibold">{formatPercent(dre.margemLiquidaPct)}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
