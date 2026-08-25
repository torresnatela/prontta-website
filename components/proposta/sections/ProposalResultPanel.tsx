'use client';

import { brlAuto } from '@/components/simulador/shared/format';
import { RollingCurrency, RollingPercent } from '@/components/simulador/shared/RollingCurrency';
import { formatCurrency } from '@/lib/utils';
import { useGenerateProposal } from '../pdf/useGenerateProposal';
import { useDRE, useProposal, useProposalTotals } from '../state/ProposalProvider';

/** Composição do total ao paciente: quanto vem de consultas e quanto de programas. */
function MixBar() {
  const totals = useProposalTotals();
  const total = totals.totalContractValue;
  if (total <= 0) return null;

  const consultasPercent = (totals.consultationsPatientPrice / total) * 100;
  const programasPercent = 100 - consultasPercent;

  return (
    <div className="bar-wrap">
      <div className="bar-labels">
        <span>Consultas</span>
        <span>Programas</span>
      </div>
      <div
        className="mixbar"
        role="img"
        aria-label={`Consultas ${consultasPercent.toFixed(0)}%, programas ${programasPercent.toFixed(0)}%`}
      >
        <span className="cost" style={{ width: `${consultasPercent}%` }} />
        <span className="profit" style={{ width: `${programasPercent}%` }} />
      </div>
    </div>
  );
}

/** Texto da taxa de implantação — os três modos do modelo. */
function implantationLabel(totals: ReturnType<typeof useProposalTotals>): string {
  const { implantation } = totals;
  if (implantation.mode === 'isento') return 'Isenta';
  if (implantation.mode === 'valor') return formatCurrency(implantation.value);
  return 'A combinar';
}

/**
 * Painel de resultado da proposta — a coluna direita, fixa enquanto o parceiro
 * mexe nos passos à esquerda.
 *
 * Absorveu a antiga `StickyBar` do rodapé: o botão de gerar o PDF mora aqui
 * agora, junto dos números que ele vai imprimir.
 */
export function ProposalResultPanel() {
  const { state } = useProposal();
  const totals = useProposalTotals();
  const dre = useDRE();
  const { generate, generating } = useGenerateProposal();

  const consultCount = state.consultationLines.reduce((sum, line) => sum + line.quantity, 0);
  const programCount = state.programSelections.reduce((sum, item) => sum + item.quantity, 0);
  const negative = dre.resultadoLiquido < 0;

  return (
    <aside className="result-panel" id="painel-resultado">
      <div className="result-top">
        <div className="result-kicker">Sua proposta agora</div>
        <div className="result-title">Total ao paciente</div>
        <div className="result-sub">
          {consultCount} consultas · {programCount} programa(s) no mês
        </div>
      </div>

      <div className="main-revenue">
        <div className="revenue-head">
          <small>Total da simulação ao paciente</small>
          <span className="result-live">Ao vivo</span>
        </div>
        <strong>
          <RollingCurrency value={totals.totalContractValue} />
        </strong>
        <span>
          {brlAuto(totals.consultationsPatientPrice)} em consultas ·{' '}
          {brlAuto(totals.programsSubtotal)} em programas
        </span>
      </div>

      <div className="result-list">
        <div className="result-item">
          <span>Repasse à Prontta</span>
          <strong>
            <RollingCurrency value={totals.repasse} />
          </strong>
        </div>
        <div className="result-item">
          <span>Software mensal</span>
          <strong>
            {totals.softwareMonthlyFee === 0 && consultCount > 0 ? (
              'Isento'
            ) : (
              <RollingCurrency value={totals.softwareMonthlyFee} />
            )}
          </strong>
        </div>
        <div className="result-item">
          <span>Impostos e despesas</span>
          <strong>
            <RollingCurrency value={dre.totalDespesas} />
          </strong>
        </div>
        <div className="result-item">
          <span>Taxa de implantação</span>
          <strong>{implantationLabel(totals)}</strong>
        </div>
      </div>

      <div className={`profit-card${negative ? ' negative' : ''}`}>
        <small>Seu resultado líquido no mês</small>
        <strong>
          <RollingCurrency value={dre.resultadoLiquido} />
        </strong>
        <div className="profit-row">
          <span>Margem líquida</span>
          <RollingPercent value={dre.margemLiquidaPct} />
        </div>
      </div>

      <MixBar />

      <button className="cta" type="button" onClick={generate} disabled={generating}>
        {generating ? 'Gerando…' : 'Gerar proposta em PDF'}
      </button>
      <a className="cta secondary" href="#contato">
        Falar com a Prontta
      </a>

      <div className="disclaimer">
        Simulação feita no seu navegador, com o mesmo racional da planilha oficial. Nada é enviado
        para a Prontta até você responder à proposta.
      </div>
    </aside>
  );
}

export function ProposalMobileBar() {
  const totals = useProposalTotals();
  return (
    <div className="mobile-result-bar" aria-label="Resumo da proposta atual">
      <div>
        <small>Total ao paciente</small>
        <strong>
          <RollingCurrency value={totals.totalContractValue} />
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
