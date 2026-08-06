/**
 * Formatadores das páginas /academias.
 *
 * Os `Intl.NumberFormat` são criados UMA vez no módulo: `formatCurrency` de
 * lib/utils.ts instancia um formatter por chamada, o que a 60fps × ~12 valores
 * animados viraria ~720 alocações por segundo.
 */

const BRL_INTEIRO = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const BRL_CENTAVOS = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Decide o número de casas a partir do valor ESTÁVEL (nunca do frame animado),
 * senão a largura do texto pisca durante a roleta.
 */
export function currencyDigits(value: number): 0 | 2 {
  // Arredonda antes de decidir: 24 × 138,3333… dá 3320.0000000000005, que não é
  // "inteiro" para o JS e imprimiria "R$ 3.320,00" no lugar de "R$ 3.320".
  return Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2;
}

export function brl(value: number, digits: 0 | 2 = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  return digits === 0 ? BRL_INTEIRO.format(safe) : BRL_CENTAVOS.format(safe);
}

/** Formata o valor escolhendo as casas pelo próprio número. */
export function brlAuto(value: number): string {
  return brl(value, currencyDigits(value));
}

export function percent(value: number, digits = 1): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(digits).replace('.', ',')}%`;
}

export function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}
