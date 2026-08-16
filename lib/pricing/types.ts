export type PlanId = 'popular' | 'intermediario' | 'premium';

export type Cycle = 3 | 6 | 12;

export type AgendaType = 'dedicada' | 'compartilhada';

export type ClientType = 'academia' | 'clinica' | 'farmacia' | 'laboratorio' | 'empresa';

export const CLIENT_TYPE_IDS: readonly ClientType[] = [
  'academia',
  'clinica',
  'farmacia',
  'laboratorio',
  'empresa',
] as const;

export interface Specialty {
  id: string;
  name: string;
  /** Valor-hora médico (R$) — base da formação de preço. */
  valorHora: number;
  /** Consultas por hora em cada plano. */
  consultsPerHour: Record<PlanId, number>;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  /** Canais prioritários de venda (academias, clínicas, farmácias…). */
  channels: string[];
  /**
   * Custo-base do programa por ciclo (dado oficial, coluna "Custo consultas" da
   * aba 4). O preço ao paciente é DERIVADO pelo engine:
   * ceil((custoBase + fee de plataforma) ÷ (1 − margem), 5). O fee cobre plataforma e IA.
   */
  costByCycle: Record<Cycle, number>;
  /**
   * Preço de tabela ao paciente por ciclo — coluna "Preço paciente V8" da aba 4.
   *
   * É o preço COMERCIAL oficial, arredondado para valores redondos de mensalidade
   * (Performance 6m = R$ 2.700 = 6 × R$ 450), e por isso fica acima do que a
   * margem de 30% renderia sozinha. Serve de referência sugerida; o preço que o
   * parceiro de fato cobra continua vindo da margem que ele escolhe.
   */
  patientPriceByCycle: Record<Cycle, number>;
  /** Composição de consultas por ciclo (especialidade × quantidade). */
  compositionByCycle: Record<Cycle, Array<{ specialtyId: string; quantity: number }>>;
}

export interface ConsultationLine {
  id: string;
  specialtyId: string;
  /** Plano escolhido POR LINHA (define consultas/hora e, portanto, o custo). */
  plan: PlanId;
  agenda: AgendaType;
  quantity: number;
}

export interface ProgramSelection {
  id: string;
  programId: string;
  cycle: Cycle;
  quantity: number;
}

export type Implantation =
  | { mode: 'a_combinar' }
  | { mode: 'isento' }
  | { mode: 'valor'; value: number };
