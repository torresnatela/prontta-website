'use client';

import { cn } from '@/lib/utils';
import { brl, currencyDigits, percent } from './format';
import { useRollingNumber } from './useRollingNumber';

interface RollingCurrencyProps {
  value: number;
  className?: string;
  /** Sufixo estático, ex.: "/mês". */
  suffix?: string;
}

/**
 * Valor em reais com efeito roleta.
 *
 * É de propósito uma FOLHA: içar o valor animado para o painel faria o painel
 * inteiro re-renderizar a 60fps. As casas decimais vêm do valor estável (prop),
 * não do frame, senão a largura do texto pisca durante a animação.
 */
export function RollingCurrency({ value, className, suffix = '' }: RollingCurrencyProps) {
  const { value: display, rolling } = useRollingNumber(value);
  const digits = currencyDigits(value);

  return (
    <>
      <span className={cn('roleta', rolling && 'rolling', className)} aria-hidden="true">
        {brl(display, digits)}
        {suffix}
      </span>
      {/* Só o valor assentado vai para o leitor de tela — anunciar cada frame
          seria spam a 60fps. */}
      <span className="sr-only" aria-live="polite">
        {`${brl(value, digits)}${suffix}`}
      </span>
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
      <span className={cn('roleta', rolling && 'rolling', className)} aria-hidden="true">
        {percent(display)}
      </span>
      <span className="sr-only" aria-live="polite">
        {percent(value)}
      </span>
    </>
  );
}
