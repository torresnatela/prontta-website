/**
 * Clamps compartilhados pelas camadas comerciais e pelos reducers da UI.
 *
 * Ficam aqui — e não dentro de um nicho — para existir uma definição só: campo
 * vazio vira NaN, e nada pode envenenar nem o estado nem o cálculo. Nasceram em
 * `lib/academias/pricing.ts`; foram promovidos quando `lib/empresa` passou a
 * precisar dos mesmos guardas (irmão importar de irmão seria pior).
 */

export const clampPercent = (value: number, max: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, value));
};

export const clampCount = (
  value: number,
  min = 0,
  max: number = Number.MAX_SAFE_INTEGER,
): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
};

export const clampMoney = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};
