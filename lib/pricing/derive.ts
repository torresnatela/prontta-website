// ============================================
// Derivacao das visoes legacy a partir do catalogo
// (mantem compat com DEDICATED_SPECIALTIES e SHARED_AGENDA_PRICES)
// ============================================

import type { SpecialtyPricing } from "../calculator-types";
import { SPECIALTIES } from "./specialties";

export function buildDedicatedSpecialties(): Record<string, SpecialtyPricing> {
  const out: Record<string, SpecialtyPricing> = {};
  for (const s of SPECIALTIES) {
    if (!s.availability.dedicatedAgenda) continue;
    out[s.legacyDedicatedKey] = s.pricing;
  }
  return out;
}

export function buildSharedAgendaPrices(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of SPECIALTIES) {
    if (!s.availability.sharedAgenda || !s.legacySharedKey) continue;
    out[s.legacySharedKey] = s.pricing.popular.pricePerConsultation;
  }
  return out;
}
