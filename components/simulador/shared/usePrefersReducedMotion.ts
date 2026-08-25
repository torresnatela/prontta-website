'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function supported(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function subscribe(onChange: () => void): () => void {
  if (!supported()) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  // Sem matchMedia (jsdom, ambientes antigos) assumimos "reduzir" — o caminho
  // sem animação é sempre o seguro.
  if (!supported()) return true;
  return window.matchMedia(QUERY).matches;
}

/**
 * `getServerSnapshot` devolve `true` de propósito: o HTML do SSR já sai no valor
 * final, então a hidratação nunca tenta animar (e nunca dá mismatch).
 */
function getServerSnapshot(): boolean {
  return true;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
