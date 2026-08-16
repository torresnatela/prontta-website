'use client';

import { useEffect, useState } from 'react';
import { ACADEMIA_CYCLES, CYCLE_LABELS, getAcademiaProgram } from '@/lib/academias/catalog';
import {
  getBuilderModules,
  OWNER_COMMISSION_MAX_PERCENT,
  OWNER_MARGIN_MAX_PERCENT,
} from '@/lib/academias/pricing';
import { getProgramOfficialMonthly, getProgramRepasse } from '@/lib/pricing';
import { ChapterCue } from '../shared/ChapterCue';
import { brl, brlAuto } from '../shared/format';
import { ProgramPicker } from '../shared/ProgramPicker';
import { IncludedChips, SpecialistGrid } from '../shared/SpecialistGrid';
import { useSimulador, useSimulation } from './state/SimuladorProvider';

/* -------------------------------------------------------------------------- */
/* Passo 1 — programa                                                          */
/* -------------------------------------------------------------------------- */

export function ProgramStep() {
  const { state, dispatch } = useSimulador();

  return (
    <section>
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot">1</span> Escolha o programa
          </div>
          <h2>Qual jornada combina com seus alunos?</h2>
          <p>Comece pelos produtos com maior aderência ao ambiente da academia.</p>
        </div>
        <ChapterCue chapterId="programas" />
      </div>
      <ProgramPicker
        selectedId={state.programId}
        onSelect={(programId) => dispatch({ type: 'SET_PROGRAM', programId })}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Passo 2 — ciclo                                                             */
/* -------------------------------------------------------------------------- */

export function CycleStep() {
  const { state, dispatch } = useSimulador();

  return (
    <section>
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot">2</span> Defina o ciclo
          </div>
          <h2>Por quanto tempo o aluno será acompanhado?</h2>
        </div>
        <ChapterCue chapterId="ciclo" />
      </div>
      <div className="cycles">
        {ACADEMIA_CYCLES.map((cycle) => {
          const active = cycle === state.cycle;
          // Referência de custo, não o preço final — este muda com margem e comissão.
          const repasseMensal = getProgramRepasse(state.programId, cycle) / cycle;
          return (
            <button
              key={cycle}
              type="button"
              className={`cycle${active ? ' active' : ''}`}
              aria-pressed={active}
              onClick={() => dispatch({ type: 'SET_CYCLE', cycle })}
            >
              {cycle === 6 ? <span className="badge-best">Mais equilibrado</span> : null}
              <span className="months">{cycle} meses</span>
              <strong>{CYCLE_LABELS[cycle]}</strong>
              <small>custo Prontta {brlAuto(repasseMensal)}/mês</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Prévia da oferta                                                            */
/* -------------------------------------------------------------------------- */

export function OfferPreview() {
  const { state } = useSimulador();
  const simulation = useSimulation();
  const program = getAcademiaProgram(state.programId);
  const composition = getBuilderModules(state.programId, state.cycle);

  return (
    <section className="offer-preview">
      <div className="offer-preview-head">
        <div>
          <div className="offer-preview-kicker">O que sua academia oferecerá</div>
          <h3>
            {program.program.name} · Ciclo {CYCLE_LABELS[state.cycle]}
          </h3>
          <p>{program.publicDescription}</p>
        </div>
        <div className="offer-price">
          <small>Oferta ao associado</small>
          <strong>{brlAuto(simulation.monthlyPrice)}/mês</strong>
          <span>
            durante {state.cycle} meses · total {brlAuto(simulation.cycleSellTotal)}
          </span>
        </div>
      </div>
      <SpecialistGrid lines={composition} />
      <IncludedChips />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Passo 3 — preço e comissão                                                  */
/* -------------------------------------------------------------------------- */

const QUICK_STUDENTS = [10, 25, 50, 100];
const QUICK_MARGINS = [20, 25, 30, 35];
const QUICK_COMMISSIONS = [0, 3, 5, 7];

function StudentsWheel() {
  const { state, dispatch } = useSimulador();
  const { students, personalSales } = state;
  const allSales = personalSales >= students;

  const setStudents = (next: number) => {
    dispatch({ type: 'SET_STUDENTS', students: next });
    // Quem estava com "todas as vendas via personal" continua assim.
    if (allSales) dispatch({ type: 'SET_ALL_SALES' });
  };

  return (
    <div className="control-card">
      <div className="control-label">
        <span>Alunos aderentes</span>
        <span className="hint">por mês</span>
      </div>
      <div className="wheel-wrap">
        <button
          type="button"
          className="round-btn"
          onClick={() => setStudents(students - 1)}
          aria-label="Menos um aluno"
        >
          −
        </button>
        <div className="wheel">
          <span className="ghost top" aria-hidden="true">
            {Math.max(1, students - 1)} alunos
          </span>
          <label className="sr-only" htmlFor="students">
            Alunos aderentes
          </label>
          <input
            id="students"
            type="number"
            min={1}
            max={5000}
            value={students}
            onChange={(event) =>
              dispatch({ type: 'SET_STUDENTS', students: Number(event.currentTarget.value) || 0 })
            }
          />
          <span className="ghost bottom" aria-hidden="true">
            {students + 1} alunos
          </span>
        </div>
        <button
          type="button"
          className="round-btn"
          onClick={() => setStudents(students + 1)}
          aria-label="Mais um aluno"
        >
          +
        </button>
      </div>

      <div className="quick-values">
        {QUICK_STUDENTS.map((value) => (
          <button
            key={value}
            type="button"
            className={students === value ? 'active' : undefined}
            onClick={() => setStudents(value)}
          >
            {value} alunos
          </button>
        ))}
      </div>

      <div className="sales-personal">
        <div className="sales-personal-head">
          <span>Vendas atribuídas aos personais</span>
          <small>comissão só nessas adesões</small>
        </div>
        <div className="personal-sales-row">
          <label className="sr-only" htmlFor="personalSales">
            Vendas atribuídas aos personais
          </label>
          <input
            id="personalSales"
            type="number"
            min={0}
            max={students}
            value={personalSales}
            onChange={(event) =>
              dispatch({
                type: 'SET_PERSONAL_SALES',
                personalSales: Number(event.currentTarget.value) || 0,
              })
            }
          />
          <button type="button" onClick={() => dispatch({ type: 'SET_ALL_SALES' })}>
            Aplicar a todos
          </button>
        </div>
      </div>
    </div>
  );
}

interface PercentFieldProps {
  id: string;
  label: string;
  value: number;
  max: number;
  quick: readonly number[];
  onChange: (percent: number) => void;
}

function PercentField({ id, label, value, max, quick, onChange }: PercentFieldProps) {
  return (
    <div className="percent-field">
      <label htmlFor={id}>{label}</label>
      <div className="percent-input">
        <input
          id={id}
          type="number"
          min={0}
          max={max}
          step={1}
          value={Number(value.toFixed(2))}
          onChange={(event) => onChange(Number(event.currentTarget.value) || 0)}
        />
        <span aria-hidden="true">%</span>
      </div>
      <div className="quick-percent">
        {quick.map((percent) => (
          <button
            key={percent}
            type="button"
            className={Math.round(value) === percent ? 'active' : undefined}
            onClick={() => onChange(percent)}
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceCard() {
  const { state, dispatch } = useSimulador();
  const simulation = useSimulation();

  // Rascunho local para o campo poder ficar vazio enquanto o usuário digita.
  // Sem isso, apagar "450" para escrever "500" reprecificaria em R$ 4.
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => {
    if (state.manualMonthlyPrice === null) setDraft(null);
  }, [state.manualMonthlyPrice]);

  const priceValue = draft ?? String(Math.round(simulation.monthlyPrice * 100) / 100);

  return (
    <div className="control-card">
      <div className="control-label">
        <span>Formação do preço por aluno</span>
        <span className="hint">todos os campos editáveis</span>
      </div>

      <div className="pricing-stack">
        <div className="cost-highlight">
          <span>Custo Prontta por aluno/mês</span>
          <strong>{brlAuto(simulation.pronttaMonthly)}</strong>
        </div>

        <div className="percentage-grid">
          <PercentField
            id="ownerMargin"
            label="Margem líquida desejada da academia"
            value={state.ownerMarginPercent}
            max={OWNER_MARGIN_MAX_PERCENT}
            quick={QUICK_MARGINS}
            onChange={(percent) => dispatch({ type: 'SET_OWNER_MARGIN', percent })}
          />
          <PercentField
            id="personalCommission"
            label="Comissão do personal por venda"
            value={state.personalCommissionPercent}
            max={OWNER_COMMISSION_MAX_PERCENT}
            quick={QUICK_COMMISSIONS}
            onChange={(percent) => dispatch({ type: 'SET_COMMISSION', percent })}
          />
        </div>

        <div className="final-price-box">
          <label htmlFor="price">
            <small>Preço final ao associado (por mês)</small>
          </label>
          <div className="price-box">
            <span aria-hidden="true">R$</span>
            <input
              id="price"
              type="number"
              min={0}
              step={5}
              value={priceValue}
              onChange={(event) => {
                const raw = event.currentTarget.value;
                setDraft(raw);
                dispatch({ type: 'SET_MANUAL_PRICE', price: raw === '' ? null : Number(raw) });
              }}
            />
          </div>
          {simulation.priceIsManual ? (
            <button
              type="button"
              className="price-reset"
              onClick={() => dispatch({ type: 'SET_MANUAL_PRICE', price: null })}
            >
              ← Voltar ao preço calculado
            </button>
          ) : null}
        </div>
      </div>

      <div className="info-strip">
        <div>
          <small>Preço sugerido Prontta</small>
          {/* Tabela oficial V8 da planilha, não o preço derivado da margem. */}
          <strong>{brlAuto(getProgramOfficialMonthly(state.programId, state.cycle))}/mês</strong>
        </div>
        <div>
          <small>Margem por venda</small>
          <strong>{simulation.resolvedOwnerMarginPercent.toFixed(1).replace('.', ',')}%</strong>
        </div>
        <div>
          <small>Total por aluno no ciclo</small>
          <strong>{brlAuto(simulation.cycleSellTotal)}</strong>
        </div>
        <div>
          <small>Custo Prontta no ciclo</small>
          <strong>{brl(simulation.repasseCycle)}</strong>
        </div>
      </div>
    </div>
  );
}

export function PriceStep() {
  return (
    <section>
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot">3</span> Forme o preço e a comissão
          </div>
          <h2>Prontta, academia e personal na mesma conta</h2>
          <p>
            Defina sua margem líquida, a comissão do personal e o preço final que será apresentado
            ao associado.
          </p>
        </div>
      </div>
      <div className="controls-grid">
        <StudentsWheel />
        <PriceCard />
      </div>
    </section>
  );
}
