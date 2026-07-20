import type { Cycle } from './types';

/**
 * Premissas do modelo de precificação 3.0.
 * Fonte: HTML oficial "Prontta_Landing_Prontta_Oficial_10" (mesmo racional da planilha oficial).
 * As margens são EDITÁVEIS pelo usuário; o restante é fixo e versionado.
 */
export const PRICING_MODEL_VERSION = '3.0';

/** Divisor de formação do custo da consulta: 1 − margem 0,40 − infra 0,08 − imposto 0,15 */
export const PRICE_FORMATION_DIVISOR = 0.37;

/** Preços sempre arredondados para cima ao múltiplo de R$ 50. */
export const PRICE_STEP = 50;

/** Horas médicas por plantão na agenda dedicada. */
export const HOURS_PER_SHIFT = 4;

/** Software mensal na compra de consultas (programas nunca pagam). */
export const SOFTWARE_MONTHLY_FEE = 1499;

/** Consultas/mês a partir do qual o software mensal é isento (gatilho na quantidade bruta). */
export const SOFTWARE_EXEMPTION_THRESHOLD = 150;

/** Fee de plataforma & IA por ciclo, SOMADO ao custo do programa antes da margem. */
export const PLATFORM_FEE_BY_CYCLE: Record<Cycle, number> = { 3: 100, 6: 250, 12: 400 };

/** Faixa de referência da taxa única de implantação. */
export const IMPLANTATION_RANGE = { min: 10_000, max: 15_000 };

/** Margem padrão do parceiro sobre o preço final das consultas (recomendado: 60%). */
export const DEFAULT_CONSULTA_MARGIN = 0.6;

/** Margem padrão do parceiro sobre o preço final dos Programas de Saúde (recomendado: 30%). */
export const DEFAULT_PROGRAMA_MARGIN = 0.3;

/** Limites das margens editáveis (1% a 90%). */
export const MARGIN_MIN = 0.01;
export const MARGIN_MAX = 0.9;

/** Defaults editáveis da DRE (P&L do parceiro). O mix montado já representa um mês. */
export const DRE_DEFAULTS = {
  taxPercent: 6,
  expenses: {
    pessoal: 1500,
    aluguel: 800,
    fixas: 500,
    marketing: 600,
    outras: 0,
  },
} as const;
