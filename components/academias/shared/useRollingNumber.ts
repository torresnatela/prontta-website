'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * O efeito "roleta" dos modelos comerciais: o número embaralha e assenta no
 * valor final. Duas fases — ruído decrescente em torno do alvo, depois
 * `easeOutCubic` até cravar exatamente o alvo.
 */

const MIN_DURATION_MS = 760;
const MAX_DURATION_MS = 1400;
/** Fatia da duração gasta embaralhando. */
const NOISE_FRACTION = 0.35;
/** Amplitude do ruído como fração do salto. */
const NOISE_AMPLITUDE = 0.6;
/** Abaixo disso não vale animar (evita roleta por causa de arredondamento). */
const MIN_DELTA = 0.005;

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export interface RollingNumber {
  value: number;
  rolling: boolean;
}

export function useRollingNumber(target: number): RollingNumber {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(target);
  const [rolling, setRolling] = useState(false);

  const rafRef = useRef<number | null>(null);
  const displayedRef = useRef(target);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const settle = () => {
      displayedRef.current = target;
      setValue(target);
      setRolling(false);
    };

    // A primeira renderização NUNCA anima: os frames de ruído são aleatórios e
    // dariam mismatch de hidratação em 100% dos casos.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      settle();
      return;
    }

    if (prefersReducedMotion || !Number.isFinite(target)) {
      settle();
      return;
    }

    const from = displayedRef.current;
    const delta = target - from;
    if (Math.abs(delta) < MIN_DELTA) {
      settle();
      return;
    }

    const magnitude = Math.min(1, Math.abs(delta) / Math.max(1, Math.abs(target)));
    const duration = MIN_DURATION_MS + magnitude * (MAX_DURATION_MS - MIN_DURATION_MS);
    const startedAt = performance.now();
    let settleFrom: number | null = null;

    setRolling(true);

    const frame = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);

      if (progress >= 1) {
        rafRef.current = null;
        settle();
        return;
      }

      let next: number;
      if (progress < NOISE_FRACTION) {
        const phase = progress / NOISE_FRACTION;
        const approach = from + delta * easeOutCubic(phase);
        const jitter = (Math.random() - 0.5) * Math.abs(delta) * NOISE_AMPLITUDE * (1 - phase);
        next = approach + jitter;
      } else {
        if (settleFrom === null) settleFrom = displayedRef.current;
        const phase = (progress - NOISE_FRACTION) / (1 - NOISE_FRACTION);
        next = settleFrom + (target - settleFrom) * easeOutCubic(phase);
      }

      displayedRef.current = next;
      setValue(next);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    // Cobre os dois caminhos de cancelamento: desmontar e trocar de alvo.
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, prefersReducedMotion]);

  return { value, rolling };
}
