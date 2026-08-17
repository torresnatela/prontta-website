'use client';

import { useMemo, useRef, useState } from 'react';
import { getMargin, PROGRAMS, type Cycle, type ProgramItemSummary } from '@/lib/pricing';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { newEntryId, useProgramsSummary, useProposal } from '../state/ProposalProvider';

const CYCLES: Cycle[] = [3, 6, 12];

export function ProgramsStep() {
  const { state, dispatch } = useProposal();
  const summary = useProgramsSummary();
  const qtyRef = useRef<HTMLInputElement>(null);

  const [draftProgram, setDraftProgram] = useState<string>(PROGRAMS[0].id);
  const [draftCycle, setDraftCycle] = useState<Cycle>(6);

  const summaryById = useMemo(() => {
    const map = new Map<string, ProgramItemSummary>();
    summary.items.forEach((item) => map.set(item.selectionId, item));
    return map;
  }, [summary]);

  const blockMargin = getMargin(summary.subtotalSell, summary.subtotalRepasse);

  function addProgram() {
    const quantity = Number(qtyRef.current?.value) || 0;
    if (!draftProgram || quantity < 1) return;
    dispatch({
      type: 'ADD_PROGRAM_SELECTION',
      selection: { id: newEntryId('prog'), programId: draftProgram, cycle: draftCycle, quantity },
    });
  }

  return (
    <div className="sc">
      <h3>
        <span className="n">3</span>Programas de Saúde Assistida
      </h3>

      <div className="frow">
        <label>
          Programa
          <select value={draftProgram} onChange={(e) => setDraftProgram(e.currentTarget.value)}>
            {PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ciclo
          <select
            value={draftCycle}
            onChange={(e) => setDraftCycle(Number(e.currentTarget.value) as Cycle)}
          >
            {CYCLES.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle} meses
              </option>
            ))}
          </select>
        </label>
        <label>
          Qtd.
          <input ref={qtyRef} type="number" min={1} defaultValue={1} />
        </label>
        <button className="sbtn" type="button" onClick={addProgram}>
          + Adicionar programa
        </button>
      </div>

      <p className="hint">
        <b>Custo unit. (Prontta)</b> é o repasse do ciclo à Prontta (já inclui plataforma e
        IA). <b>Preço</b> é o que o paciente paga no ciclo. <b>Sua margem</b> é a diferença.
      </p>

      <div className="tscroll">
        <table className="st">
          <thead>
            <tr>
              <th>Programa</th>
              <th>Ciclo</th>
              <th>Qtd.</th>
              <th>Custo unit. (Prontta)</th>
              <th>Custo total</th>
              <th>Preço (sua margem)</th>
              <th>Subtotal</th>
              <th>Sua margem</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {state.programSelections.map((selection) => {
              const detail = summaryById.get(selection.id);
              if (!detail) return null;
              const program = PROGRAMS.find((p) => p.id === selection.programId);
              const margin = getMargin(detail.unitSell, detail.unitRepasse);
              return (
                <tr key={selection.id}>
                  <td data-l="Programa">{program?.name}</td>
                  <td data-l="Ciclo">{selection.cycle} meses</td>
                  <td data-l="Qtd.">{selection.quantity}</td>
                  <td data-l="Custo unit. (Prontta)">{formatCurrency(detail.unitRepasse)}</td>
                  <td data-l="Custo total">{formatCurrency(detail.totalRepasse)}</td>
                  <td data-l="Preço">
                    <b>{formatCurrency(detail.unitSell)}</b>
                  </td>
                  <td data-l="Subtotal">
                    <b>{formatCurrency(detail.totalSell)}</b>
                  </td>
                  <td data-l="Sua margem">
                    {formatCurrency(margin.amount)} · {formatPercent(margin.percent)}
                  </td>
                  <td className="tdel">
                    <button
                      className="xdel"
                      type="button"
                      aria-label="Remover programa"
                      onClick={() => dispatch({ type: 'REMOVE_PROGRAM_SELECTION', id: selection.id })}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="trow">
        <span>Custo dos programas (repasse à Prontta)</span>
        <b>{formatCurrency(summary.subtotalRepasse)}</b>
      </div>
      <div className="trow">
        <span>Sua margem nos programas</span>
        <b>
          {formatCurrency(blockMargin.amount)} · {formatPercent(blockMargin.percent)}
        </b>
      </div>
      <div className="trow">
        <span>Subtotal programas</span>
        <b>{formatCurrency(summary.subtotalSell)}</b>
      </div>
    </div>
  );
}
