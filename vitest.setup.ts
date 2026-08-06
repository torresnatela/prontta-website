import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom não implementa matchMedia — sem este stub, qualquer componente que leia
// prefers-reduced-motion quebra no teste. Default: sem preferência de redução.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Com globals desabilitados no Vitest, o auto-cleanup do Testing Library não
// é registrado — sem isto o DOM acumula entre os testes de um mesmo arquivo.
afterEach(() => {
  cleanup();
});
