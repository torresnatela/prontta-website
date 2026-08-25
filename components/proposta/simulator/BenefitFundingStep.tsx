'use client';

import {
  FUNDING_LABELS,
  FUNDING_MODES,
  DEFAULT_EMPLOYEE_PERCENT,
  type Funding,
  type FundingMode,
} from '@/lib/empresa/pricing';
import { IMPLANTATION_RANGE, type Implantation } from '@/lib/pricing';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useBenefitCost, useProposal, useProposalNarrative } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

const SHORT_LABEL: Record<FundingMode, string> = {
  integral: 'empresa paga tudo',
  coparticipacao: 'dividido',
  colaborador: 'colaborador paga',
};

type ImplMode = 'AC' | 'V' | 'I';

/**
 * Passo 4: quem paga o quê — e, logo abaixo, o custo já rateado.
 *
 * A escolha do custeio e a leitura do custo moram no mesmo passo de propósito:
 * o RH mexe no rateio para ver o número mudar, e separar as duas coisas em
 * passos distintos obrigaria a rolar a página a cada ajuste.
 */
export function BenefitFundingStep() {
  const { state, dispatch } = useProposal();
  const cost = useBenefitCost();
  const narrative = useProposalNarrative();
  const { funding, serviceModel } = state.benefit;

  const employeePercent =
    funding.mode === 'coparticipacao' ? funding.employeePercent : DEFAULT_EMPLOYEE_PERCENT;

  function setMode(mode: FundingMode) {
    const next: Funding =
      mode === 'coparticipacao' ? { mode, employeePercent } : { mode };
    dispatch({ type: 'SET_FUNDING', funding: next });
  }

  const implMode: ImplMode =
    state.implantation.mode === 'isento' ? 'I' : state.implantation.mode === 'valor' ? 'V' : 'AC';
  const implValue = state.implantation.mode === 'valor' ? state.implantation.value : 0;

  function setImplantation(next: Implantation) {
    dispatch({ type: 'SET_IMPLANTATION', implantation: next });
  }

  return (
    <section id="passo-custeio">
      <StepHeader
        step={4}
        tag="Defina o custeio"
        title="Quem paga o benefício"
        lead="A empresa pode custear tudo, dividir com o colaborador ou apenas abrir o canal."
        chapterId="beneficio"
      />

      <div className="frow">
        <label>
          Modelo de custeio
          <span className="seg">
            {FUNDING_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className={funding.mode === mode ? 'on' : ''}
                onClick={() => setMode(mode)}
              >
                {SHORT_LABEL[mode]}
              </button>
            ))}
          </span>
        </label>
        {funding.mode === 'coparticipacao' && (
          <label>
            Parte do colaborador (%)
            <input
              type="number"
              min={0}
              max={100}
              step={5}
              value={employeePercent}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FUNDING',
                  funding: {
                    mode: 'coparticipacao',
                    employeePercent: Number(e.currentTarget.value) || 0,
                  },
                })
              }
            />
          </label>
        )}
      </div>

      <p className="field-note">{FUNDING_LABELS[funding.mode]}.</p>

      {serviceModel === 'ponto_de_acesso' ? (
        <div className="frow">
          <label>
            Taxa de implantação
            <select
              value={implMode}
              onChange={(e) => {
                const mode = e.currentTarget.value as ImplMode;
                setImplantation(
                  mode === 'I'
                    ? { mode: 'isento' }
                    : mode === 'V'
                      ? { mode: 'valor', value: implValue }
                      : { mode: 'a_combinar' },
                );
              }}
            >
              <option value="AC">A combinar</option>
              <option value="V">Informar valor</option>
              <option value="I">Isenta</option>
            </select>
          </label>
          <label>
            Valor
            <input
              type="number"
              min={0}
              step={500}
              disabled={implMode !== 'V'}
              value={implValue}
              onChange={(e) =>
                setImplantation({
                  mode: 'valor',
                  value: Math.max(0, Number(e.currentTarget.value) || 0),
                })
              }
            />
          </label>
        </div>
      ) : (
        <p className="field-note">
          <b>Sem implantação.</b> {narrative.implantation.note}
        </p>
      )}

      <div className="dre-line">
        <span>Investimento mensal do benefício</span>
        <strong>{formatCurrency(cost.monthlyTotal)}</strong>
      </div>
      <div className="dre-line">
        <span>A empresa paga ({formatPercent(100 - cost.employeeSharePercent)})</span>
        <strong>{formatCurrency(cost.companyMonthly)}</strong>
      </div>
      <div className="dre-line">
        <span>Os colaboradores pagam ({formatPercent(cost.employeeSharePercent)})</span>
        <strong>{formatCurrency(cost.employeeMonthly)}</strong>
      </div>
      <div className="dre-line">
        <span>Cada aderente paga por mês</span>
        <strong>{formatCurrency(cost.employeeOutOfPocket)}</strong>
      </div>

      {cost.employeeSharePercent > 0 && (
        <p className="field-note">
          O desconto em folha da parte do colaborador depende de autorização prévia e expressa dele
          (CLT, art. 462), e é revogável.
          {serviceModel === 'ponto_de_acesso'
            ? ' A taxa de implantação é investimento único e não entra no mensal.'
            : ''}
        </p>
      )}
      {serviceModel === 'ponto_de_acesso' && implMode === 'AC' && (
        <p className="field-note">
          Faixa de referência da implantação: {formatCurrency(IMPLANTATION_RANGE.min)} a{' '}
          {formatCurrency(IMPLANTATION_RANGE.max)}, investimento único.
        </p>
      )}
    </section>
  );
}
