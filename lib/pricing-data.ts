// ============================================
// Constantes de Precos e Especialidades
// ============================================

import type { SpecialtyPricing, CategoryInfo, InfrastructureOption } from './calculator-types'

// ---- Categorias de Atendimento ----

export const CATEGORIES: Record<string, CategoryInfo> = {
  popular: {
    label: 'Popular',
    description: 'Maior volume de atendimentos com tempo reduzido por consulta.',
    avgMinutes: 24,
    consultsPerHour: 2.5,
  },
  intermediaria: {
    label: 'Intermediária',
    description: 'Equilíbrio entre volume de atendimentos e tempo de consulta.',
    avgMinutes: 30,
    consultsPerHour: 2,
  },
  alto_padrao: {
    label: 'Alto Padrão',
    description: 'Atendimento premium com mais tempo por consulta e menor volume.',
    avgMinutes: 60,
    consultsPerHour: 1,
  },
}

// ---- Agenda Compartilhada - Precos por Consulta ----

export const SHARED_AGENDA_PRICES: Record<string, number> = {
  'Cardiologia': 90,
  'Endocrinologia': 90,
  'Dermatologia': 90,
  'Gastroenterologia': 90,
  'Nutricionista': 65,
  'Ortopedia': 90,
  'Ginecologia': 90,
  'Nutrologia': 110,
  'Psicologia Adulto': 55,
  'Psiquiatria Adulto': 90,
  'Neurologista Adulto': 110,
}

// ---- Agenda Dedicada - Precos por Especialidade e Categoria ----

function createSpecialtyPricing(
  popConsPerHour: number, popPrice: number,
  intConsPerHour: number, intPrice: number,
  premConsPerHour: number, premPrice: number
): SpecialtyPricing {
  return {
    popular: { consultsPerHour: popConsPerHour, pricePerConsultation: popPrice },
    intermediaria: { consultsPerHour: intConsPerHour, pricePerConsultation: intPrice },
    alto_padrao: { consultsPerHour: premConsPerHour, pricePerConsultation: premPrice },
  }
}

export const DEDICATED_SPECIALTIES: Record<string, SpecialtyPricing> = {
  'Médico Generalista': createSpecialtyPricing(2.40, 60.00, 2.00, 75.00, 1.50, 100.00),
  'Cardiologista': createSpecialtyPricing(2.40, 103.00, 2.00, 130.00, 1.50, 170.00),
  'Dermatologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Endocrinologia': createSpecialtyPricing(2.50, 89.90, 2.00, 130.00, 1.00, 218.18),
  'Fonoaudiologia': createSpecialtyPricing(1.33, 82.02, 2.00, 54.55, 1.00, 109.09),
  'Gastroenterologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Geriatria': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Ginecologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Hematologia': createSpecialtyPricing(2.50, 109.09, 2.00, 136.36, 1.00, 272.73),
  'Infectologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Medicina da Família': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Nefrologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Neurologia': createSpecialtyPricing(2.50, 109.09, 2.00, 136.36, 1.00, 272.73),
  'Neuropediatria': createSpecialtyPricing(2.50, 180.00, 2.00, 227.27, 1.00, 454.55),
  'Nutricionista': createSpecialtyPricing(1.33, 45.00, 2.00, 60.00, 1.00, 90.00),
  'Nutrólogo': createSpecialtyPricing(2.00, 100.00, 2.00, 130.00, 1.00, 180.00),
  'Oftalmologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Ortopedia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Otorrinolaringologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Pediatria': createSpecialtyPricing(2.50, 109.09, 2.00, 136.36, 1.00, 272.73),
  'Pneumologia': createSpecialtyPricing(2.50, 109.09, 2.00, 136.36, 1.00, 272.73),
  'Psicólogo': createSpecialtyPricing(1.50, 45.00, 1.50, 60.00, 1.00, 90.00),
  'Psiquiatria': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
  'Reumatologia': createSpecialtyPricing(2.50, 109.09, 2.00, 136.36, 1.00, 272.73),
  'Urologia': createSpecialtyPricing(2.50, 89.90, 2.00, 109.09, 1.00, 218.18),
}

// ---- Infraestrutura ----

export const INFRASTRUCTURE_OPTIONS: Record<InfrastructureOption, {
  label: string
  description: string
  purchasePrice: number
  monthlyRent: number
}> = {
  propria: {
    label: 'Infraestrutura Própria',
    description: 'Monte sua própria sala de atendimento com seus equipamentos. Sem custo adicional de infraestrutura.',
    purchasePrice: 0,
    monthlyRent: 0,
  },
  totem: {
    label: 'Totem de Autoatendimento',
    description: 'Totem de autoatendimento com telemedicina integrada. Solução prática e compacta para sua operação.',
    purchasePrice: 46000,
    monthlyRent: 3600,
  },
  cabine: {
    label: 'Cabine Completa',
    description: 'Cabine completa com isolamento acústico, equipamentos integrados e interface premium para o paciente.',
    purchasePrice: 100000,
    monthlyRent: 10000,
  },
}

// ---- Software ----

export const SOFTWARE_MONTHLY_COST = 1490
export const SOFTWARE_FREE_THRESHOLD = 150

// ---- Encargos CLT ----

export const CLT_OVERHEAD_PERCENTAGE = 0.70

// ---- Horas por Plantao ----

export const HOURS_PER_SHIFT = 4

// ---- Categorias de Despesas Fixas ----

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Aluguel do Espaço',
  'Energia Elétrica',
  'Internet/Telefone',
  'Material de Escritório',
  'Marketing/Publicidade',
  'Manutenção',
  'Outros',
]

// ---- Imposto padrao sugerido ----

export const DEFAULT_TAX_PERCENTAGE = 8.65
