export type ProposalType = 
  | 'agenda-on-demand'
  | 'agenda-dedicada'
  | 'pacotes-atendimento'

export type ConsultDuration = 25 | 30 | 40

export interface PricingParams {
  proposalType: ProposalType
  patientsPerMonth: number
  consultDuration?: ConsultDuration
}

export interface PricingResult {
  unitPrice: number
  totalMonthly: number
  description: string
  includes: string[]
}

// Tabela de preços base por tipo de proposta e duração
const PRICING_TABLE = {
  'agenda-on-demand': {
    25: 95,
    30: 110,
    40: 140,
  },
  'agenda-dedicada': {
    25: 75,
    30: 85,
    40: 110,
  },
}

// Preço fixo para pacotes de atendimento
const PACOTE_PRICE = 450

export function calculatePricing(params: PricingParams): PricingResult {
  const { proposalType, patientsPerMonth, consultDuration = 30 } = params

  if (proposalType === 'pacotes-atendimento') {
    return {
      unitPrice: PACOTE_PRICE,
      totalMonthly: PACOTE_PRICE * patientsPerMonth,
      description: 'Pacote completo de atendimento multidisciplinar',
      includes: [
        'Múltiplas especialidades incluídas',
        'Acompanhamento integrado do paciente',
        'Relatórios unificados',
        'Gestão centralizada',
      ],
    }
  }

  const priceTable = PRICING_TABLE[proposalType]
  const unitPrice = priceTable[consultDuration]

  const descriptions: Record<ProposalType, string> = {
    'agenda-on-demand': 'Profissionais sob demanda para sua clínica',
    'agenda-dedicada': 'Especialista exclusivo dedicado à sua clínica',
    'pacotes-atendimento': 'Pacote completo multidisciplinar',
  }

  const includesMap: Record<ProposalType, string[]> = {
    'agenda-on-demand': [
      'Profissionais qualificados e certificados',
      'Disponibilidade imediata',
      'Flexibilidade de horários',
      'Sem compromisso de longo prazo',
    ],
    'agenda-dedicada': [
      'Especialista exclusivo para sua clínica',
      'Mesmo profissional em todas as consultas',
      'Agenda personalizada',
      'Pacotes por especialidade',
    ],
    'pacotes-atendimento': [],
  }

  // Desconto por volume
  let discount = 0
  if (patientsPerMonth >= 50) {
    discount = 0.15 // 15% de desconto
  } else if (patientsPerMonth >= 30) {
    discount = 0.10 // 10% de desconto
  } else if (patientsPerMonth >= 15) {
    discount = 0.05 // 5% de desconto
  }

  const discountedPrice = unitPrice * (1 - discount)
  const totalMonthly = discountedPrice * patientsPerMonth

  return {
    unitPrice: discountedPrice,
    totalMonthly,
    description: descriptions[proposalType],
    includes: includesMap[proposalType],
  }
}

export const PROPOSAL_OPTIONS = [
  {
    id: 'agenda-on-demand' as ProposalType,
    name: 'Agenda On Demand',
    description: 'Profissionais sob demanda para atender picos ou substituições',
    icon: 'CalendarClock',
  },
  {
    id: 'agenda-dedicada' as ProposalType,
    name: 'Agenda Dedicada',
    description: 'Tenha um especialista exclusivo dedicado à sua clínica',
    icon: 'CalendarSync',
  },
  {
    id: 'pacotes-atendimento' as ProposalType,
    name: 'Pacotes de Atendimento',
    description: 'Pacotes personalizados com múltiplas especialidades',
    icon: 'Package',
  },
]

export const DURATION_OPTIONS: { value: ConsultDuration; label: string }[] = [
  { value: 25, label: '25 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 40, label: '40 minutos' },
]
