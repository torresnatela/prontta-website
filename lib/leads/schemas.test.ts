import { describe, expect, it } from 'vitest';
import { gateLeadSchema } from './schemas';

const valid = {
  name: 'Maria Silva',
  phone: '(31) 99999-0000',
  cnpj: '11.222.333/0001-81',
  segment: 'clinicas',
  consent: true,
};

describe('gateLeadSchema', () => {
  it('normaliza telefone e CNPJ para dígitos', () => {
    const parsed = gateLeadSchema.parse(valid);
    expect(parsed.phone).toBe('31999990000');
    expect(parsed.cnpj).toBe('11222333000181');
  });

  it('aceita CNPJ em branco', () => {
    expect(gateLeadSchema.parse({ ...valid, cnpj: '' }).cnpj).toBeUndefined();
    expect(gateLeadSchema.parse({ ...valid, cnpj: undefined }).cnpj).toBeUndefined();
  });

  it('rejeita CNPJ inválido, telefone curto, segmento desconhecido e falta de consentimento', () => {
    expect(gateLeadSchema.safeParse({ ...valid, cnpj: '11.111.111/1111-11' }).success).toBe(false);
    expect(gateLeadSchema.safeParse({ ...valid, phone: '9999' }).success).toBe(false);
    expect(gateLeadSchema.safeParse({ ...valid, segment: 'hospital' }).success).toBe(false);
    expect(gateLeadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});
