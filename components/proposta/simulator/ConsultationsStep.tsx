'use client';

import { useMemo, useRef, useState } from 'react';
import {
  getMargin,
  getShiftMultiple,
  PLAN_LABELS,
  SPECIALTIES,
  type AgendaType,
  type ConsultationLineSummary,
  type PlanId,
} from '@/lib/pricing';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { newEntryId, useConsultationsSummary, useProposal } from '../state/ProposalProvider';

const PLAN_ORDER: PlanId[] = ['popular', 'intermediario', 'premium'];

export function ConsultationsStep() {
  const { state, dispatch } = useProposal();
  const summary = useConsultationsSummary();
  const qtyRef = useRef<HTMLInputElement>(null);

  const [draftPlan, setDraftPlan] = useState<PlanId>('popular');
  const [draftAgenda, setDraftAgenda] = useState<AgendaType>('compartilhada');
  const [draftSpecialty, setDraftSpecialty] = useState<string>(SPECIALTIES[0].id);

  const summaryById = useMemo(() => {
    const map = new Map<string, ConsultationLineSummary>();
    summary.lines.forEach((line) => map.set(line.lineId, line));
    return map;
  }, [summary]);

  const hint = useMemo(() => {
    const specialty = SPECIALTIES.find((s) => s.id === draftSpecialty);
    if (!specialty) return '';
    if (draftAgenda === 'dedicada') {
      const multiple = getShiftMultiple(draftSpecialty, draftPlan);
      return `Agenda dedicada: 1 plantão de 4h de ${specialty.name} no plano ${PLAN_LABELS[draftPlan]} = ${multiple} consultas. A quantidade precisa ser múltiplo de ${multiple}.`;
    }
    return 'Agenda compartilhada: tempo ocioso da rede, compra avulsa, sem múltiplo.';
  }, [draftSpecialty, draftPlan, draftAgenda]);

  function addLine() {
    const quantity = Number(qtyRef.current?.value) || 0;
    if (!draftSpecialty || quantity < 1) return;
    dispatch({
      type: 'ADD_CONSULTATION_LINE',
      line: {
        id: newEntryId('cons'),
        specialtyId: draftSpecialty,
        plan: draftPlan,
        agenda: draftAgenda,
        quantity,
      },
    });
  }

  const software = summary.softwareMonthlyFee;
  const blockMargin = getMargin(summary.patientPrice, summary.subtotalCost);

  return (
    <div className="sc">
      <h3>
        <span className="n">2</span>Consultas: pacotes (agenda dedicada) e avulsas (compartilhada)
      </h3>

      <div className="frow">
        <label>
          Plano desta linha
          <span className="seg">
            {PLAN_ORDER.map((plan) => (
              <button
                key={plan}
                type="button"
                className={draftPlan === plan ? 'on' : ''}
                onClick={() => setDraftPlan(plan)}
              >
                {PLAN_LABELS[plan]}
              </button>
            ))}
          </span>
        </label>
        <label>
          Agenda desta linha
          <span className="seg">
            <button
              type="button"
              className={draftAgenda === 'compartilhada' ? 'on' : ''}
              onClick={() => setDraftAgenda('compartilhada')}
            >
              compartilhada
            </button>
            <button
              type="button"
              className={draftAgenda === 'dedicada' ? 'on' : ''}
              onClick={() => setDraftAgenda('dedicada')}
            >
              dedicada 4h
            </button>
          </span>
        </label>
      </div>

      <div className="frow">
        <label>
          Especialidade
          <select value={draftSpecialty} onChange={(e) => setDraftSpecialty(e.currentTarget.value)}>
            {SPECIALTIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Qtd.
          <input ref={qtyRef} type="number" min={1} defaultValue={10} />
        </label>
        <button className="sbtn" type="button" onClick={addLine}>
          + Adicionar linha
        </button>
      </div>

      {hint && <p className="hint">{hint}</p>}
      <p className="hint">
        <b>Custo unit. (Prontta)</b> é o que você paga à Prontta por consulta.{' '}
        <b>Preço venda</b> é o que o paciente paga. <b>Sua margem</b> é a diferença entre os
        dois.
      </p>

      <div className="tscroll">
        <table className="st">
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Plano</th>
              <th>Agenda</th>
              <th>Qtd.</th>
              <th>Custo unit. (Prontta)</th>
              <th>Custo total</th>
              <th>Preço venda</th>
              <th>Subtotal</th>
              <th>Sua margem</th>
              <th>Plantão</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {state.consultationLines.map((line) => {
              const detail = summaryById.get(line.id);
              if (!detail) return null;
              const specialty = SPECIALTIES.find((s) => s.id === line.specialtyId);
              const margin = getMargin(detail.unitSell, detail.unitCost);
              const validation = detail.validation;
              let pillClass = 'mut';
              let pillText = 'avulso';
              if (validation) {
                pillClass = validation.ok ? 'ok' : 'warn';
                pillText = validation.ok
                  ? `${validation.shifts} plantão`
                  : `múltiplo de ${validation.multiple}`;
              }
              return (
                <tr key={line.id}>
                  <td data-l="Especialidade">{specialty?.name}</td>
                  <td data-l="Plano">{PLAN_LABELS[line.plan]}</td>
                  <td data-l="Agenda">{line.agenda === 'dedicada' ? 'dedicada' : 'compartilhada'}</td>
                  <td data-l="Qtd.">{line.quantity}</td>
                  <td data-l="Custo unit. (Prontta)">{formatCurrency(detail.unitCost)}</td>
                  <td data-l="Custo total">{formatCurrency(detail.lineCost)}</td>
                  <td data-l="Preço venda">
                    <b>{formatCurrency(detail.unitSell)}</b>
                  </td>
                  <td data-l="Subtotal">
                    <b>{formatCurrency(detail.lineSell)}</b>
                  </td>
                  <td data-l="Sua margem">
                    {formatCurrency(margin.amount)} · {formatPercent(margin.percent)}
                  </td>
                  <td data-l="Plantão">
                    <span className={`pill ${pillClass}`}>{pillText}</span>
                  </td>
                  <td className="tdel">
                    <button
                      className="xdel"
                      type="button"
                      aria-label="Remover linha"
                      onClick={() => dispatch({ type: 'REMOVE_CONSULTATION_LINE', id: line.id })}
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
        <span>Custo das consultas (repasse à Prontta)</span>
        <b>{formatCurrency(summary.subtotalCost)}</b>
      </div>
      <div className="trow">
        <span>Sua margem nas consultas</span>
        <b>
          {formatCurrency(blockMargin.amount)} · {formatPercent(blockMargin.percent)}
        </b>
      </div>
      <div className="trow">
        <span>Preço das consultas ao paciente</span>
        <b>{formatCurrency(summary.patientPrice)}</b>
      </div>
      <div className="trow">
        <span>Software mensal</span>
        <b>
          {software === 0 && summary.totalQuantity > 0
            ? 'ISENTO (150 ou mais consultas/mês)'
            : formatCurrency(software)}
        </b>
      </div>
    </div>
  );
}
