'use client';

import { DEFAULT_CONSULTA_MARGIN, DEFAULT_PROGRAMA_MARGIN } from '@/lib/pricing';
import { useProposal } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

/** Percentuais recomendados, derivados do modelo — nunca digitados na tela. */
const RECOMMENDED = {
  consulta: Math.round(DEFAULT_CONSULTA_MARGIN * 100),
  programa: Math.round(DEFAULT_PROGRAMA_MARGIN * 100),
};

export function MarginsStep() {
  const { state, dispatch } = useProposal();

  return (
    <section id="passo-margens">
      <StepHeader
        step={1}
        tag="Defina sua margem"
        title="Quanto você ganha sobre o preço final"
        lead="É a sua remuneração como parceiro, embutida no preço que o paciente paga. Tudo abaixo recalcula na hora."
        chapterId="visao-geral"
      />
      <div className="frow" style={{ gap: 48 }}>
        <label>
          Margem das consultas (%) — recomendado: {RECOMMENDED.consulta}
          <input
            type="number"
            min={1}
            max={90}
            step={1}
            value={Math.round(state.margins.consulta * 100)}
            onChange={(e) =>
              dispatch({ type: 'SET_CONSULTA_MARGIN', value: Number(e.currentTarget.value) })
            }
          />
        </label>
        <label>
          Margem dos Programas de Saúde (%) — recomendado: {RECOMMENDED.programa}
          <input
            type="number"
            min={1}
            max={90}
            step={1}
            value={Math.round(state.margins.programa * 100)}
            onChange={(e) =>
              dispatch({ type: 'SET_PROGRAMA_MARGIN', value: Number(e.currentTarget.value) })
            }
          />
        </label>
      </div>
    </section>
  );
}
