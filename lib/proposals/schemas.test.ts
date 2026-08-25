import { describe, expect, it } from 'vitest';
import { companySchema } from './schemas';
import { createUserSchema, loginSchema } from '@/lib/auth/schemas';

describe('companySchema', () => {
  it('normaliza CNPJ para dígitos e aplica status default', () => {
    const r = companySchema.safeParse({ razaoSocial: 'Empresa X', cnpj: '11.222.333/0001-81' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.cnpj).toBe('11222333000181');
      expect(r.data.status).toBe('lead');
      expect(r.data.contatoNome).toBeUndefined();
    }
  });

  it('rejeita CNPJ inválido e razão social curta', () => {
    expect(companySchema.safeParse({ razaoSocial: 'X', cnpj: '123' }).success).toBe(false);
  });

  it('aceita e-mail vazio mas rejeita malformado', () => {
    expect(
      companySchema.safeParse({ razaoSocial: 'Empresa X', cnpj: '11222333000181', contatoEmail: '' })
        .success,
    ).toBe(true);
    expect(
      companySchema.safeParse({ razaoSocial: 'Empresa X', cnpj: '11222333000181', contatoEmail: 'nope' })
        .success,
    ).toBe(false);
  });
});

describe('auth schemas', () => {
  it('loginSchema exige e-mail válido', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalido', password: 'x' }).success).toBe(false);
  });

  it('createUserSchema exige senha com no mínimo 10 caracteres', () => {
    const base = { name: 'Ana', email: 'a@b.com', role: 'partner' as const };
    expect(createUserSchema.safeParse({ ...base, password: '123456789' }).success).toBe(false);
    expect(createUserSchema.safeParse({ ...base, password: '1234567890' }).success).toBe(true);
  });
});
