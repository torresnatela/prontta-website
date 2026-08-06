'use client';

import { IMPLANTATION_RANGE, type DREExpenses, type Implantation } from '@/lib/pricing';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { brl, brlAuto, percent } from '../shared/format';
import {
  useAcademiaDRE,
  useImplantation,
  useSimulador,
  useSimulation,
} from './state/SimuladorProvider';

const EXPENSE_LABELS: Array<{ key: keyof DREExpenses; label: string }> = [
  { key: 'pessoal', label: 'Pessoal' },
  { key: 'aluguel', label: 'Aluguel' },
  { key: 'fixas', label: 'Fixas' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'outras', label: 'Outras' },
];

const IMPLANTATION_MODES: Array<{ mode: Implantation['mode']; label: string }> = [
  { mode: 'a_combinar', label: 'A combinar' },
  { mode: 'isento', label: 'Isenta' },
  { mode: 'valor', label: 'Valor definido' },
];

const months = (value: number) =>
  `${value.toFixed(1).replace('.', ',')} ${value >= 1 && value < 2 ? 'mês' : 'meses'}`;

function ImplantationBlock() {
  const { state, dispatch } = useSimulador();
  const implantation = useImplantation();
  const payback = implantation.paybackMonths;

  return (
    <div className="implantation">
      <div className="implantation-head">
        <div>
          <strong>Taxa única de implantação</strong>
          <small>{PROPOSAL_CONTENT.implantation.note}</small>
        </div>
        <div className="seg" role="group" aria-label="Modo da taxa de implantação">
          {IMPLANTATION_MODES.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              className={state.implantation.mode === mode ? 'on' : undefined}
              aria-pressed={state.implantation.mode === mode}
              onClick={() =>
                dispatch({
                  type: 'SET_IMPLANTATION',
                  implantation:
                    mode === 'valor'
                      ? { mode: 'valor', value: IMPLANTATION_RANGE.min }
                      : { mode },
                })
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {state.implantation.mode === 'valor' ? (
        <div className="dre-field implantation-value">
          <label htmlFor="implantationValue">Valor da implantação (R$)</label>
          <input
            id="implantationValue"
            type="number"
            min={0}
            step={500}
            value={state.implantation.value}
            onChange={(event) =>
              dispatch({
                type: 'SET_IMPLANTATION',
                implantation: { mode: 'valor', value: Number(event.currentTarget.value) || 0 },
              })
            }
          />
        </div>
      ) : null}

      <div className="dre-line implantation-payback">
        <span>Payback estimado da implantação</span>
        <strong>
          {payback === null
            ? '—'
            : payback.max === 0
              ? 'imediato (isenta)'
              : payback.min === payback.max
                ? months(payback.max)
                : `${payback.min.toFixed(1).replace('.', ',')} a ${months(payback.max)}`}
        </strong>
      </div>
    </div>
  );
}

/**
 * DRE mensal completa — recolhida por padrão para não pesar a tela.
 *
 * Reaproveita `calculateDRE` do engine. A comissão do personal aparece como
 * sub-linha de "outras despesas": ela não é repasse à Prontta.
 */
export function DREPanel() {
  const { state, dispatch } = useSimulador();
  const simulation = useSimulation();
  const dre = useAcademiaDRE();
  const despesasDigitadas = Object.values(state.expenses).reduce((sum, value) => sum + value, 0);

  return (
    <details className="dre">
      <summary>Ver DRE completa do mês (impostos e despesas fixas)</summary>
      <div className="dre-body">
        <div className="dre-fields">
          <div className="dre-field">
            <label htmlFor="taxPercent">Impostos (%)</label>
            <input
              id="taxPercent"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={state.taxPercent}
              onChange={(event) =>
                dispatch({ type: 'SET_TAX_PERCENT', percent: Number(event.currentTarget.value) || 0 })
              }
            />
          </div>
          {EXPENSE_LABELS.map(({ key, label }) => (
            <div className="dre-field" key={key}>
              <label htmlFor={`expense-${key}`}>{label} (R$)</label>
              <input
                id={`expense-${key}`}
                type="number"
                min={0}
                step={50}
                value={state.expenses[key]}
                onChange={(event) =>
                  dispatch({
                    type: 'SET_EXPENSE',
                    key,
                    value: Number(event.currentTarget.value) || 0,
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className="dre-line">
          <span>Receita bruta</span>
          <strong>{brlAuto(dre.receitaBruta)}</strong>
        </div>
        <div className="dre-line">
          <span>(−) Repasse à Prontta</span>
          <strong>{brlAuto(dre.repasse)}</strong>
        </div>
        <div className="dre-line">
          <span>(=) Margem bruta</span>
          <strong>{brlAuto(dre.margemBruta)}</strong>
        </div>
        <div className="dre-line">
          <span>(−) Impostos ({percent(state.taxPercent, 1)})</span>
          <strong>{brlAuto(dre.impostos)}</strong>
        </div>
        <div className="dre-line sub">
          <span>Comissão dos personais</span>
          <strong>{brlAuto(simulation.personalCommissionMonthly)}</strong>
        </div>
        <div className="dre-line sub">
          <span>Demais despesas digitadas</span>
          <strong>{brlAuto(despesasDigitadas)}</strong>
        </div>
        <div className="dre-line">
          <span>(−) Total de despesas</span>
          <strong>{brlAuto(dre.totalDespesas)}</strong>
        </div>
        <div className={`dre-line total${dre.resultadoLiquido < 0 ? ' negative' : ''}`}>
          <span>
            Resultado líquido do mês <b>({percent(dre.margemLiquidaPct)})</b>
          </span>
          <strong>{brlAuto(dre.resultadoLiquido)}</strong>
        </div>

        <ImplantationBlock />

        <p className="dre-note">
          {PROPOSAL_CONTENT.softwareRule} Por isso a linha de software entra zerada aqui. A comissão
          dos personais é despesa de venda da academia, não repasse à Prontta. A taxa de implantação
          é investimento único e não entra no resultado mensal — aparece apenas como payback.
        </p>
      </div>
    </details>
  );
}
