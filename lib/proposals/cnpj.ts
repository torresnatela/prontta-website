/** Remove tudo que não é dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Valida um CNPJ (14 dígitos + dígitos verificadores). */
export function isValidCnpj(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // rejeita 00000000000000 etc.

  const calcCheckDigit = (base: string): number => {
    let sum = 0;
    let factor = base.length - 7;
    for (let i = 0; i < base.length; i += 1) {
      sum += Number(base[i]) * factor;
      factor = factor === 2 ? 9 : factor - 1;
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcCheckDigit(cnpj.slice(0, 12));
  const d2 = calcCheckDigit(cnpj.slice(0, 12) + d1);
  return cnpj.endsWith(`${d1}${d2}`);
}

/** Formata 14 dígitos como 00.000.000/0000-00 (para exibição). */
export function formatCnpj(value: string): string {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14) return value;
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
