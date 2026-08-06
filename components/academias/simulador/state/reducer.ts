import type { Cycle, DREExpenses, Implantation } from '@/lib/pricing';
import {
  DEFAULT_ACADEMIA_CYCLE,
  DEFAULT_ACADEMIA_PROGRAM_ID,
  type AcademiaProgramId,
} from '@/lib/academias/catalog';
import {
  DEFAULT_OWNER_COMMISSION_PERCENT,
  DEFAULT_OWNER_MARGIN_PERCENT,
  OWNER_COMMISSION_MAX_PERCENT,
  OWNER_MARGIN_MAX_PERCENT,
} from '@/lib/academias/pricing';

export interface SimuladorState {
  programId: AcademiaProgramId;
  cycle: Cycle;
  students: number;
  personalSales: number;
  ownerMarginPercent: number;
  personalCommissionPercent: number;
  /** Mensalidade digitada à mão; `null` = derivada do markup. */
  manualMonthlyPrice: number | null;
  /** Base de alunos da academia, usada nos cenários de conversão. */
  baseMembers: number;
  taxPercent: number;
  expenses: DREExpenses;
  /** Taxa única — não entra na DRE mensal, só alimenta o payback. */
  implantation: Implantation;
}

export type SimuladorAction =
  | { type: 'SET_PROGRAM'; programId: AcademiaProgramId }
  | { type: 'SET_CYCLE'; cycle: Cycle }
  | { type: 'SET_STUDENTS'; students: number }
  | { type: 'SET_PERSONAL_SALES'; personalSales: number }
  | { type: 'SET_ALL_SALES' }
  | { type: 'SET_OWNER_MARGIN'; percent: number }
  | { type: 'SET_COMMISSION'; percent: number }
  | { type: 'SET_MANUAL_PRICE'; price: number | null }
  | { type: 'SET_BASE_MEMBERS'; baseMembers: number }
  | { type: 'SET_TAX_PERCENT'; percent: number }
  | { type: 'SET_EXPENSE'; key: keyof DREExpenses; value: number }
  | { type: 'SET_IMPLANTATION'; implantation: Implantation };

/**
 * Todo clamp mora aqui.
 *
 * Motivo: o commit `ca2561e` (“inputs controlados no simulador”) corrigiu
 * exatamente o bug de um valor fora de faixa continuar aparecendo na tela
 * enquanto o estado já estava limitado. Campo vazio vira NaN — nada pode
 * envenenar o estado.
 */
const clampInt = (value: number, min: number, max = Number.MAX_SAFE_INTEGER): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
};

const clampPercent = (value: number, max: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, value));
};

const clampMoney = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};

export const initialSimuladorState: SimuladorState = {
  programId: DEFAULT_ACADEMIA_PROGRAM_ID,
  cycle: DEFAULT_ACADEMIA_CYCLE,
  students: 25,
  personalSales: 25,
  ownerMarginPercent: DEFAULT_OWNER_MARGIN_PERCENT,
  personalCommissionPercent: DEFAULT_OWNER_COMMISSION_PERCENT,
  manualMonthlyPrice: null,
  baseMembers: 800,
  taxPercent: 6,
  // Zeradas de propósito: a academia já paga aluguel e equipe pelo negócio
  // principal. Os defaults de clínica (DRE_DEFAULTS) mostrariam prejuízo logo
  // abaixo de um painel exibindo lucro.
  expenses: { pessoal: 0, aluguel: 0, fixas: 0, marketing: 0, outras: 0 },
  implantation: { mode: 'a_combinar' },
};

export function simuladorReducer(state: SimuladorState, action: SimuladorAction): SimuladorState {
  switch (action.type) {
    case 'SET_PROGRAM':
      // Trocar de programa invalida o preço digitado para o programa anterior.
      return { ...state, programId: action.programId, manualMonthlyPrice: null };

    case 'SET_CYCLE':
      return { ...state, cycle: action.cycle, manualMonthlyPrice: null };

    case 'SET_STUDENTS': {
      const students = clampInt(action.students, 1);
      // Invariante: quem tinha 25/25 e cai para 10 alunos não pode ficar com 25
      // vendas de personal.
      return { ...state, students, personalSales: Math.min(state.personalSales, students) };
    }

    case 'SET_PERSONAL_SALES':
      return { ...state, personalSales: clampInt(action.personalSales, 0, state.students) };

    case 'SET_ALL_SALES':
      return { ...state, personalSales: state.students };

    case 'SET_OWNER_MARGIN':
      return {
        ...state,
        ownerMarginPercent: clampPercent(action.percent, OWNER_MARGIN_MAX_PERCENT),
        manualMonthlyPrice: null,
      };

    case 'SET_COMMISSION':
      return {
        ...state,
        personalCommissionPercent: clampPercent(action.percent, OWNER_COMMISSION_MAX_PERCENT),
        manualMonthlyPrice: null,
      };

    case 'SET_MANUAL_PRICE': {
      if (action.price === null) return { ...state, manualMonthlyPrice: null };
      const price = clampMoney(action.price);
      return { ...state, manualMonthlyPrice: price > 0 ? price : null };
    }

    case 'SET_BASE_MEMBERS':
      return { ...state, baseMembers: clampInt(action.baseMembers, 0) };

    case 'SET_TAX_PERCENT':
      return { ...state, taxPercent: clampPercent(action.percent, 100) };

    case 'SET_EXPENSE':
      return {
        ...state,
        expenses: { ...state.expenses, [action.key]: clampMoney(action.value) },
      };

    case 'SET_IMPLANTATION': {
      const { implantation } = action;
      return {
        ...state,
        implantation:
          implantation.mode === 'valor'
            ? { mode: 'valor', value: clampMoney(implantation.value) }
            : implantation,
      };
    }

    default:
      return state;
  }
}
