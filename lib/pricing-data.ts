// ============================================
// Fachada — re-exporta o novo modelo de pricing/
// no formato esperado pelos consumidores existentes.
//
// O catalogo unico de especialidades vive em `lib/pricing/specialties.ts`.
// As visoes legacy (DEDICATED_SPECIALTIES, SHARED_AGENDA_PRICES) sao
// derivadas do catalogo, garantindo que a Agenda Compartilhada tenha
// sempre o mesmo preco do tier Popular.
// ============================================

import {
  buildDedicatedSpecialties,
  buildSharedAgendaPrices,
} from "./pricing/derive";

export { CATEGORIES } from "./pricing/service-tiers";
export { INFRASTRUCTURE_OPTIONS } from "./pricing/infrastructure";
export {
  SOFTWARE_MONTHLY_COST,
  SOFTWARE_FREE_THRESHOLD,
  CLT_OVERHEAD_PERCENTAGE,
  HOURS_PER_SHIFT,
  DEFAULT_TAX_PERCENTAGE,
  DEFAULT_EXPENSE_CATEGORIES,
} from "./pricing/business-rules";

export const DEDICATED_SPECIALTIES = buildDedicatedSpecialties();
export const SHARED_AGENDA_PRICES = buildSharedAgendaPrices();
