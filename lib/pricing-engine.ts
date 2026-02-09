// ============================================
// Funcoes de Calculo para a Calculadora
// ============================================

import type {
  DedicatedPackage,
  SharedConsultation,
  InfrastructureSelection,
  ProposalState,
  DREResult,
  ServiceCategory,
  SellingPrice,
  Employee,
} from './calculator-types'
import {
  DEDICATED_SPECIALTIES,
  HOURS_PER_SHIFT,
  SOFTWARE_MONTHLY_COST,
  SOFTWARE_FREE_THRESHOLD,
  CLT_OVERHEAD_PERCENTAGE,
} from './pricing-data'

// ---- Pacotes Dedicados ----

export function getConsultationsPerPackage(
  specialty: string,
  category: ServiceCategory
): number {
  const data = DEDICATED_SPECIALTIES[specialty]
  if (!data) return 0
  return Math.floor(data[category].consultsPerHour * HOURS_PER_SHIFT)
}

export function getPackagePrice(
  specialty: string,
  category: ServiceCategory
): number {
  const data = DEDICATED_SPECIALTIES[specialty]
  if (!data) return 0
  return data[category].pricePerConsultation
}

export function getConsultsPerHour(
  specialty: string,
  category: ServiceCategory
): number {
  const data = DEDICATED_SPECIALTIES[specialty]
  if (!data) return 0
  return data[category].consultsPerHour
}

export function calculatePackageTotalConsultations(pkg: DedicatedPackage): number {
  return pkg.quantity * pkg.consultationsPerPackage
}

export function calculatePackageTotalCost(pkg: DedicatedPackage): number {
  return pkg.totalConsultations * pkg.pricePerConsultation
}

export function calculateDedicatedPackagesCost(packages: DedicatedPackage[]): number {
  return packages.reduce((sum, pkg) => sum + pkg.totalCost, 0)
}

export function calculateDedicatedTotalConsultations(packages: DedicatedPackage[]): number {
  return packages.reduce((sum, pkg) => sum + pkg.totalConsultations, 0)
}

// ---- Consultas Compartilhadas ----

export function calculateSharedConsultationsCost(consultations: SharedConsultation[]): number {
  return consultations.reduce((sum, c) => sum + c.totalCost, 0)
}

export function calculateSharedTotalConsultations(consultations: SharedConsultation[]): number {
  return consultations.reduce((sum, c) => sum + c.quantity, 0)
}

// ---- Infraestrutura ----

export function calculateInfrastructureMonthlyCost(infra: InfrastructureSelection): number {
  return infra.monthlyCost
}

// ---- Software ----

export function calculateSoftwareCost(totalMonthlyConsultations: number): number {
  return totalMonthlyConsultations >= SOFTWARE_FREE_THRESHOLD ? 0 : SOFTWARE_MONTHLY_COST
}

// ---- Total de Consultas ----

export function calculateTotalMonthlyConsultations(state: ProposalState): number {
  const dedicated = calculateDedicatedTotalConsultations(state.dedicatedPackages)
  const shared = calculateSharedTotalConsultations(state.sharedConsultations)
  return dedicated + shared
}

// ---- Total Mensal ----

export function calculateTotalMonthlyCost(state: ProposalState): number {
  const dedicatedCost = calculateDedicatedPackagesCost(state.dedicatedPackages)
  const sharedCost = calculateSharedConsultationsCost(state.sharedConsultations)
  const infraCost = calculateInfrastructureMonthlyCost(state.infrastructure)
  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const softwareCost = calculateSoftwareCost(totalConsultations)

  return dedicatedCost + sharedCost + infraCost + softwareCost
}

// ---- Investimento Inicial ----

export function calculateOneTimeInvestment(state: ProposalState): number {
  return state.infrastructure.oneTimeCost
}

// ---- Funcionarios CLT ----

export function calculateEmployeeCost(salarioBase: number): number {
  return salarioBase * (1 + CLT_OVERHEAD_PERCENTAGE)
}

export function calculateTotalEmployeesCost(employees: Employee[]): number {
  return employees.reduce((sum, emp) => sum + emp.custoTotal, 0)
}

// ---- Sugestao de Preco de Venda (margem de 30%) ----

export function suggestSellingPrice(costPerConsultation: number, marginPercent: number = 0.30): number {
  return costPerConsultation / (1 - marginPercent)
}

// ---- Calculo de Margem ----

export function calculateMargin(sellingPrice: number, costPrice: number): number {
  if (sellingPrice === 0) return 0
  return ((sellingPrice - costPrice) / sellingPrice) * 100
}

// ---- DRE Completa ----

export function calculateProfitability(state: ProposalState): DREResult {
  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const softwareCost = calculateSoftwareCost(totalConsultations)

  // Receita Bruta
  let receitaDedicada = 0
  for (const pkg of state.dedicatedPackages) {
    const sp = state.sellingPrices.find(
      (s) => s.specialty === pkg.specialty && s.category === pkg.category && s.source === 'dedicada'
    )
    if (sp) {
      receitaDedicada += sp.sellingPrice * pkg.totalConsultations
    }
  }

  let receitaCompartilhada = 0
  for (const sc of state.sharedConsultations) {
    const sp = state.sellingPrices.find(
      (s) => s.specialty === sc.specialty && s.source === 'compartilhada'
    )
    if (sp) {
      receitaCompartilhada += sp.sellingPrice * sc.quantity
    }
  }

  const receitaBruta = receitaDedicada + receitaCompartilhada

  // Impostos
  const impostos = receitaBruta * (state.taxPercentage / 100)
  const receitaLiquida = receitaBruta - impostos

  // Custos
  const custoDedicada = calculateDedicatedPackagesCost(state.dedicatedPackages)
  const custoCompartilhada = calculateSharedConsultationsCost(state.sharedConsultations)
  const custoSoftware = softwareCost
  const custoInfraestrutura = state.infrastructure.monthlyCost
  const totalCustos = custoDedicada + custoCompartilhada + custoSoftware + custoInfraestrutura

  // Lucro Bruto
  const lucroBruto = receitaLiquida - totalCustos
  const margemBruta = receitaBruta > 0 ? (lucroBruto / receitaBruta) * 100 : 0

  // Despesas Operacionais
  const custoFuncionarios = calculateTotalEmployeesCost(state.employees)
  const despesasFixas = state.fixedExpenses.reduce((sum, e) => sum + e.valor, 0)
  const totalDespesas = custoFuncionarios + despesasFixas

  // Resultado Operacional
  const resultadoOperacional = lucroBruto - totalDespesas
  const margemOperacional = receitaBruta > 0 ? (resultadoOperacional / receitaBruta) * 100 : 0

  return {
    receitaDedicada,
    receitaCompartilhada,
    receitaBruta,
    impostos,
    receitaLiquida,
    custoDedicada,
    custoCompartilhada,
    custoSoftware,
    custoInfraestrutura,
    totalCustos,
    lucroBruto,
    margemBruta,
    custoFuncionarios,
    despesasFixas,
    totalDespesas,
    resultadoOperacional,
    margemOperacional,
  }
}

// ---- Gerar Selling Prices iniciais ----

export function generateInitialSellingPrices(state: ProposalState): SellingPrice[] {
  const prices: SellingPrice[] = []

  for (const pkg of state.dedicatedPackages) {
    const existing = prices.find(
      (p) => p.specialty === pkg.specialty && p.category === pkg.category && p.source === 'dedicada'
    )
    if (!existing) {
      const suggested = suggestSellingPrice(pkg.pricePerConsultation)
      prices.push({
        specialty: pkg.specialty,
        category: pkg.category,
        source: 'dedicada',
        costPerConsultation: pkg.pricePerConsultation,
        sellingPrice: Math.ceil(suggested),
        margin: calculateMargin(Math.ceil(suggested), pkg.pricePerConsultation),
      })
    }
  }

  for (const sc of state.sharedConsultations) {
    const existing = prices.find(
      (p) => p.specialty === sc.specialty && p.source === 'compartilhada'
    )
    if (!existing) {
      const suggested = suggestSellingPrice(sc.pricePerConsultation)
      prices.push({
        specialty: sc.specialty,
        source: 'compartilhada',
        costPerConsultation: sc.pricePerConsultation,
        sellingPrice: Math.ceil(suggested),
        margin: calculateMargin(Math.ceil(suggested), sc.pricePerConsultation),
      })
    }
  }

  return prices
}
