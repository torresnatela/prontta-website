'use client';

import {
  IMPLANTATION_RANGE,
  SOFTWARE_EXEMPTION_THRESHOLD,
  SOFTWARE_MONTHLY_FEE,
  type Implantation,
} from '@/lib/pricing';
import { formatCurrency } from '@/lib/utils';
import type { ProposalDREState } from '../state/reducer';
import { useProposal } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

type ImplMode = 'AC' | 'V' | 'I';

const EXPENSE_FIELDS: Array<{ key: keyof ProposalDREState['expenses']; label: string }> = [
  { key: 'pessoal', label: 'Pessoal (R$)' },
  { key: 'aluguel', label: 'Aluguel (R$)' },
  { key: 'fixas', label: 'Fixas (R$)' },
  { key: 'marketing', label: 'Marketing (R$)' },
  { key: 'outras', label: 'Outras (R$)' },
];

/**
 * "R$ 10 mil a R$ 15 mil" — derivado, para a faixa nunca divergir do modelo.
 * Compacto porque é rótulo de campo: por extenso ocuparia duas linhas.
 */
const compactBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 0,
});
const implantationRangeLabel = `${compactBRL.format(
  IMPLANTATION_RANGE.min,
)} a ${compactBRL.format(IMPLANTATION_RANGE.max)}`;

export function CostsStep() {
  const { state, dispatch } = useProposal();

  const implMode: ImplMode =
    state.implantation.mode === 'isento' ? 'I' : state.implantation.mode === 'valor' ? 'V' : 'AC';
  const implValue = state.implantation.mode === 'valor' ? state.implantation.value : 0;

  function setImplMode(mode: ImplMode) {
    const next: Implantation =
      mode === 'I' ? { mode: 'isento' } : mode === 'V' ? { mode: 'valor', value: implValue } : { mode: 'a_combinar' };
    dispatch({ type: 'SET_IMPLANTATION', implantation: next });
  }

  function setImplValue(value: number) {
    dispatch({ type: 'SET_IMPLANTATION', implantation: { mode: 'valor', value: Math.max(0, value) } });
  }

  return (
    <section id="passo-custos">
      <StepHeader
        step={4}
        tag="Informe seus custos"
        title="Custos mensais e implantação"
        lead="São os seus números, não os da Prontta — os valores abaixo são só um ponto de partida."
        chapterId="dre"
      />

      <div className="frow">
        <label>
          Impostos (%)
          <input
            type="number"
            min={0}
            step={0.5}
            value={state.dre.taxPercent}
            onChange={(e) => dispatch({ type: 'SET_TAX_PERCENT', value: Number(e.currentTarget.value) || 0 })}
          />
        </label>
        {EXPENSE_FIELDS.slice(0, 1).map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min={0}
              value={state.dre.expenses[field.key]}
              onChange={(e) =>
                dispatch({ type: 'SET_EXPENSE', key: field.key, value: Number(e.currentTarget.value) || 0 })
              }
            />
          </label>
        ))}
      </div>

      <div className="frow">
        {EXPENSE_FIELDS.slice(1).map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min={0}
              value={state.dre.expenses[field.key]}
              onChange={(e) =>
                dispatch({ type: 'SET_EXPENSE', key: field.key, value: Number(e.currentTarget.value) || 0 })
              }
            />
          </label>
        ))}
      </div>

      <div className="frow">
        <label>
          Taxa de implantação
          <select value={implMode} onChange={(e) => setImplMode(e.currentTarget.value as ImplMode)}>
            <option value="AC">A combinar</option>
            <option value="V">Informar valor</option>
            <option value="I">Isenta</option>
          </select>
        </label>
        <label>
          Valor ({implantationRangeLabel})
          <input
            type="number"
            min={0}
            step={500}
            disabled={implMode !== 'V'}
            value={implValue}
            onChange={(e) => setImplValue(Number(e.currentTarget.value) || 0)}
          />
        </label>
      </div>

      <p className="field-note">
        Software mensal de {formatCurrency(SOFTWARE_MONTHLY_FEE)} entra sozinho quando o volume fica
        abaixo de {SOFTWARE_EXEMPTION_THRESHOLD} consultas/mês; isento a partir de{' '}
        {SOFTWARE_EXEMPTION_THRESHOLD}. Programas já incluem a plataforma. A implantação é
        investimento único.
      </p>
    </section>
  );
}
