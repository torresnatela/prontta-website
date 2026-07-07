import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Com globals desabilitados no Vitest, o auto-cleanup do Testing Library não
// é registrado — sem isto o DOM acumula entre os testes de um mesmo arquivo.
afterEach(() => {
  cleanup();
});
