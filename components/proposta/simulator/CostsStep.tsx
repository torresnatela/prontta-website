'use client';

import type { Implantation } from '@/lib/pricing';
import type { ProposalDREState } from '../state/reducer';
import { useProposal } from '../state/ProposalProvider';

type ImplMode = 'AC' | 'V' | 'I';

const EXPENSE_FIELDS: Array<{ key: keyof ProposalDREState['expenses']; label: string }> = [
  { key: 'pessoal', label: 'Pessoal (R$)' },
  { key: 'aluguel', label: 'Aluguel (R$)' },
  { key: 'fixas', label: 'Fixas (R$)' },
  { key: 'marketing', label: 'Marketing (R$)' },
  { key: 'outras', label: 'Outras (R$)' },
];

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
    <div className="sc">
      <h3>
        <span className="n">4</span>Custos mensais e implantação
      </h3>

      <div className="frow">
        <label>
          Impostos (%)
          <input
            type="number"
            min={0}
            step={0.5}
            defaultValue={state.dre.taxPercent}
            onChange={(e) => dispatch({ type: 'SET_TAX_PERCENT', value: Number(e.currentTarget.value) })}
          />
        </label>
        {EXPENSE_FIELDS.slice(0, 1).map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min={0}
              defaultValue={state.dre.expenses[field.key]}
              onChange={(e) =>
                dispatch({ type: 'SET_EXPENSE', key: field.key, value: Number(e.currentTarget.value) })
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
              defaultValue={state.dre.expenses[field.key]}
              onChange={(e) =>
                dispatch({ type: 'SET_EXPENSE', key: field.key, value: Number(e.currentTarget.value) })
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
          Valor (R$ 10 a 15 mil)
          <input
            type="number"
            min={0}
            step={500}
            disabled={implMode !== 'V'}
            defaultValue={implValue}
            onChange={(e) => setImplValue(Number(e.currentTarget.value))}
          />
        </label>
      </div>

      <p className="hint">
        Software mensal de R$ 1.499 entra sozinho quando o volume fica abaixo de 150 consultas/mês;
        isento a partir de 150. Programas já incluem a plataforma. A implantação é investimento único.
      </p>
    </div>
  );
}
