'use client';

import { brlAuto } from '../shared/format';
import { useScenarios, useSimulador } from './state/SimuladorProvider';

const JOURNEY = [
  ['Academia apresenta', 'Programa alinhado ao perfil do aluno.'],
  ['Aluno adere', 'Entrada em ciclo de 3, 6 ou 12 meses.'],
  ['Prontta acompanha', 'Especialistas, pré-triagem e jornada.'],
  ['Parceiro recebe', 'Nova receita recorrente e previsível.'],
];

export function BelowSections() {
  const { state, dispatch } = useSimulador();
  const scenarios = useScenarios();

  return (
    <section className="below">
      <div className="panel">
        <div className="step-tag">
          <span className="step-dot" aria-hidden="true">
            ↗
          </span>{' '}
          Conversão da base
        </div>
        <h2>Pequena adesão, lucro relevante</h2>
        <p className="panel-lead">
          Lucro líquido mensal considerando comissão em <strong>todas</strong> as vendas — o cenário
          mais conservador.
        </p>

        <div className="personal-sales-row base-members">
          <label className="sr-only" htmlFor="baseMembers">
            Base de alunos da academia
          </label>
          <input
            id="baseMembers"
            type="number"
            min={0}
            step={50}
            value={state.baseMembers}
            onChange={(event) =>
              dispatch({
                type: 'SET_BASE_MEMBERS',
                baseMembers: Number(event.currentTarget.value) || 0,
              })
            }
          />
          <span className="hint">alunos na sua base hoje</span>
        </div>

        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <div className="scenario" key={scenario.ratePercent}>
              <small>
                {scenario.label} · {scenario.ratePercent}%
              </small>
              <strong>{scenario.students} alunos</strong>
              <span>{brlAuto(scenario.academyMonthlyProfit)}/mês de lucro</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="step-tag">
          <span className="step-dot" aria-hidden="true">
            ✓
          </span>{' '}
          Operação simples
        </div>
        <h2>Da escolha ao cuidado contínuo</h2>
        <div className="journey">
          {JOURNEY.map(([title, description], index) => (
            <div key={title}>
              <b aria-hidden="true">{index + 1}</b>
              <strong>{title}</strong>
              <small>{description}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
