import {
  clampCount,
  clampMoney,
  clampPercent,
  DEFAULT_CONSULTA_MARGIN,
  DEFAULT_PROGRAMA_MARGIN,
  DRE_DEFAULTS,
  MARGIN_MAX,
  MARGIN_MIN,
} from '@/lib/pricing';
import type {
  ClientType,
  ConsultationLine,
  Implantation,
  PlanId,
  ProgramSelection,
} from '@/lib/pricing';
import {
  BENEFIT_DEFAULTS,
  EMPRESA_MARGIN,
  type BenefitAssumptions,
  type Funding,
  type ReturnAssumptionKey,
  type ServiceModel,
} from '@/lib/empresa/pricing';
import type { ProposalMode } from '@/lib/proposta/mode';

export interface ProposalDREState {
  taxPercent: number;
  expenses: {
    pessoal: number;
    aluguel: number;
    fixas: number;
    marketing: number;
    outras: number;
  };
}

/** Dados do vendedor que geram o bloco de contato do PDF. */
export interface ProposalSeller {
  name: string;
  email: string;
  phone: string;
}

export interface ProposalState {
  /**
   * Fixado pela rota, nunca alternado pelo usuário — por isso não existe
   * `SET_PROPOSAL_MODE`. Sem a action, a UI de revenda é estruturalmente
   * inalcançável a partir de /proposta/empresa.
   */
  mode: ProposalMode;
  clientType: ClientType;
  /** Margens editáveis do parceiro sobre o preço final (frações, ex.: 0.6 = 60%). */
  margins: {
    consulta: number;
    programa: number;
  };
  consultationLines: ConsultationLine[];
  programSelections: ProgramSelection[];
  implantation: Implantation;
  dre: ProposalDREState;
  /** Inerte no modo revenda. */
  benefit: BenefitAssumptions;
  seller: ProposalSeller;
}

export type ProposalAction =
  | { type: 'SET_CLIENT_TYPE'; clientType: ClientType }
  | { type: 'SET_CONSULTA_MARGIN'; value: number }
  | { type: 'SET_PROGRAMA_MARGIN'; value: number }
  | { type: 'ADD_CONSULTATION_LINE'; line: ConsultationLine }
  | { type: 'UPDATE_CONSULTATION_LINE'; id: string; patch: Partial<Omit<ConsultationLine, 'id'>> }
  | { type: 'REMOVE_CONSULTATION_LINE'; id: string }
  | { type: 'ADD_PROGRAM_SELECTION'; selection: ProgramSelection }
  | { type: 'UPDATE_PROGRAM_SELECTION'; id: string; patch: Partial<Omit<ProgramSelection, 'id'>> }
  | { type: 'REMOVE_PROGRAM_SELECTION'; id: string }
  | { type: 'SET_IMPLANTATION'; implantation: Implantation }
  | { type: 'SET_TAX_PERCENT'; value: number }
  | { type: 'SET_EXPENSE'; key: keyof ProposalDREState['expenses']; value: number }
  | { type: 'SET_SELLER'; patch: Partial<ProposalSeller> }
  | { type: 'SET_SERVICE_MODEL'; value: ServiceModel }
  | { type: 'SET_HEADCOUNT'; value: number }
  | { type: 'SET_ADHESION'; value: number }
  | { type: 'SET_FUNDING'; funding: Funding }
  | { type: 'SET_RETURN_ASSUMPTION'; key: ReturnAssumptionKey; value: number };

/**
 * Estado inicial semeado com o mix de referência do HTML oficial (44 consultas + 6 programas),
 * todo em agenda dedicada fechando plantões (sem alertas ao abrir).
 * Confere: total ao paciente R$ 28.900 → resultado líquido R$ 6.457/mês (margem ~22,3%).
 */
export const initialProposalState: ProposalState = {
  mode: 'revenda',
  clientType: 'clinica',
  margins: {
    consulta: DEFAULT_CONSULTA_MARGIN,
    programa: DEFAULT_PROGRAMA_MARGIN,
  },
  consultationLines: [
    { id: 'seed-endocrino', specialtyId: 'endocrinologia', plan: 'popular', agenda: 'dedicada', quantity: 20 },
    { id: 'seed-nutricao', specialtyId: 'nutricao', plan: 'popular', agenda: 'dedicada', quantity: 12 },
    { id: 'seed-psicologia', specialtyId: 'psicologia-adulto', plan: 'popular', agenda: 'dedicada', quantity: 12 },
  ],
  programSelections: [
    { id: 'seed-emagrecimento', programId: 'emagrecimento-inteligente', cycle: 6, quantity: 4 },
    { id: 'seed-longevidade', programId: 'longevidade-ativa', cycle: 6, quantity: 2 },
  ],
  implantation: { mode: 'a_combinar' },
  dre: {
    taxPercent: DRE_DEFAULTS.taxPercent,
    expenses: { ...DRE_DEFAULTS.expenses },
  },
  benefit: { ...BENEFIT_DEFAULTS, roi: { ...BENEFIT_DEFAULTS.roi } },
  seller: { name: '', email: '', phone: '' },
};

/**
 * Mix semente do modo BENEFÍCIO.
 *
 * Diferente do mix de revenda de propósito: o comprador aqui é o RH, e o que
 * abre a tela precisa parecer um benefício corporativo (clínico geral,
 * psicologia e nutrição; programas de saúde mental e de sono), não o mix de uma
 * clínica. Todas as linhas fecham plantão — a proposta abre sem alertas.
 *
 * Confere: R$ 3.850/mês em consultas (50) + R$ 1.278,67/mês em programas +
 * R$ 1.499 de software = R$ 6.627,67/mês. Com 320 elegíveis, R$ 20,71 por
 * colaborador. `lib/empresa/content.ts` espelha esses números no hero.
 */
const BENEFIT_SEED = {
  consultationLines: [
    { id: 'seed-generalista', specialtyId: 'medico-generalista', plan: 'popular', agenda: 'dedicada', quantity: 20 },
    { id: 'seed-psicologia', specialtyId: 'psicologia-adulto', plan: 'popular', agenda: 'dedicada', quantity: 18 },
    { id: 'seed-nutricao', specialtyId: 'nutricao', plan: 'popular', agenda: 'dedicada', quantity: 12 },
  ] satisfies ConsultationLine[],
  programSelections: [
    { id: 'seed-mente', programId: 'mente-em-equilibrio', cycle: 6, quantity: 3 },
    { id: 'seed-sono', programId: 'sono-e-energia', cycle: 6, quantity: 2 },
  ] satisfies ProgramSelection[],
} as const;

/**
 * Estado inicial da rota. `revenda` devolve exatamente o que
 * `initialProposalState` sempre devolveu (com o canal por cima) — é o que
 * mantém `reducer.test.ts` verde sem tocar num caso.
 */
export function createInitialProposalState(
  opts: { clientType?: ClientType; mode?: ProposalMode } = {},
): ProposalState {
  const clientType = opts.clientType ?? initialProposalState.clientType;

  if (opts.mode !== 'beneficio') {
    return { ...initialProposalState, clientType };
  }

  return {
    ...initialProposalState,
    mode: 'beneficio',
    clientType,
    // A empresa não revende: o preço dela é o repasse, sem margem nenhuma.
    margins: { consulta: EMPRESA_MARGIN, programa: EMPRESA_MARGIN },
    consultationLines: BENEFIT_SEED.consultationLines.map((line) => ({ ...line })),
    programSelections: BENEFIT_SEED.programSelections.map((item) => ({ ...item })),
    implantation: implantationFor(BENEFIT_DEFAULTS.serviceModel),
    benefit: { ...BENEFIT_DEFAULTS, roi: { ...BENEFIT_DEFAULTS.roi } },
  };
}

/**
 * No modelo remoto não há ponto físico a montar: a implantação é isenta por
 * DEFINIÇÃO, não por negociação. Fica no reducer (e não na view) para que o
 * painel, o passo de custos e o PDF nunca discordem do toggle.
 */
const implantationFor = (serviceModel: ServiceModel): Implantation =>
  serviceModel === 'remoto' ? { mode: 'isento' } : { mode: 'a_combinar' };

const clampQuantity = (value: number) => Math.max(1, Math.floor(value));
const clampNonNegative = (value: number) => Math.max(0, value);
/** Recebe a margem em % (1–90) e devolve a fração travada em [0.01, 0.90]. */
const clampMargin = (percent: number) =>
  Math.min(MARGIN_MAX, Math.max(MARGIN_MIN, (Number.isFinite(percent) ? percent : 0) / 100));

export function proposalReducer(state: ProposalState, action: ProposalAction): ProposalState {
  switch (action.type) {
    case 'SET_CLIENT_TYPE':
      return { ...state, clientType: action.clientType };
    case 'SET_CONSULTA_MARGIN':
      return { ...state, margins: { ...state.margins, consulta: clampMargin(action.value) } };
    case 'SET_PROGRAMA_MARGIN':
      return { ...state, margins: { ...state.margins, programa: clampMargin(action.value) } };
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
    case 'SET_SELLER':
      return { ...state, seller: { ...state.seller, ...action.patch } };
    case 'SET_SERVICE_MODEL':
      return {
        ...state,
        benefit: { ...state.benefit, serviceModel: action.value },
        implantation: implantationFor(action.value),
      };
    case 'SET_HEADCOUNT':
      return { ...state, benefit: { ...state.benefit, headcount: clampCount(action.value) } };
    case 'SET_ADHESION':
      return {
        ...state,
        benefit: { ...state.benefit, adhesionPercent: clampPercent(action.value, 100) },
      };
    case 'SET_FUNDING':
      return {
        ...state,
        benefit: {
          ...state.benefit,
          funding:
            action.funding.mode === 'coparticipacao'
              ? {
                  mode: 'coparticipacao',
                  employeePercent: clampPercent(action.funding.employeePercent, 100),
                }
              : action.funding,
        },
      };
    case 'SET_RETURN_ASSUMPTION':
      return {
        ...state,
        benefit: {
          ...state.benefit,
          roi: {
            ...state.benefit.roi,
            [action.key]:
              action.key === 'absenceReductionPercent' || action.key === 'payrollChargesPercent'
                ? clampPercent(action.value, action.key === 'payrollChargesPercent' ? 500 : 100)
                : clampMoney(action.value),
          },
        },
      };
    default:
      return state;
  }
}
