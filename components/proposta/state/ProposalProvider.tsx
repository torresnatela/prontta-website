'use client';

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import {
  calculateDRE,
  consolidateProposal,
  summarizeConsultations,
  summarizePrograms,
  type ConsultationsSummary,
  type DREResult,
  type ProgramsSummary,
  type ClientType,
  type ProposalTotals,
} from '@/lib/pricing';
import {
  calculateBenefitCost,
  estimateReturn,
  type BenefitCost,
  type ReturnEstimate,
} from '@/lib/empresa/pricing';
import { resolveNarrative, type ProposalNarrative } from '@/lib/proposta/narrative';
import type { ProposalMode } from '@/lib/proposta/mode';
import { createInitialProposalState, proposalReducer, type ProposalAction, type ProposalState } from './reducer';

interface ProposalContextValue {
  state: ProposalState;
  dispatch: Dispatch<ProposalAction>;
}

const ProposalContext = createContext<ProposalContextValue | null>(null);

interface ProposalProviderProps {
  children: ReactNode;
  /**
   * Canal de venda que abre selecionado. É o que muda o vocabulário da
   * proposta (headline do hero, rótulo salvo no painel) — a matemática é a
   * mesma para todos. Cada rota comercial passa o seu: /proposta abre em
   * clínica, /proposta/academias abre em academia.
   */
  clientType?: ClientType;
  /**
   * Revenda ou benefício. Muda a estrutura, não só o vocabulário: no modo
   * benefício não há margem nem DRE, e o mix semente é outro.
   */
  mode?: ProposalMode;
}

export function ProposalProvider({ children, clientType, mode }: ProposalProviderProps) {
  const [state, dispatch] = useReducer(
    proposalReducer,
    { clientType, mode },
    createInitialProposalState,
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ProposalContext.Provider value={value}>{children}</ProposalContext.Provider>;
}

export function useProposal(): ProposalContextValue {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error('useProposal deve ser usado dentro de <ProposalProvider>');
  }
  return context;
}

export function useConsultationsSummary(): ConsultationsSummary {
  const { state } = useProposal();
  return useMemo(
    () => summarizeConsultations(state.consultationLines, state.margins.consulta),
    [state.consultationLines, state.margins.consulta],
  );
}

export function useProgramsSummary(): ProgramsSummary {
  const { state } = useProposal();
  return useMemo(
    () => summarizePrograms(state.programSelections, state.margins.programa),
    [state.programSelections, state.margins.programa],
  );
}

export function useProposalTotals(): ProposalTotals {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  const programs = useProgramsSummary();
  return useMemo(
    () => consolidateProposal(consultations, programs, state.implantation),
    [consultations, programs, state.implantation],
  );
}

export function useDRE(): DREResult {
  const { state } = useProposal();
  const totals = useProposalTotals();
  return useMemo(
    () =>
      calculateDRE({
        totalContractValue: totals.totalContractValue,
        repasse: totals.repasse,
        taxPercent: state.dre.taxPercent,
        expenses: state.dre.expenses,
        softwareMonthlyFee: totals.softwareMonthlyFee,
      }),
    [totals, state.dre],
  );
}

/** Gera ids únicos para linhas/seleções criadas na UI. */
export function newEntryId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

/* ------------------------------------------------------------------ *
 *  Modo benefício
 * ------------------------------------------------------------------ */

/**
 * Custo do benefício.
 *
 * Lê `patientPrice` das consultas porque, com margem 0, ele é idêntico ao
 * `subtotalCost` — o repasse. Os programas NÃO vêm de `useProgramsSummary`:
 * aquele resumo devolve o ciclo cheio, e aqui o que interessa é o rateio
 * mensal. Ver `summarizeProgramsMonthly`.
 */
export function useBenefitCost(): BenefitCost {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  return useMemo(
    () =>
      calculateBenefitCost({
        consultationsMonthly: consultations.patientPrice,
        programSelections: state.programSelections,
        softwareMonthlyFee: consultations.softwareMonthlyFee,
        headcount: state.benefit.headcount,
        adhesionPercent: state.benefit.adhesionPercent,
        funding: state.benefit.funding,
      }),
    [consultations, state.programSelections, state.benefit],
  );
}

export function useBenefitReturn(): ReturnEstimate {
  const { state } = useProposal();
  const cost = useBenefitCost();
  return useMemo(
    () =>
      estimateReturn({
        ...state.benefit.roi,
        eligible: cost.eligible,
        adherents: cost.adherents,
        companyMonthly: cost.companyMonthly,
      }),
    [state.benefit.roi, cost],
  );
}

/** O texto institucional já resolvido pelo modo e pelo modelo de atendimento. */
export function useProposalNarrative(): ProposalNarrative {
  const { state } = useProposal();
  return useMemo(
    () =>
      resolveNarrative({
        mode: state.mode,
        clientType: state.clientType,
        serviceModel: state.benefit.serviceModel,
      }),
    [state.mode, state.clientType, state.benefit.serviceModel],
  );
}
