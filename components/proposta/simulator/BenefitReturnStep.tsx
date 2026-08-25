'use client';

import type { ReturnAssumptionKey } from '@/lib/empresa/pricing';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  useBenefitCost,
  useBenefitReturn,
  useProposal,
  useProposalNarrative,
} from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

const FIELDS: Array<{ key: ReturnAssumptionKey; label: string; step?: number; max?: number }> = [
  { key: 'avgSalary', label: 'Salário médio mensal (R$)', step: 100 },
  { key: 'payrollChargesPercent', label: 'Encargos sobre a folha (%)', step: 5 },
  { key: 'absenceDaysPerYear', label: 'Dias de afastamento por pessoa/ano', step: 1 },
  { key: 'absenceReductionPercent', label: 'Redução esperada (%)', step: 1, max: 100 },
  { key: 'healthPlanPerCapita', label: 'Plano de saúde por vida (R$/mês)', step: 50 },
];

/**
 * Passo 5: o retorno estimado — o bloco mais sensível da proposta.
 *
 * Nada aqui é dado da Prontta. Todas as premissas são digitadas pelo consultor
 * junto com o cliente e ficam visíveis na tela e no PDF; enquanto estiverem
 * zeradas, o passo NÃO apresenta resultado nenhum — ele pede os números.
 *
 * O número que abre o bloco é a redução NECESSÁRIA para o benefício se pagar,
 * não a economia projetada: é aritmética sobre os dados do próprio cliente e
 * deixa o julgamento com ele, em vez de a Prontta afirmar uma economia.
 */
export function BenefitReturnStep() {
  const { state, dispatch } = useProposal();
  const cost = useBenefitCost();
  const result = useBenefitReturn();
  const narrative = useProposalNarrative();

  return (
    <section id="passo-retorno">
      <StepHeader
        step={5}
        tag="Estime o retorno"
        title="O que o benefício devolve"
        lead="Preencha com os números da empresa. São premissas dela, não da Prontta — e o resultado muda com cada uma."
        chapterId="retorno"
      />

      <div className="frow">
        {FIELDS.slice(0, 3).map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min={0}
              max={field.max}
              step={field.step}
              value={state.benefit.roi[field.key]}
              onChange={(e) =>
                dispatch({
                  type: 'SET_RETURN_ASSUMPTION',
                  key: field.key,
                  value: Number(e.currentTarget.value) || 0,
                })
              }
            />
          </label>
        ))}
      </div>
      <div className="frow">
        {FIELDS.slice(3).map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type="number"
              min={0}
              max={field.max}
              step={field.step}
              value={state.benefit.roi[field.key]}
              onChange={(e) =>
                dispatch({
                  type: 'SET_RETURN_ASSUMPTION',
                  key: field.key,
                  value: Number(e.currentTarget.value) || 0,
                })
              }
            />
          </label>
        ))}
      </div>

      {result.hasAbsenceEstimate ? (
        <>
          <div className="dre-line">
            <span>Custo do dia parado</span>
            <strong>{formatCurrency(result.dailyCost)}</strong>
          </div>
          <div className="dre-line">
            <span>Custo do afastamento entre os aderentes (mês)</span>
            <strong>{formatCurrency(result.absenceCostMonthly)}</strong>
          </div>
          <div className="dre-line">
            <span>Absenteísmo evitado com a redução informada</span>
            <strong>{formatCurrency(result.absenceSavedMonthly)}</strong>
          </div>
          <div className="dre-line">
            <span>Resultado no mês (evitado − desembolso da empresa)</span>
            <strong>{formatCurrency(result.netMonthly)}</strong>
          </div>
        </>
      ) : (
        <p className="field-note">
          Preencha salário médio, dias de afastamento e redução esperada para ver a estimativa. Sem
          esses três números, nada é projetado.
        </p>
      )}

      {result.breakEvenReductionPercent !== null && (
        <div className="dre-line">
          <span>Redução necessária para o benefício se pagar</span>
          <strong>{formatPercent(result.breakEvenReductionPercent)}</strong>
        </div>
      )}

      {result.hasHealthPlanComparison && (
        <>
          <div className="dre-line">
            <span>Gasto atual com plano de saúde (mês)</span>
            <strong>{formatCurrency(result.healthPlanMonthly)}</strong>
          </div>
          <div className="dre-line">
            <span>O benefício representa, do gasto com plano</span>
            <strong>{formatPercent(result.benefitShareOfHealthPlanPercent)}</strong>
          </div>
          <p className="field-note">
            A comparação é de escala de custo, não de substituição: o benefício não cobre
            internação, urgência, exames nem procedimentos, e não substitui o plano de saúde.
          </p>
        </>
      )}

      <div className="riskbox">
        <b>Sobre esta estimativa.</b>
        <p>{narrative.legalNotes.fechamento}</p>
      </div>

      <p className="field-note">
        Base do cálculo: {cost.adherents} aderentes. O ganho é atribuído a quem aderiu, nunca à
        população elegível inteira.
      </p>
    </section>
  );
}
