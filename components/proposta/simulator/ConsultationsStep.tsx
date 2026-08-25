'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  getMargin,
  getShiftMultiple,
  PLAN_LABELS,
  SPECIALTIES,
  type AgendaType,
  type ConsultationLineSummary,
  type PlanId,
} from '@/lib/pricing';
import type { ProposalMode } from '@/lib/proposta/mode';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { newEntryId, useConsultationsSummary, useProposal } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

const PLAN_ORDER: PlanId[] = ['popular', 'intermediario', 'premium'];

type ColumnId =
  | 'especialidade'
  | 'plano'
  | 'agenda'
  | 'qtd'
  | 'custoUnit'
  | 'custoTotal'
  | 'precoUnit'
  | 'subtotal'
  | 'margem'
  | 'plantao'
  | 'del';

/**
 * As colunas de cada modo, declaradas de uma vez.
 *
 * No modo benefício não existe margem: a empresa paga o repasse, então "custo
 * unitário" e "preço de venda" seriam a MESMA coluna repetida, e "sua margem"
 * seria uma coluna de zeros. Some as três em vez de renderizá-las vazias.
 */
const COLUMNS: Record<ProposalMode, readonly ColumnId[]> = {
  revenda: [
    'especialidade', 'plano', 'agenda', 'qtd',
    'custoUnit', 'custoTotal', 'precoUnit', 'subtotal', 'margem',
    'plantao', 'del',
  ],
  beneficio: ['especialidade', 'plano', 'agenda', 'qtd', 'precoUnit', 'subtotal', 'plantao', 'del'],
};

const HEADERS: Record<ProposalMode, Partial<Record<ColumnId, string>>> = {
  revenda: { precoUnit: 'Preço venda', subtotal: 'Subtotal' },
  beneficio: { precoUnit: 'Preço unit. (empresa)', subtotal: 'Total no mês' },
};

const BASE_HEADERS: Record<ColumnId, string> = {
  especialidade: 'Especialidade',
  plano: 'Plano',
  agenda: 'Agenda',
  qtd: 'Qtd.',
  custoUnit: 'Custo unit. (Prontta)',
  custoTotal: 'Custo total',
  precoUnit: 'Preço venda',
  subtotal: 'Subtotal',
  margem: 'Sua margem',
  plantao: 'Plantão',
  del: '',
};

export function ConsultationsStep() {
  const { state, dispatch } = useProposal();
  const summary = useConsultationsSummary();
  const qtyRef = useRef<HTMLInputElement>(null);

  const [draftPlan, setDraftPlan] = useState<PlanId>('popular');
  const [draftAgenda, setDraftAgenda] = useState<AgendaType>('compartilhada');
  const [draftSpecialty, setDraftSpecialty] = useState<string>(SPECIALTIES[0].id);

  const beneficio = state.mode === 'beneficio';
  const columns = COLUMNS[state.mode];
  const headerFor = (id: ColumnId) => HEADERS[state.mode][id] ?? BASE_HEADERS[id];

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
        lead={
          beneficio
            ? 'A bolsa de consultas que a empresa contrata por mês. Cada linha tem plano e agenda próprios — é o plano que define quantas consultas cabem numa hora médica.'
            : 'Cada linha tem plano e agenda próprios — é o plano que define quantas consultas cabem numa hora médica.'
        }
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
        {beneficio ? (
          <>
            <b>Preço unit. (empresa)</b> é o valor devido à Prontta por consulta, já com plataforma
            e IA. Não há margem de intermediação nesta proposta.
          </>
        ) : (
          <>
            <b>Custo unit. (Prontta)</b> é o que você paga à Prontta por consulta.{' '}
            <b>Preço venda</b> é o que o paciente paga. <b>Sua margem</b> é a diferença entre os
            dois.
          </>
        )}
      </p>

      <div className="tscroll">
        <table className="st">
          <thead>
            <tr>
              {columns.map((id) =>
                id === 'del' ? <th key={id} /> : <th key={id}>{headerFor(id)}</th>,
              )}
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

              const cells: Record<ColumnId, ReactNode> = {
                especialidade: specialty?.name,
                plano: PLAN_LABELS[line.plan],
                agenda: line.agenda === 'dedicada' ? 'dedicada' : 'compartilhada',
                qtd: line.quantity,
                custoUnit: formatCurrency(detail.unitCost),
                custoTotal: formatCurrency(detail.lineCost),
                precoUnit: <b>{formatCurrency(detail.unitSell)}</b>,
                subtotal: <b>{formatCurrency(detail.lineSell)}</b>,
                margem: `${formatCurrency(margin.amount)} · ${formatPercent(margin.percent)}`,
                plantao: <span className={`pill ${pillClass}`}>{pillText}</span>,
                del: (
                  <button
                    className="xdel"
                    type="button"
                    aria-label="Remover linha"
                    onClick={() => dispatch({ type: 'REMOVE_CONSULTATION_LINE', id: line.id })}
                  >
                    ×
                  </button>
                ),
              };

              return (
                <tr key={line.id}>
                  {columns.map((id) =>
                    id === 'del' ? (
                      <td className="tdel" key={id}>
                        {cells.del}
                      </td>
                    ) : (
                      <td data-l={headerFor(id)} key={id}>
                        {cells[id]}
                      </td>
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {beneficio ? (
        <div className="dre-line">
          <span>Consultas no mês ({summary.totalQuantity})</span>
          <strong>{formatCurrency(summary.patientPrice)}</strong>
        </div>
      ) : (
        <>
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
        </>
      )}
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
