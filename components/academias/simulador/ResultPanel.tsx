'use client';

import { CYCLE_LABELS, getAcademiaProgram } from '@/lib/academias/catalog';
import { brlAuto } from '../shared/format';
import { RollingCurrency, RollingPercent } from '../shared/RollingCurrency';
import { ShareLinkButton } from './ShareLinkButton';
import { useSimulador, useSimulation } from './state/SimuladorProvider';

function MixBar() {
  const { mix } = useSimulation();
  return (
    <div className="bar-wrap">
      <div className="bar-labels">
        <span>Prontta</span>
        <span>Personal</span>
        <span>Academia</span>
      </div>
      <div
        className="mixbar"
        role="img"
        aria-label={`Prontta ${mix.pronttaPercent.toFixed(0)}%, personal ${mix.personalPercent.toFixed(0)}%, academia ${mix.academiaPercent.toFixed(0)}%`}
      >
        <span className="cost" style={{ width: `${mix.pronttaPercent}%` }} />
        <span className="personal" style={{ width: `${mix.personalPercent}%` }} />
        <span className="profit" style={{ width: `${mix.academiaPercent}%` }} />
      </div>
    </div>
  );
}

function DistributionCard() {
  const { split } = useSimulation();
  return (
    <div className="distribution-card">
      <h4>Distribuição por venda indicada pelo personal</h4>
      <div className="distribution-row">
        <span>Associado paga</span>
        <strong>{brlAuto(split.associadoPays)}/mês</strong>
      </div>
      <div className="distribution-row">
        <span>Prontta</span>
        <strong>{brlAuto(split.prontta)}/mês</strong>
      </div>
      <div className="distribution-row personal">
        <span>Personal</span>
        <strong>{brlAuto(split.personal)}/mês</strong>
      </div>
      <div className="distribution-row academy">
        <span>Academia</span>
        <strong>{brlAuto(split.academia)}/mês</strong>
      </div>
    </div>
  );
}

export function ResultPanel() {
  const { state } = useSimulador();
  const simulation = useSimulation();
  const program = getAcademiaProgram(state.programId);

  return (
    <aside className="result-panel" id="resultado">
      <div className="result-top">
        <div className="result-kicker">Seu cenário agora</div>
        <div className="result-title">{program.program.name}</div>
        <div className="result-sub">
          Ciclo {CYCLE_LABELS[state.cycle]} · {state.cycle} meses
        </div>
      </div>

      <div className="main-revenue">
        <div className="revenue-head">
          <small>Receita recorrente mensal</small>
          <span className="result-live">Ao vivo</span>
        </div>
        <strong>
          <RollingCurrency value={simulation.monthlyRevenue} />
        </strong>
        <span>
          {state.students} alunos × {brlAuto(simulation.monthlyPrice)}/mês
        </span>
      </div>

      <div className="result-list">
        <div className="result-item">
          <span>Faturamento do ciclo</span>
          <strong>
            <RollingCurrency value={simulation.cycleRevenue} />
          </strong>
        </div>
        <div className="result-item">
          <span>Custo Prontta por mês</span>
          <strong>
            <RollingCurrency value={simulation.pronttaMonthlyTotal} />
          </strong>
        </div>
        <div className="result-item">
          <span>Comissão dos personais por mês</span>
          <strong>
            <RollingCurrency value={simulation.personalCommissionMonthly} />
          </strong>
        </div>
        <div className="result-item">
          <span>Lucro líquido da academia por mês</span>
          <strong>
            <RollingCurrency value={simulation.academyProfitMonthly} />
          </strong>
        </div>
      </div>

      <div className="profit-card">
        <small>Lucro líquido da academia no ciclo</small>
        <strong>
          <RollingCurrency value={simulation.academyProfitCycle} />
        </strong>
        <div className="profit-row">
          <span>Margem líquida efetiva</span>
          <RollingPercent value={simulation.effectiveMarginPercent} />
        </div>
      </div>

      <DistributionCard />
      <MixBar />
      <ShareLinkButton />

      <div className="disclaimer">
        A página pública mostra somente o programa, os especialistas, o ciclo e o valor definido pela
        academia. Custo Prontta, comissão dos personais e margem da academia ficam restritos a este
        simulador.
      </div>
    </aside>
  );
}

export function MobileResultBar() {
  const simulation = useSimulation();
  return (
    <div className="mobile-result-bar" aria-label="Resumo do resultado atual">
      <div>
        <small>Receita mensal estimada</small>
        <strong>{brlAuto(simulation.monthlyRevenue)}</strong>
      </div>
      <button
        type="button"
        onClick={() =>
          document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      >
        Ver resultado
      </button>
    </div>
  );
}
