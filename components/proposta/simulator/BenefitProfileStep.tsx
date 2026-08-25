'use client';

import { SERVICE_MODEL_LABELS, SERVICE_MODELS } from '@/lib/empresa/pricing';
import { formatPercent } from '@/lib/utils';
import { useBenefitCost, useProposal, useProposalNarrative } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

/**
 * Passo 1 do benefício: onde o colaborador é atendido e quantos são.
 *
 * O modelo de atendimento abre a proposta porque ele muda o escopo, o hold
 * harmless e a implantação — o reducer isenta a taxa sozinho no remoto.
 */
export function BenefitProfileStep() {
  const { state, dispatch } = useProposal();
  const cost = useBenefitCost();
  const narrative = useProposalNarrative();
  const { serviceModel, headcount, adhesionPercent } = state.benefit;

  return (
    <section id="passo-perfil">
      <StepHeader
        step={1}
        tag="Descreva a empresa"
        title="Modelo de atendimento e população"
        lead="Onde o colaborador se consulta e quantos podem aderir. É o que transforma o mix em custo por pessoa."
        chapterId="beneficio"
      />

      <div className="frow">
        <label>
          Modelo de atendimento
          <span className="seg">
            {SERVICE_MODELS.map((model) => (
              <button
                key={model}
                type="button"
                className={serviceModel === model ? 'on' : ''}
                onClick={() => dispatch({ type: 'SET_SERVICE_MODEL', value: model })}
              >
                {model === 'remoto' ? 'remoto' : 'ponto de acesso'}
              </button>
            ))}
          </span>
        </label>
      </div>

      <p className="field-note">
        <b>{SERVICE_MODEL_LABELS[serviceModel]}.</b>{' '}
        {serviceModel === 'remoto'
          ? 'O colaborador acessa do próprio dispositivo, de onde estiver. Sem sala, sem infraestrutura local e sem taxa de implantação.'
          : 'A empresa cede uma sala reservada e conectada; a Prontta opera. Vale a taxa única de implantação.'}
      </p>

      <div className="frow">
        <label>
          Colaboradores elegíveis
          <input
            type="number"
            min={0}
            step={10}
            value={headcount}
            onChange={(e) =>
              dispatch({ type: 'SET_HEADCOUNT', value: Number(e.currentTarget.value) || 0 })
            }
          />
        </label>
        <label>
          Adesão estimada (%)
          <input
            type="number"
            min={0}
            max={100}
            step={5}
            value={adhesionPercent}
            onChange={(e) =>
              dispatch({ type: 'SET_ADHESION', value: Number(e.currentTarget.value) || 0 })
            }
          />
        </label>
      </div>

      <div className="dre-line">
        <span>Colaboradores que devem aderir</span>
        <strong>
          {cost.adherents} de {cost.eligible} · {formatPercent(adhesionPercent)}
        </strong>
      </div>

      <p className="field-note">
        A adesão não muda o quanto a empresa contrata — ela muda por quantas pessoas o
        investimento se reparte. {narrative.softwareRule}
      </p>
    </section>
  );
}
