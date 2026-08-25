import { describe, expect, it } from 'vitest';
import { formatCnpj, isValidCnpj, onlyDigits } from './cnpj';

describe('cnpj', () => {
  it('valida CNPJ correto (formatado ou não)', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11222333000181')).toBe(true);
  });

  it('rejeita dígitos verificadores errados', () => {
    expect(isValidCnpj('11.222.333/0001-80')).toBe(false);
  });

  it('rejeita repetições e tamanhos inválidos', () => {
    expect(isValidCnpj('00000000000000')).toBe(false);
    expect(isValidCnpj('123')).toBe(false);
    expect(isValidCnpj('')).toBe(false);
  });

  it('onlyDigits remove tudo que não é número', () => {
    expect(onlyDigits('11.222.333/0001-81')).toBe('11222333000181');
  });

  it('formata 14 dígitos', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81');
  });
});
