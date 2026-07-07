import type { Cycle } from './types';

/**
 * Premissas do modelo de precificação 2.0.
 * Fonte: planilha oficial "Prontta_Simulador_Precos_DRE" (aba 1. Premissas).
 * Valores fixos e versionados — não são editáveis pelo visitante.
 */
export const PRICING_MODEL_VERSION = '2.0';

/** Divisor de formação do preço da consulta: 1 − margem 0,40 − infra 0,08 − imposto 0,15 */
export const PRICE_FORMATION_DIVISOR = 0.37;

/** Divisor estrutural aplicado ao custo para formar o preço ao paciente (uso interno). */
export const PARTNER_DIVISOR = 0.7;

/** Preços sempre arredondados para cima ao múltiplo de R$ 50. */
export const PRICE_STEP = 50;

/** Horas médicas por plantão na agenda dedicada. */
export const HOURS_PER_SHIFT = 4;

/** Software mensal na compra de consultas (programas nunca pagam). */
export const SOFTWARE_MONTHLY_FEE = 1499;

/** Consultas/mês a partir do qual o software mensal é isento. */
export const SOFTWARE_EXEMPTION_THRESHOLD = 150;

/** Fee de plataforma & IA embutido nos programas, por ciclo (informativo). */
export const PLATFORM_FEE_BY_CYCLE: Record<Cycle, number> = { 3: 100, 6: 250, 12: 400 };

/** Faixa de referência da taxa única de implantação. */
export const IMPLANTATION_RANGE = { min: 10_000, max: 15_000 };

/** Defaults editáveis da DRE do simulador. */
export const DRE_DEFAULTS = {
  proposalsPerMonth: 8,
  taxPercent: 6,
  expenses: {
    pessoal: 1500,
    aluguel: 800,
    fixas: 500,
    marketing: 600,
    outras: 0,
  },
} as const;
