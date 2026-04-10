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
  Cardiologia: 154,
  Endocrinologia: 154,
  Dermatologia: 154,
  Gastroenterologia: 152.73,
  Nutricionista: 77,
  Ortopedia: 154,
  Ginecologia: 154,
  Nutrologia: 196,
  "Psicologia Adulto": 84,
  "Psiquiatria Adulto": 152.73,
  "Neurologista Adulto": 196,
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
    84.0,
    2.0,
    105.0,
    1.5,
    140.0,
  ),
  Cardiologista: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.5, 308.0),
  Dermatologia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Endocrinologia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Fonoaudiologia: createSpecialtyPricing(2, 77.0, 2.0, 116.2, 1.0, 152.73),
  Gastroenterologia: createSpecialtyPricing(
    2.5,
    126.0,
    2.0,
    152.73,
    1.0,
    305.45,
  ),
  Geriatria: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Ginecologia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Hematologia: createSpecialtyPricing(2.5, 154.0, 2.0, 196.0, 1.0, 381.82),
  Infectologia: createSpecialtyPricing(2.5, 154.0, 2.0, 154.0, 1.0, 308.0),
  "Medicina da Família": createSpecialtyPricing(
    2.5,
    126.0,
    2.0,
    154.0,
    1.0,
    305.45,
  ),
  Nefrologia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Neurologia: createSpecialtyPricing(2.5, 154.0, 2.0, 196.0, 1.0, 381.82),
  Neuropediatria: createSpecialtyPricing(2.5, 252.0, 2.0, 322.0, 1.0, 636.37),
  Nutricionista: createSpecialtyPricing(2.0, 56.0, 1.33, 77.0, 1.0, 126.0),
  Nutrólogo: createSpecialtyPricing(2.5, 154.0, 2.0, 196.0, 1.0, 308.0),
  Oftalmologia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Ortopedia: createSpecialtyPricing(2.5, 126.0, 2.0, 154.0, 1.0, 308.0),
  Otorrinolaringologia: createSpecialtyPricing(
    2.5,
    126.0,
    2.0,
    154.0,
    1.0,
    308.0,
  ),
  Pediatria: createSpecialtyPricing(2.5, 154.0, 2.0, 190.9, 1.0, 381.82),
  Pneumologia: createSpecialtyPricing(2.5, 154.0, 2.0, 190.9, 1.0, 381.82),
  Psicólogo: createSpecialtyPricing(2.0, 77.0, 1.33, 84.0, 1.0, 126.0),
  Psiquiatria: createSpecialtyPricing(2.5, 126.0, 2.0, 152.73, 1.0, 308.0),
  Reumatologia: createSpecialtyPricing(2.5, 154.0, 2.0, 190.9, 1.0, 381.82),
  Urologia: createSpecialtyPricing(2.5, 126.0, 2.0, 152.73, 1.0, 308.0),
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
