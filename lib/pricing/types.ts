// ============================================
// Tipos do dominio de pricing/especialidades
// ============================================

import type {
  ServiceCategory,
  SpecialtyPricing,
} from "../calculator-types";

export type SpecialtyId =
  | "medico-generalista"
  | "medicina-da-familia"
  | "geriatria"
  | "cardiologia"
  | "dermatologia"
  | "endocrinologia"
  | "fonoaudiologia"
  | "gastroenterologia"
  | "ginecologia"
  | "hematologia"
  | "infectologia"
  | "nefrologia"
  | "neurologia-adulto"
  | "neuropediatria"
  | "nutricao"
  | "nutrologia"
  | "oftalmologia"
  | "ortopedia"
  | "otorrinolaringologia"
  | "pediatria"
  | "pneumologia"
  | "psicologia-adulto"
  | "psicologia-infantil"
  | "psiquiatria-adulto"
  | "psiquiatria-infantil"
  | "reumatologia"
  | "urologia";

export type ProfessionalType =
  | "medico"
  | "psicologo"
  | "nutricionista"
  | "fonoaudiologo";

export type Audience = "adulto" | "infantil" | "ambos";

export type ClientFocus = "empresa" | "estabelecimento";

export interface ClinicalArea {
  id: string;
  label: string;
  description: string;
  sortOrder: number;
}

export interface Specialty {
  id: SpecialtyId;
  displayName: string;
  legacyDedicatedKey: string;
  legacySharedKey?: string;
  professionalType: ProfessionalType;
  audience: Audience;
  clinicalAreaId: string;
  shortDescription: string;
  pricing: SpecialtyPricing;
  availability: {
    sharedAgenda: boolean;
    dedicatedAgenda: boolean;
  };
  recommendedFor: ClientFocus[];
  featured?: boolean;
  sortOrder?: number;
}

export interface BundleItem {
  specialtyId: SpecialtyId;
  defaultTier: ServiceCategory;
  defaultQuantity: number;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  recommendedFor: ClientFocus[];
  items: BundleItem[];
}
