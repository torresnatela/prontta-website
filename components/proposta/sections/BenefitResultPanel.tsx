'use client';

import { brlAuto } from '@/components/simulador/shared/format';
import { RollingCurrency, RollingPercent } from '@/components/simulador/shared/RollingCurrency';
import { formatCurrency } from '@/lib/utils';
import { useGenerateProposal } from '../pdf/useGenerateProposal';
import {
  useBenefitCost,
  useBenefitReturn,
  useProposal,
  useProposalNarrative,
} from '../state/ProposalProvider';

/** Quanto do investimento sai da empresa e quanto sai do colaborador. */
function FundingBar() {
  const cost = useBenefitCost();
  if (cost.monthlyTotal <= 0) return null;

  const empresa = 100 - cost.employeeSharePercent;

  return (
    <div className="bar-wrap">
      <div className="bar-labels">
        <span>Empresa</span>
        <span>Colaborador</span>
      </div>
      <div
        className="mixbar"
        role="img"
        aria-label={`Empresa ${empresa.toFixed(0)}%, colaborador ${cost.employeeSharePercent.toFixed(0)}%`}
      >
        <span className="profit" style={{ width: `${empresa}%` }} />
        <span className="cost" style={{ width: `${cost.employeeSharePercent}%` }} />
      </div>
    </div>
  );
}

function implantationLabel(mode: string, value: number, isRemote: boolean): string {
  if (isRemote) return 'Não aplicável';
  if (mode === 'isento') return 'Isenta';
  if (mode === 'valor') return formatCurrency(value);
  return 'A combinar';
}

/**
 * Painel de resultado do modo benefício.
 *
 * Deliberadamente NÃO mostra repasse, margem nem resultado líquido: a empresa
 * não revende. O número que abre o painel é o investimento mensal, e o card de
 * destaque é o custo por colaborador — a métrica que o RH leva para aprovação
 * interna e compara com qualquer outro benefício.
 */
export function BenefitResultPanel() {
  const { state } = useProposal();
  const cost = useBenefitCost();
  const result = useBenefitReturn();
  const narrative = useProposalNarrative();
  const { generate, generating } = useGenerateProposal();

  const isRemote = state.benefit.serviceModel === 'remoto';
  const implValue = state.implantation.mode === 'valor' ? state.implantation.value : 0;

  return (
    <aside className="result-panel" id="painel-resultado">
      <div className="result-top">
        <div className="result-kicker">O benefício agora</div>
        <div className="result-title">Investimento mensal</div>
        <div className="result-sub">
          {cost.adherents} aderentes de {cost.eligible} elegíveis
        </div>
      </div>

      <div className="main-revenue">
        <div className="revenue-head">
          <small>Investimento mensal do benefício</small>
          <span className="result-live">Ao vivo</span>
        </div>
        <strong>
          <RollingCurrency value={cost.monthlyTotal} />
        </strong>
        <span>
          {brlAuto(cost.consultationsMonthly)} em consultas ·{' '}
          {brlAuto(cost.programsMonthly)} em programas
        </span>
      </div>

      <div className="result-list">
        <div className="result-item">
          <span>A empresa paga</span>
          <strong>
            <RollingCurrency value={cost.companyMonthly} />
          </strong>
        </div>
        <div className="result-item">
          <span>Os colaboradores pagam</span>
          <strong>
            <RollingCurrency value={cost.employeeMonthly} />
          </strong>
        </div>
        <div className="result-item">
          <span>Custo por aderente</span>
          <strong>
            <RollingCurrency value={cost.costPerAdherent} />
          </strong>
        </div>
        <div className="result-item">
          <span>Compromisso do ciclo</span>
          <strong>
            <RollingCurrency value={cost.cycleCommitment} />
          </strong>
        </div>
        <div className="result-item">
          <span>Taxa de implantação</span>
          <strong>{implantationLabel(state.implantation.mode, implValue, isRemote)}</strong>
        </div>
      </div>

      <div className="profit-card">
        <small>Custo por colaborador elegível</small>
        <strong>
          <RollingCurrency value={cost.costPerEligible} />
        </strong>
        <div className="profit-row">
          <span>Investimento no ano</span>
          <RollingCurrency value={cost.annualTotal} />
        </div>
      </div>

      {result.breakEvenReductionPercent !== null && (
        <div className="result-list">
          <div className="result-item">
            <span>Redução de afastamento para se pagar</span>
            <strong>
              <RollingPercent value={result.breakEvenReductionPercent} />
            </strong>
          </div>
        </div>
      )}

      <FundingBar />

      <button className="cta" type="button" onClick={generate} disabled={generating}>
        {generating ? 'Gerando…' : 'Gerar proposta em PDF'}
      </button>
      <a className="cta secondary" href="#contato">
        {narrative.cta.secondary}
      </a>

      <div className="disclaimer">
        Simulação feita no seu navegador, com o mesmo racional da planilha oficial. Nada é enviado
        para a Prontta até a empresa responder à proposta.
      </div>
    </aside>
  );
}

export function BenefitMobileBar() {
  const cost = useBenefitCost();
  return (
    <div className="mobile-result-bar" aria-label="Resumo do benefício atual">
      <div>
        <small>Investimento mensal</small>
        <strong>
          <RollingCurrency value={cost.monthlyTotal} />
        </strong>
      </div>
      <button
        type="button"
        onClick={() =>
          document
            .getElementById('painel-resultado')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      >
        Ver resultado
      </button>
    </div>
  );
}
