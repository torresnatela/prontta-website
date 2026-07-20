'use client';

import { useProposal } from '../state/ProposalProvider';

export function MarginsStep() {
  const { state, dispatch } = useProposal();

  return (
    <div className="sc">
      <h3>
        <span className="n">1</span>Suas margens sobre o preço final
      </h3>
      <div className="frow" style={{ gap: 48 }}>
        <label>
          Margem das consultas (%) — recomendado: 60
          <input
            type="number"
            min={1}
            max={90}
            step={1}
            defaultValue={Math.round(state.margins.consulta * 100)}
            onChange={(e) => dispatch({ type: 'SET_CONSULTA_MARGIN', value: Number(e.currentTarget.value) })}
          />
        </label>
        <label>
          Margem dos Programas de Saúde (%) — recomendado: 30
          <input
            type="number"
            min={1}
            max={90}
            step={1}
            defaultValue={Math.round(state.margins.programa * 100)}
            onChange={(e) => dispatch({ type: 'SET_PROGRAMA_MARGIN', value: Number(e.currentTarget.value) })}
          />
        </label>
      </div>
    </div>
  );
}
