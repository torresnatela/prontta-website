export type ProposalType = 
  | 'retorno-implante'
  | 'acompanhamento-pos-op'
  | 'pre-operatorio'

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
  'retorno-implante': {
    25: 85,
    30: 95,
    40: 120,
  },
  'pre-operatorio': {
    25: 150,
    30: 170,
    40: 200,
  },
}

// Preço fixo para acompanhamento pós-operatório
const POS_OP_PACKAGE_PRICE = 610

export function calculatePricing(params: PricingParams): PricingResult {
  const { proposalType, patientsPerMonth, consultDuration = 30 } = params

  if (proposalType === 'acompanhamento-pos-op') {
    return {
      unitPrice: POS_OP_PACKAGE_PRICE,
      totalMonthly: POS_OP_PACKAGE_PRICE * patientsPerMonth,
      description: 'Pacote completo de acompanhamento pós-operatório',
      includes: [
        'Consulta com Psicólogo',
        'Consulta com Nutricionista',
        'Consulta com Endocrinologista',
        'Relatório integrado de acompanhamento',
      ],
    }
  }

  const priceTable = PRICING_TABLE[proposalType]
  const unitPrice = priceTable[consultDuration]

  const descriptions: Record<ProposalType, string> = {
    'retorno-implante': 'Terceirização de retorno de implante capilar',
    'acompanhamento-pos-op': 'Acompanhamento pós-operatório completo',
    'pre-operatorio': 'Análise cardiológica pré-operatória',
  }

  const includesMap: Record<ProposalType, string[]> = {
    'retorno-implante': [
      'Avaliação do resultado do implante',
      'Orientações de cuidados',
      'Relatório detalhado para a clínica',
      'Suporte ao paciente',
    ],
    'acompanhamento-pos-op': [],
    'pre-operatorio': [
      'Avaliação cardiológica completa',
      'Eletrocardiograma (ECG)',
      'Laudo de liberação cirúrgica',
      'Orientações pré-operatórias',
    ],
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
    id: 'retorno-implante' as ProposalType,
    name: 'Retorno Implante Capilar',
    description: 'Terceirização completa do retorno de pacientes de implante capilar',
    icon: 'UserCheck',
  },
  {
    id: 'acompanhamento-pos-op' as ProposalType,
    name: 'Acompanhamento Pós-Operatório',
    description: 'Pacote com Psicólogo, Nutricionista e Endocrinologista',
    icon: 'HeartPulse',
  },
  {
    id: 'pre-operatorio' as ProposalType,
    name: 'Pré-Operatório Cardiológico',
    description: 'Análise cardiológica para liberação cirúrgica',
    icon: 'Activity',
  },
]

export const DURATION_OPTIONS: { value: ConsultDuration; label: string }[] = [
  { value: 25, label: '25 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 40, label: '40 minutos' },
]

