'use client';

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { DREResult } from '@/lib/pricing';
import {
  buildConversionScenarios,
  calculateAcademiaDRE,
  calculateImplantationPayback,
  simulateAcademiaOwner,
  type AcademiaImplantation,
  type ConversionScenario,
  type OwnerSimulatorResult,
} from '@/lib/academias/pricing';
import {
  initialSimuladorState,
  simuladorReducer,
  type SimuladorAction,
  type SimuladorState,
} from './reducer';

interface SimuladorContextValue {
  state: SimuladorState;
  dispatch: Dispatch<SimuladorAction>;
  /** Único derivado: recalculado do engine a cada mudança, nunca armazenado. */
  simulation: OwnerSimulatorResult;
}

const SimuladorContext = createContext<SimuladorContextValue | null>(null);

export function SimuladorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simuladorReducer, initialSimuladorState);

  const simulation = useMemo(
    () =>
      simulateAcademiaOwner({
        programId: state.programId,
        cycle: state.cycle,
        students: state.students,
        personalSales: state.personalSales,
        ownerMarginPercent: state.ownerMarginPercent,
        personalCommissionPercent: state.personalCommissionPercent,
        manualMonthlyPrice: state.manualMonthlyPrice,
      }),
    [
      state.programId,
      state.cycle,
      state.students,
      state.personalSales,
      state.ownerMarginPercent,
      state.personalCommissionPercent,
      state.manualMonthlyPrice,
    ],
  );

  const value = useMemo(() => ({ state, dispatch, simulation }), [state, simulation]);
  return <SimuladorContext.Provider value={value}>{children}</SimuladorContext.Provider>;
}

export function useSimulador(): SimuladorContextValue {
  const context = useContext(SimuladorContext);
  if (!context) {
    throw new Error('useSimulador deve ser usado dentro de <SimuladorProvider>');
  }
  return context;
}

export function useSimulation(): OwnerSimulatorResult {
  return useSimulador().simulation;
}

export function useScenarios(): ConversionScenario[] {
  const { state, simulation } = useSimulador();
  return useMemo(
    () => buildConversionScenarios(simulation, state.cycle, state.baseMembers),
    [simulation, state.cycle, state.baseMembers],
  );
}

export function useAcademiaDRE(): DREResult {
  const { state, simulation } = useSimulador();
  return useMemo(
    () =>
      calculateAcademiaDRE({
        result: simulation,
        taxPercent: state.taxPercent,
        expenses: state.expenses,
      }),
    [simulation, state.taxPercent, state.expenses],
  );
}

/** Payback da taxa única — depende do resultado líquido, não da receita. */
export function useImplantation(): AcademiaImplantation {
  const { state } = useSimulador();
  const dre = useAcademiaDRE();
  return useMemo(
    () => calculateImplantationPayback(state.implantation, dre.resultadoLiquido),
    [state.implantation, dre.resultadoLiquido],
  );
}
