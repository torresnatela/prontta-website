'use client';

import { brl, currencyDigits, percent } from './format';
import { useRollingNumber } from './useRollingNumber';

interface RollingCurrencyProps {
  value: number;
  className?: string;
  /** Sufixo estático, ex.: "/mês". */
  suffix?: string;
  /** Anuncia o valor final para leitores de tela (padrão: sim). */
  announce?: boolean;
}

/**
 * Valor em reais com efeito roleta.
 *
 * É de propósito uma FOLHA: içar o valor animado para o painel faria o painel
 * inteiro re-renderizar a 60fps. As casas decimais vêm do valor estável (prop),
 * não do frame, senão a largura do texto pisca durante a animação.
 */
export function RollingCurrency({
  value,
  className,
  suffix = '',
  announce = true,
}: RollingCurrencyProps) {
  const { value: display, rolling } = useRollingNumber(value);
  const digits = currencyDigits(value);
  const settled = `${brl(value, digits)}${suffix}`;

  return (
    <>
      <span
        className={['roleta', rolling ? 'rolling' : '', className].filter(Boolean).join(' ')}
        aria-hidden={announce ? 'true' : undefined}
      >
        {brl(display, digits)}
        {suffix}
      </span>
      {announce ? (
        <span className="sr-only" aria-live="polite">
          {settled}
        </span>
      ) : null}
    </>
  );
}

interface RollingPercentProps {
  value: number;
  className?: string;
}

export function RollingPercent({ value, className }: RollingPercentProps) {
  const { value: display, rolling } = useRollingNumber(value);
  return (
    <>
      <span
        className={['roleta', rolling ? 'rolling' : '', className].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {percent(display)}
      </span>
      <span className="sr-only" aria-live="polite">
        {percent(value)}
      </span>
    </>
  );
}
