// ============================================
// Tipos TypeScript para a Calculadora de Propostas
// ============================================

export type ServiceCategory = 'popular' | 'intermediaria' | 'alto_padrao'

export interface CategoryInfo {
  label: string
  description: string
  avgMinutes: number
  consultsPerHour: number
}

export interface SpecialtyPricing {
  popular: { consultsPerHour: number; pricePerConsultation: number }
  intermediaria: { consultsPerHour: number; pricePerConsultation: number }
  alto_padrao: { consultsPerHour: number; pricePerConsultation: number }
}

// Pacote de agenda dedicada selecionado pelo usuario
export interface DedicatedPackage {
  id: string
  specialty: string
  category: ServiceCategory
  quantity: number // numero de pacotes (plantoes de 4h)
  consultsPerHour: number
  consultationsPerPackage: number // calculado: floor(consultsPerHour * 4)
  pricePerConsultation: number
  totalConsultations: number // quantity * consultationsPerPackage
  totalCost: number // totalConsultations * pricePerConsultation
}

// Consulta avulsa da agenda compartilhada
export interface SharedConsultation {
  id: string
  specialty: string
  quantity: number
  pricePerConsultation: number
  totalCost: number
}

// Categoria do cliente (determina o fluxo do wizard)
export type ClientCategory = 'estabelecimento' | 'empresa'

// Especialidade dentro de um pacote de empresa (sempre intermediaria)
export interface EmployeePackageItem {
  id: string
  specialty: string
  quantityPerEmployee: number // consultas/mes por colaborador
  pricePerConsultation: number // preco intermediario da specialty
  costPerEmployee: number // quantityPerEmployee * pricePerConsultation
}

// Pacote nomeado que sera distribuido por colaborador
export interface EmployeePackage {
  id: string
  name: string // ex: "Pacote Saude Mental"
  items: EmployeePackageItem[]
  costPerEmployee: number // soma dos items.costPerEmployee
}

export type InfrastructureOption = 'propria' | 'totem' | 'cabine'
export type PaymentMode = 'compra' | 'aluguel'

export interface InfrastructureSelection {
  option: InfrastructureOption
  paymentMode: PaymentMode
  monthlyCost: number
  oneTimeCost: number
}

export interface Employee {
  id: string
  cargo: string
  salarioBase: number
  custoTotal: number
}

export interface FixedExpense {
  id: string
  categoria: string
  valor: number
}

// Preco de venda por especialidade para o simulador
export interface SellingPrice {
  specialty: string
  category?: ServiceCategory // undefined para agenda compartilhada
  source: 'dedicada' | 'compartilhada'
  costPerConsultation: number
  sellingPrice: number
  margin: number // percentual de margem
}

// Estado completo da proposta
export interface ProposalState {
  currentStep: number

  // Step 1 - Categoria do Cliente
  clientCategory: ClientCategory | null

  // Step 2 - Modelos de Atendimento (estabelecimento)
  useSharedAgenda: boolean
  useDedicatedAgenda: boolean
  dedicatedPackages: DedicatedPackage[]

  // Empresa only - Step 2 (Pacotes por Colaborador)
  employeePackages: EmployeePackage[]
  numberOfEmployees: number

  // Step 3 - Infraestrutura
  infrastructure: InfrastructureSelection

  // Step 4 - Implantacao e Software
  implantationNote: string

  // Step 5 - Proposta Final
  sharedConsultations: SharedConsultation[]

  // Step 6 - Rentabilidade
  sellingPrices: SellingPrice[]
  taxPercentage: number
  employees: Employee[]
  fixedExpenses: FixedExpense[]
}

// Resultado da DRE
export interface DREResult {
  // Receita
  receitaDedicada: number
  receitaCompartilhada: number
  receitaBruta: number

  // Impostos
  impostos: number
  receitaLiquida: number

  // Custos
  custoDedicada: number
  custoCompartilhada: number
  custoSoftware: number
  custoInfraestrutura: number
  totalCustos: number

  // Lucro Bruto
  lucroBruto: number
  margemBruta: number

  // Despesas
  custoFuncionarios: number
  despesasFixas: number
  totalDespesas: number

  // Resultado
  resultadoOperacional: number
  margemOperacional: number
}
