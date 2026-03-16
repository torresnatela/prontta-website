// ============================================
// Constantes de Precos e Especialidades
// ============================================

import type {
  SpecialtyPricing,
  CategoryInfo,
  InfrastructureOption,
} from "./calculator-types";

// ---- Categorias de Atendimento ----

export const CATEGORIES: Record<string, CategoryInfo> = {
  popular: {
    label: "Popular",
    description:
      "Maior volume de atendimentos com tempo reduzido por consulta.",
    avgMinutes: 24,
    consultsPerHour: 2.5,
  },
  intermediaria: {
    label: "Intermediária",
    description: "Equilíbrio entre volume de atendimentos e tempo de consulta.",
    avgMinutes: 30,
    consultsPerHour: 2,
  },
  alto_padrao: {
    label: "Alto Padrão",
    description:
      "Atendimento premium com mais tempo por consulta e menor volume.",
    avgMinutes: 60,
    consultsPerHour: 1,
  },
};

// ---- Agenda Compartilhada - Precos por Consulta ----
// Os preços são os mesmos da categoria Intermediária da Agenda Dedicada:
// consultas avulsas na compartilhada equivalem a comprar no modelo intermediário.

export const SHARED_AGENDA_PRICES: Record<string, number> = {
  Cardiologia: 110,
  Endocrinologia: 110,
  Dermatologia: 110,
  Gastroenterologia: 109.09,
  Nutricionista: 55,
  Ortopedia: 110,
  Ginecologia: 110,
  Nutrologia: 140,
  "Psicologia Adulto": 60,
  "Psiquiatria Adulto": 109.09,
  "Neurologista Adulto": 140,
};

// ---- Agenda Dedicada - Precos por Especialidade e Categoria ----

function createSpecialtyPricing(
  popConsPerHour: number,
  popPrice: number,
  intConsPerHour: number,
  intPrice: number,
  premConsPerHour: number,
  premPrice: number,
): SpecialtyPricing {
  return {
    popular: {
      consultsPerHour: popConsPerHour,
      pricePerConsultation: popPrice,
    },
    intermediaria: {
      consultsPerHour: intConsPerHour,
      pricePerConsultation: intPrice,
    },
    alto_padrao: {
      consultsPerHour: premConsPerHour,
      pricePerConsultation: premPrice,
    },
  };
}

export const DEDICATED_SPECIALTIES: Record<string, SpecialtyPricing> = {
  "Médico Generalista": createSpecialtyPricing(
    2.5,
    60.0,
    2.0,
    75.0,
    1.5,
    100.0,
  ),
  Cardiologista: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.5, 220.0),
  Dermatologia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Endocrinologia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Fonoaudiologia: createSpecialtyPricing(2, 55.0, 2.0, 83.0, 1.0, 109.09),
  Gastroenterologia: createSpecialtyPricing(
    2.5,
    90.0,
    2.0,
    109.09,
    1.0,
    218.18,
  ),
  Geriatria: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Ginecologia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Hematologia: createSpecialtyPricing(2.5, 110.0, 2.0, 140.0, 1.0, 272.73),
  Infectologia: createSpecialtyPricing(2.5, 110.0, 2.0, 110.0, 1.0, 220.0),
  "Medicina da Família": createSpecialtyPricing(
    2.5,
    90.0,
    2.0,
    110.0,
    1.0,
    218.18,
  ),
  Nefrologia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Neurologia: createSpecialtyPricing(2.5, 110.0, 2.0, 140.0, 1.0, 272.73),
  Neuropediatria: createSpecialtyPricing(2.5, 180.0, 2.0, 230.0, 1.0, 454.55),
  Nutricionista: createSpecialtyPricing(2.0, 40.0, 1.33, 55.0, 1.0, 90.0),
  Nutrólogo: createSpecialtyPricing(2.5, 110.0, 2.0, 140.0, 1.0, 220.0),
  Oftalmologia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Ortopedia: createSpecialtyPricing(2.5, 90.0, 2.0, 110.0, 1.0, 220.0),
  Otorrinolaringologia: createSpecialtyPricing(
    2.5,
    90.0,
    2.0,
    110.0,
    1.0,
    220.0,
  ),
  Pediatria: createSpecialtyPricing(2.5, 110.0, 2.0, 136.36, 1.0, 272.73),
  Pneumologia: createSpecialtyPricing(2.5, 110.0, 2.0, 136.36, 1.0, 272.73),
  Psicólogo: createSpecialtyPricing(2.0, 55.0, 1.33, 60.0, 1.0, 90.0),
  Psiquiatria: createSpecialtyPricing(2.5, 90.0, 2.0, 109.09, 1.0, 220.0),
  Reumatologia: createSpecialtyPricing(2.5, 110.0, 2.0, 136.36, 1.0, 272.73),
  Urologia: createSpecialtyPricing(2.5, 90.0, 2.0, 109.09, 1.0, 220.0),
};

// ---- Infraestrutura ----

export const INFRASTRUCTURE_OPTIONS: Record<
  InfrastructureOption,
  {
    label: string;
    description: string;
    purchasePrice: number;
    monthlyRent: number;
  }
> = {
  propria: {
    label: "Infraestrutura Própria",
    description:
      "Monte sua própria sala de atendimento com seus equipamentos. Sem custo adicional de infraestrutura.",
    purchasePrice: 0,
    monthlyRent: 0,
  },
  totem: {
    label: "Totem de Autoatendimento",
    description:
      "Totem de autoatendimento com telemedicina integrada. Solução prática e compacta para sua operação.",
    purchasePrice: 46000,
    monthlyRent: 3600,
  },
  cabine: {
    label: "Cabine Completa",
    description:
      "Cabine completa com isolamento acústico, equipamentos integrados e interface premium para o paciente.",
    purchasePrice: 100000,
    monthlyRent: 10000,
  },
};

// ---- Software ----

export const SOFTWARE_MONTHLY_COST = 1490;
export const SOFTWARE_FREE_THRESHOLD = 150;

// ---- Encargos CLT ----

export const CLT_OVERHEAD_PERCENTAGE = 0.7;

// ---- Horas por Plantao ----

export const HOURS_PER_SHIFT = 4;

// ---- Categorias de Despesas Fixas ----

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Aluguel do Espaço",
  "Energia Elétrica",
  "Internet/Telefone",
  "Material de Escritório",
  "Marketing/Publicidade",
  "Manutenção",
  "Outros",
];

// ---- Imposto padrao sugerido ----

export const DEFAULT_TAX_PERCENTAGE = 8.65;
