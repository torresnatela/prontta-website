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
  /** Preço oficial V8 ao paciente por ciclo (dado, não fórmula). */
  priceByCycle: Record<Cycle, number>;
  /** Composição de consultas por ciclo (especialidade × quantidade). */
  compositionByCycle: Record<Cycle, Array<{ specialtyId: string; quantity: number }>>;
}

export interface ConsultationLine {
  id: string;
  specialtyId: string;
  agenda: AgendaType;
  quantity: number;
  cycleMonths: number;
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
