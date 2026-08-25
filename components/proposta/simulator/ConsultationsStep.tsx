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
import { StepHeader } from './StepHeader';

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
    <section id="passo-consultas">
      <StepHeader
        step={2}
        tag="Monte as consultas"
        title="Pacotes em agenda dedicada e avulsas na compartilhada"
        lead="Cada linha tem plano e agenda próprios — é o plano que define quantas consultas cabem numa hora médica."
        chapterId="consultas"
      />

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

      {hint && <p className="field-note">{hint}</p>}
      <p className="field-note">
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

      <div className="dre-line">
        <span>Custo das consultas (repasse à Prontta)</span>
        <strong>{formatCurrency(summary.subtotalCost)}</strong>
      </div>
      <div className="dre-line">
        <span>Sua margem nas consultas</span>
        <strong>
          {formatCurrency(blockMargin.amount)} · {formatPercent(blockMargin.percent)}
        </strong>
      </div>
      <div className="dre-line">
        <span>Preço das consultas ao paciente</span>
        <strong>{formatCurrency(summary.patientPrice)}</strong>
      </div>
      <div className="dre-line">
        <span>Software mensal</span>
        <strong>
          {software === 0 && summary.totalQuantity > 0
            ? 'ISENTO (150 ou mais consultas/mês)'
            : formatCurrency(software)}
        </strong>
      </div>
    </section>
  );
}
