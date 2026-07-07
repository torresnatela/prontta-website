'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionShellProps {
  id?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  tone?: 'white' | 'muted' | 'navy';
  children: ReactNode;
}

/** Casca padrão das seções da proposta: espaçamento, container e cabeçalho. */
export function SectionShell({ id, kicker, title, subtitle, tone = 'white', children }: SectionShellProps) {
  const tones = {
    white: 'bg-white',
    muted: 'bg-accent-light/40',
    navy: 'bg-primary-navy text-white',
  };
  return (
    <section id={id} className={cn('section-padding', tones[tone])}>
      <div className="container-custom">
        <div className="max-w-3xl mb-10 md:mb-14">
          {kicker && (
            <p
              className={cn(
                'text-sm font-semibold uppercase tracking-widest mb-3',
                tone === 'navy' ? 'text-primary-cyan' : 'text-primary-cyan',
              )}
            >
              {kicker}
            </p>
          )}
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl font-bold',
              tone === 'navy' ? 'text-white' : 'text-primary-navy',
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={cn('mt-4 text-lg', tone === 'navy' ? 'text-white/80' : 'text-neutral-gray')}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
