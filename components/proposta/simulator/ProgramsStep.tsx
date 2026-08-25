'use client';

import { useMemo, useRef, useState } from 'react';
import { getMargin, PROGRAMS, type Cycle, type ProgramItemSummary } from '@/lib/pricing';
import { summarizeProgramsMonthly } from '@/lib/empresa/pricing';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { newEntryId, useProgramsSummary, useProposal } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

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
  const beneficio = state.mode === 'beneficio';
  // Rateio do ciclo no mês — o orçamento do RH é mensal, o contrato é por ciclo.
  const monthly = useMemo(
    () => summarizeProgramsMonthly(state.programSelections),
    [state.programSelections],
  );
  const monthlyById = useMemo(
    () => new Map(monthly.items.map((item) => [item.selectionId, item])),
    [monthly],
  );

  function addProgram() {
    const quantity = Number(qtyRef.current?.value) || 0;
    if (!draftProgram || quantity < 1) return;
    dispatch({
      type: 'ADD_PROGRAM_SELECTION',
      selection: { id: newEntryId('prog'), programId: draftProgram, cycle: draftCycle, quantity },
    });
  }

  return (
    <section id="passo-programas">
      <StepHeader
        step={3}
        tag="Some os programas"
        title="Programas de Saúde Assistida"
        lead={
          beneficio
            ? 'Jornadas fechadas de 3, 6 ou 12 meses por colaborador. O contrato é o ciclo cheio; a coluna mensal é o rateio dele no orçamento.'
            : 'Jornadas fechadas em ciclos de 3, 6 ou 12 meses, com a composição de especialistas já definida.'
        }
        chapterId="programas"
      />

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

      <p className="field-note">
        {beneficio ? (
          <>
            <b>Preço do ciclo</b> é o valor devido à Prontta por colaborador no ciclo inteiro, já
            com plataforma e IA. <b>Equiv. mensal</b> é esse valor dividido pelos meses do ciclo —
            serve para orçar, mas o compromisso contratual é o ciclo cheio.
          </>
        ) : (
          <>
            <b>Custo unit. (Prontta)</b> é o repasse do ciclo à Prontta (já inclui plataforma e IA).{' '}
            <b>Preço</b> é o que o paciente paga no ciclo. <b>Sua margem</b> é a diferença.
          </>
        )}
      </p>

      <div className="tscroll">
        <table className="st">
          <thead>
            <tr>
              <th>Programa</th>
              <th>Ciclo</th>
              <th>Qtd.</th>
              {beneficio ? (
                <>
                  <th>Preço do ciclo</th>
                  <th>Total do ciclo</th>
                  <th>Equiv. mensal</th>
                </>
              ) : (
                <>
                  <th>Custo unit. (Prontta)</th>
                  <th>Custo total</th>
                  <th>Preço (sua margem)</th>
                  <th>Subtotal</th>
                  <th>Sua margem</th>
                </>
              )}
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
                  {beneficio ? (
                    <>
                      <td data-l="Preço do ciclo">
                        <b>{formatCurrency(detail.unitRepasse)}</b>
                      </td>
                      <td data-l="Total do ciclo">
                        <b>{formatCurrency(detail.totalRepasse)}</b>
                      </td>
                      <td data-l="Equiv. mensal">
                        {formatCurrency(monthlyById.get(selection.id)?.monthlyEquivalent ?? 0)}
                      </td>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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

      {beneficio ? (
        <>
          <div className="dre-line">
            <span>Compromisso dos programas (ciclo cheio)</span>
            <strong>{formatCurrency(monthly.cycleCommitment)}</strong>
          </div>
          <div className="dre-line">
            <span>Equivalente mensal dos programas</span>
            <strong>{formatCurrency(monthly.monthlyTotal)}</strong>
          </div>
        </>
      ) : (
        <>
          <div className="dre-line">
            <span>Custo dos programas (repasse à Prontta)</span>
            <strong>{formatCurrency(summary.subtotalRepasse)}</strong>
          </div>
          <div className="dre-line">
            <span>Sua margem nos programas</span>
            <strong>
              {formatCurrency(blockMargin.amount)} · {formatPercent(blockMargin.percent)}
            </strong>
          </div>
          <div className="dre-line">
            <span>Subtotal programas</span>
            <strong>{formatCurrency(summary.subtotalSell)}</strong>
          </div>
        </>
      )}
    </section>
  );
}
