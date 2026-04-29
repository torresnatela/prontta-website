// ============================================
// Re-exports do novo modelo de pricing
// ============================================

export type {
  SpecialtyId,
  ProfessionalType,
  Audience,
  ClientFocus,
  ClinicalArea,
  Specialty,
  Bundle,
  BundleItem,
} from "./types";

export { CATEGORIES } from "./service-tiers";
export {
  CLINICAL_AREAS,
  getClinicalArea,
} from "./clinical-areas";
export {
  SPECIALTIES,
  SPECIALTIES_BY_ID,
  getSpecialty,
  getSpecialtyByLegacyKey,
  getSpecialtiesByArea,
  getSpecialtiesForClient,
  validateSpecialtyCatalog,
} from "./specialties";
export {
  BUNDLES,
  getBundle,
  getBundlesForClient,
} from "./bundles";
export { INFRASTRUCTURE_OPTIONS } from "./infrastructure";
export {
  SOFTWARE_MONTHLY_COST,
  SOFTWARE_FREE_THRESHOLD,
  CLT_OVERHEAD_PERCENTAGE,
  HOURS_PER_SHIFT,
  DEFAULT_TAX_PERCENTAGE,
  DEFAULT_EXPENSE_CATEGORIES,
} from "./business-rules";
export {
  buildDedicatedSpecialties,
  buildSharedAgendaPrices,
} from "./derive";
