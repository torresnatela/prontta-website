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
  type ProposalTotals,
} from '@/lib/pricing';
import { initialProposalState, proposalReducer, type ProposalAction, type ProposalState } from './reducer';

interface ProposalContextValue {
  state: ProposalState;
  dispatch: Dispatch<ProposalAction>;
}

const ProposalContext = createContext<ProposalContextValue | null>(null);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(proposalReducer, initialProposalState);
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
    () => summarizeConsultations(state.consultationLines, state.referencePlan),
    [state.consultationLines, state.referencePlan],
  );
}

export function useProgramsSummary(): ProgramsSummary {
  const { state } = useProposal();
  return useMemo(() => summarizePrograms(state.programSelections), [state.programSelections]);
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
        proposalsPerMonth: state.dre.proposalsPerMonth,
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
