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
  Cardiologia: 126.5,
  Endocrinologia: 126.5,
  Dermatologia: 126.5,
  Gastroenterologia: 125.45,
  Nutricionista: 63.25,
  Ortopedia: 126.5,
  Ginecologia: 126.5,
  Nutrologia: 161,
  "Psicologia Adulto": 69,
  "Psiquiatria Adulto": 125.45,
  "Neurologista Adulto": 161,
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
    69.0,
    2.0,
    86.25,
    1.5,
    115.0,
  ),
  Cardiologista: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.5, 253.0),
  Dermatologia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Endocrinologia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Fonoaudiologia: createSpecialtyPricing(2, 63.25, 2.0, 95.45, 1.0, 125.45),
  Gastroenterologia: createSpecialtyPricing(
    2.5,
    103.5,
    2.0,
    125.45,
    1.0,
    250.91,
  ),
  Geriatria: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Ginecologia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Hematologia: createSpecialtyPricing(2.5, 126.5, 2.0, 161.0, 1.0, 313.64),
  Infectologia: createSpecialtyPricing(2.5, 126.5, 2.0, 126.5, 1.0, 253.0),
  "Medicina da Família": createSpecialtyPricing(
    2.5,
    103.5,
    2.0,
    126.5,
    1.0,
    250.91,
  ),
  Nefrologia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Neurologia: createSpecialtyPricing(2.5, 126.5, 2.0, 161.0, 1.0, 313.64),
  Neuropediatria: createSpecialtyPricing(2.5, 207.0, 2.0, 264.5, 1.0, 522.73),
  Nutricionista: createSpecialtyPricing(2.0, 46.0, 1.33, 63.25, 1.0, 103.5),
  Nutrólogo: createSpecialtyPricing(2.5, 126.5, 2.0, 161.0, 1.0, 253.0),
  Oftalmologia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Ortopedia: createSpecialtyPricing(2.5, 103.5, 2.0, 126.5, 1.0, 253.0),
  Otorrinolaringologia: createSpecialtyPricing(
    2.5,
    103.5,
    2.0,
    126.5,
    1.0,
    253.0,
  ),
  Pediatria: createSpecialtyPricing(2.5, 126.5, 2.0, 156.81, 1.0, 313.64),
  Pneumologia: createSpecialtyPricing(2.5, 126.5, 2.0, 156.81, 1.0, 313.64),
  Psicólogo: createSpecialtyPricing(2.0, 63.25, 1.33, 69.0, 1.0, 103.5),
  Psiquiatria: createSpecialtyPricing(2.5, 103.5, 2.0, 125.45, 1.0, 253.0),
  Reumatologia: createSpecialtyPricing(2.5, 126.5, 2.0, 156.81, 1.0, 313.64),
  Urologia: createSpecialtyPricing(2.5, 103.5, 2.0, 125.45, 1.0, 253.0),
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
