import { describe, expect, it } from 'vitest';
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('faz hash e verifica corretamente', async () => {
    const hash = await hashPassword('minha-senha-123');
    expect(hash).not.toBe('minha-senha-123');
    expect(await verifyPassword('minha-senha-123', hash)).toBe(true);
    expect(await verifyPassword('senha-errada', hash)).toBe(false);
  });

  it('DUMMY_PASSWORD_HASH é um bcrypt válido (anti-timing)', async () => {
    expect(DUMMY_PASSWORD_HASH).toMatch(/^\$2[aby]\$/);
    expect(await verifyPassword('qualquer-coisa', DUMMY_PASSWORD_HASH)).toBe(false);
  });
});
