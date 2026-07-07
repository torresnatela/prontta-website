import { DRE_DEFAULTS } from '@/lib/pricing';
import type {
  ClientType,
  ConsultationLine,
  Implantation,
  PlanId,
  ProgramSelection,
} from '@/lib/pricing';

export interface ProposalDREState {
  proposalsPerMonth: number;
  taxPercent: number;
  expenses: {
    pessoal: number;
    aluguel: number;
    fixas: number;
    marketing: number;
    outras: number;
  };
}

export interface ProposalState {
  clientType: ClientType;
  referencePlan: PlanId;
  consultationLines: ConsultationLine[];
  programSelections: ProgramSelection[];
  implantation: Implantation;
  dre: ProposalDREState;
}

export type ProposalAction =
  | { type: 'SET_CLIENT_TYPE'; clientType: ClientType }
  | { type: 'SET_REFERENCE_PLAN'; plan: PlanId }
  | { type: 'ADD_CONSULTATION_LINE'; line: ConsultationLine }
  | { type: 'UPDATE_CONSULTATION_LINE'; id: string; patch: Partial<Omit<ConsultationLine, 'id'>> }
  | { type: 'REMOVE_CONSULTATION_LINE'; id: string }
  | { type: 'ADD_PROGRAM_SELECTION'; selection: ProgramSelection }
  | { type: 'UPDATE_PROGRAM_SELECTION'; id: string; patch: Partial<Omit<ProgramSelection, 'id'>> }
  | { type: 'REMOVE_PROGRAM_SELECTION'; id: string }
  | { type: 'SET_IMPLANTATION'; implantation: Implantation }
  | { type: 'SET_PROPOSALS_PER_MONTH'; value: number }
  | { type: 'SET_TAX_PERCENT'; value: number }
  | { type: 'SET_EXPENSE'; key: keyof ProposalDREState['expenses']; value: number };

/**
 * Estado inicial semeado com o mix de referência da planilha oficial
 * (total do contrato R$ 14.600 → resultado líquido R$ 23.133/mês),
 * para a página abrir já demonstrando uma proposta completa.
 */
export const initialProposalState: ProposalState = {
  clientType: 'clinica',
  referencePlan: 'popular',
  consultationLines: [
    { id: 'seed-endocrino', specialtyId: 'endocrinologia', agenda: 'dedicada', quantity: 10, cycleMonths: 6 },
    { id: 'seed-nutricao', specialtyId: 'nutricao', agenda: 'compartilhada', quantity: 3, cycleMonths: 6 },
    { id: 'seed-psicologia', specialtyId: 'psicologia-adulto', agenda: 'compartilhada', quantity: 6, cycleMonths: 6 },
    { id: 'seed-cardio', specialtyId: 'cardiologia-adulto', agenda: 'dedicada', quantity: 10, cycleMonths: 6 },
  ],
  programSelections: [
    { id: 'seed-emagrecimento', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 1 },
    { id: 'seed-longevidade', programId: 'longevidade-ativa', cycle: 12, quantity: 1 },
    { id: 'seed-capilar', programId: 'saude-capilar', cycle: 6, quantity: 1 },
  ],
  implantation: { mode: 'a_combinar' },
  dre: {
    proposalsPerMonth: DRE_DEFAULTS.proposalsPerMonth,
    taxPercent: DRE_DEFAULTS.taxPercent,
    expenses: { ...DRE_DEFAULTS.expenses },
  },
};

const clampQuantity = (value: number) => Math.max(1, Math.floor(value));
const clampNonNegative = (value: number) => Math.max(0, value);

export function proposalReducer(state: ProposalState, action: ProposalAction): ProposalState {
  switch (action.type) {
    case 'SET_CLIENT_TYPE':
      return { ...state, clientType: action.clientType };
    case 'SET_REFERENCE_PLAN':
      return { ...state, referencePlan: action.plan };
    case 'ADD_CONSULTATION_LINE':
      return {
        ...state,
        consultationLines: [
          ...state.consultationLines,
          { ...action.line, quantity: clampQuantity(action.line.quantity) },
        ],
      };
    case 'UPDATE_CONSULTATION_LINE':
      return {
        ...state,
        consultationLines: state.consultationLines.map((line) =>
          line.id === action.id
            ? {
                ...line,
                ...action.patch,
                quantity:
                  action.patch.quantity !== undefined
                    ? clampQuantity(action.patch.quantity)
                    : line.quantity,
              }
            : line,
        ),
      };
    case 'REMOVE_CONSULTATION_LINE':
      return {
        ...state,
        consultationLines: state.consultationLines.filter((line) => line.id !== action.id),
      };
    case 'ADD_PROGRAM_SELECTION':
      return {
        ...state,
        programSelections: [
          ...state.programSelections,
          { ...action.selection, quantity: clampQuantity(action.selection.quantity) },
        ],
      };
    case 'UPDATE_PROGRAM_SELECTION':
      return {
        ...state,
        programSelections: state.programSelections.map((selection) =>
          selection.id === action.id
            ? {
                ...selection,
                ...action.patch,
                quantity:
                  action.patch.quantity !== undefined
                    ? clampQuantity(action.patch.quantity)
                    : selection.quantity,
              }
            : selection,
        ),
      };
    case 'REMOVE_PROGRAM_SELECTION':
      return {
        ...state,
        programSelections: state.programSelections.filter((selection) => selection.id !== action.id),
      };
    case 'SET_IMPLANTATION':
      return { ...state, implantation: action.implantation };
    case 'SET_PROPOSALS_PER_MONTH':
      return {
        ...state,
        dre: { ...state.dre, proposalsPerMonth: Math.floor(clampNonNegative(action.value)) },
      };
    case 'SET_TAX_PERCENT':
      return { ...state, dre: { ...state.dre, taxPercent: Math.min(100, clampNonNegative(action.value)) } };
    case 'SET_EXPENSE':
      return {
        ...state,
        dre: {
          ...state.dre,
          expenses: { ...state.dre.expenses, [action.key]: clampNonNegative(action.value) },
        },
      };
    default:
      return state;
  }
}
