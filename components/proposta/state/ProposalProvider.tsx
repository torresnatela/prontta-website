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
import { initialProposalState, proposalReducer, type ProposalAction, type ProposalState } from './reducer';

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
   * clínica, /academias/proposta abre em academia.
   */
  clientType?: ClientType;
}

export function ProposalProvider({ children, clientType }: ProposalProviderProps) {
  const [state, dispatch] = useReducer(
    proposalReducer,
    clientType,
    (type): ProposalState => (type ? { ...initialProposalState, clientType: type } : initialProposalState),
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
