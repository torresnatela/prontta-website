'use client'

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import type {
  ProposalState,
  DedicatedPackage,
  SharedConsultation,
  InfrastructureSelection,
  Employee,
  FixedExpense,
  SellingPrice,
  ServiceCategory,
  ClientCategory,
  EmployeePackage,
  EmployeePackageItem,
} from '@/lib/calculator-types'
import {
  getConsultationsPerPackage,
  getPackagePrice,
  getConsultsPerHour,
} from '@/lib/pricing-engine'
import { DEFAULT_TAX_PERCENTAGE } from '@/lib/pricing-data'

// ---- Estado Inicial ----

const initialState: ProposalState = {
  currentStep: 0,

  clientCategory: null,

  useSharedAgenda: false,
  useDedicatedAgenda: false,
  dedicatedPackages: [],

  employeePackages: [],
  numberOfEmployees: 0,

  infrastructure: {
    option: 'propria',
    paymentMode: 'compra',
    monthlyCost: 0,
    oneTimeCost: 0,
  },

  implantationNote: '',

  sharedConsultations: [],

  sellingPrices: [],
  taxPercentage: DEFAULT_TAX_PERCENTAGE,
  employees: [],
  fixedExpenses: [],
}

// ---- Actions ----

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'TOGGLE_SHARED_AGENDA' }
  | { type: 'TOGGLE_DEDICATED_AGENDA' }
  | { type: 'ADD_DEDICATED_PACKAGE'; specialty: string; category: ServiceCategory; quantity: number }
  | { type: 'ADD_DEDICATED_PACKAGES'; items: Array<{ specialty: string; category: ServiceCategory; quantity: number }> }
  | { type: 'UPDATE_DEDICATED_PACKAGE'; id: string; updates: Partial<Pick<DedicatedPackage, 'category' | 'quantity'>> }
  | { type: 'REMOVE_DEDICATED_PACKAGE'; id: string }
  | { type: 'SET_INFRASTRUCTURE'; infrastructure: InfrastructureSelection }
  | { type: 'SET_IMPLANTATION_NOTE'; note: string }
  | { type: 'ADD_SHARED_CONSULTATION'; specialty: string; quantity: number; pricePerConsultation: number }
  | { type: 'UPDATE_SHARED_CONSULTATION'; id: string; quantity: number }
  | { type: 'REMOVE_SHARED_CONSULTATION'; id: string }
  | { type: 'SET_SELLING_PRICES'; prices: SellingPrice[] }
  | { type: 'UPDATE_SELLING_PRICE'; index: number; sellingPrice: number; margin: number }
  | { type: 'SET_TAX_PERCENTAGE'; percentage: number }
  | { type: 'ADD_EMPLOYEE'; cargo: string; salarioBase: number; custoTotal: number }
  | { type: 'REMOVE_EMPLOYEE'; id: string }
  | { type: 'ADD_FIXED_EXPENSE'; categoria: string; valor: number }
  | { type: 'UPDATE_FIXED_EXPENSE'; id: string; valor: number }
  | { type: 'REMOVE_FIXED_EXPENSE'; id: string }
  | { type: 'SET_CLIENT_CATEGORY'; category: ClientCategory }
  | { type: 'ADD_EMPLOYEE_PACKAGE'; name: string }
  | { type: 'UPDATE_EMPLOYEE_PACKAGE_NAME'; id: string; name: string }
  | { type: 'REMOVE_EMPLOYEE_PACKAGE'; id: string }
  | { type: 'ADD_EMPLOYEE_PACKAGE_ITEM'; packageId: string; specialty: string }
  | { type: 'UPDATE_EMPLOYEE_PACKAGE_ITEM'; packageId: string; itemId: string; quantityPerEmployee: number }
  | { type: 'REMOVE_EMPLOYEE_PACKAGE_ITEM'; packageId: string; itemId: string }
  | { type: 'SET_NUMBER_OF_EMPLOYEES'; count: number }

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function getMaxStep(clientCategory: ClientCategory | null): number {
  if (clientCategory === null) return 1 // Intro, then ClientCategory
  if (clientCategory === 'estabelecimento') return 6 // Intro, Cat, Modelos, Infra, Implant, Proposta, Rentabilidade
  return 5 // empresa: Intro, Cat, Pacotes, Infra, Implant, PropostaEmpresa
}

function buildEmployeePackageItem(specialty: string, quantityPerEmployee: number): EmployeePackageItem {
  const pricePerConsultation = getPackagePrice(specialty, 'intermediaria')
  return {
    id: generateId(),
    specialty,
    quantityPerEmployee,
    pricePerConsultation,
    costPerEmployee: quantityPerEmployee * pricePerConsultation,
  }
}

function recalcEmployeePackageCost(pkg: EmployeePackage): EmployeePackage {
  const costPerEmployee = pkg.items.reduce((sum, item) => sum + item.costPerEmployee, 0)
  return { ...pkg, costPerEmployee }
}

function buildDedicatedPackage(
  specialty: string,
  category: ServiceCategory,
  quantity: number
): DedicatedPackage {
  const consultsPerHour = getConsultsPerHour(specialty, category)
  const consultationsPerPackage = getConsultationsPerPackage(specialty, category)
  const pricePerConsultation = getPackagePrice(specialty, category)
  const totalConsultations = quantity * consultationsPerPackage
  const totalCost = totalConsultations * pricePerConsultation

  return {
    id: generateId(),
    specialty,
    category,
    quantity,
    consultsPerHour,
    consultationsPerPackage,
    pricePerConsultation,
    totalConsultations,
    totalCost,
  }
}

function reducer(state: ProposalState, action: Action): ProposalState {
  switch (action.type) {
    case 'SET_STEP': {
      const max = getMaxStep(state.clientCategory)
      return { ...state, currentStep: Math.max(0, Math.min(action.step, max)) }
    }

    case 'NEXT_STEP': {
      const max = getMaxStep(state.clientCategory)
      return { ...state, currentStep: Math.min(state.currentStep + 1, max) }
    }

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }

    case 'SET_CLIENT_CATEGORY':
      return { ...state, clientCategory: action.category }

    case 'TOGGLE_SHARED_AGENDA': {
      const nextShared = !state.useSharedAgenda
      return {
        ...state,
        useSharedAgenda: nextShared,
        sharedConsultations: nextShared ? state.sharedConsultations : [],
      }
    }

    case 'TOGGLE_DEDICATED_AGENDA':
      return { ...state, useDedicatedAgenda: !state.useDedicatedAgenda }

    case 'ADD_DEDICATED_PACKAGE': {
      const pkg = buildDedicatedPackage(action.specialty, action.category, action.quantity)
      return { ...state, dedicatedPackages: [...state.dedicatedPackages, pkg] }
    }

    case 'ADD_DEDICATED_PACKAGES': {
      const newPkgs = action.items.map((item) =>
        buildDedicatedPackage(item.specialty, item.category, item.quantity)
      )
      return { ...state, dedicatedPackages: [...state.dedicatedPackages, ...newPkgs] }
    }

    case 'UPDATE_DEDICATED_PACKAGE': {
      const packages = state.dedicatedPackages.map((pkg) => {
        if (pkg.id !== action.id) return pkg
        const category = action.updates.category ?? pkg.category
        const quantity = action.updates.quantity ?? pkg.quantity
        const newPkg = buildDedicatedPackage(pkg.specialty, category, quantity)
        return { ...newPkg, id: pkg.id }
      })
      return { ...state, dedicatedPackages: packages }
    }

    case 'REMOVE_DEDICATED_PACKAGE':
      return {
        ...state,
        dedicatedPackages: state.dedicatedPackages.filter((p) => p.id !== action.id),
      }

    case 'SET_INFRASTRUCTURE':
      return { ...state, infrastructure: action.infrastructure }

    case 'SET_IMPLANTATION_NOTE':
      return { ...state, implantationNote: action.note }

    case 'ADD_SHARED_CONSULTATION': {
      const sc: SharedConsultation = {
        id: generateId(),
        specialty: action.specialty,
        quantity: action.quantity,
        pricePerConsultation: action.pricePerConsultation,
        totalCost: action.quantity * action.pricePerConsultation,
      }
      return { ...state, sharedConsultations: [...state.sharedConsultations, sc] }
    }

    case 'UPDATE_SHARED_CONSULTATION': {
      const consultations = state.sharedConsultations.map((sc) => {
        if (sc.id !== action.id) return sc
        return {
          ...sc,
          quantity: action.quantity,
          totalCost: action.quantity * sc.pricePerConsultation,
        }
      })
      return { ...state, sharedConsultations: consultations }
    }

    case 'REMOVE_SHARED_CONSULTATION':
      return {
        ...state,
        sharedConsultations: state.sharedConsultations.filter((sc) => sc.id !== action.id),
      }

    case 'SET_SELLING_PRICES':
      return { ...state, sellingPrices: action.prices }

    case 'UPDATE_SELLING_PRICE': {
      const prices = [...state.sellingPrices]
      prices[action.index] = {
        ...prices[action.index],
        sellingPrice: action.sellingPrice,
        margin: action.margin,
      }
      return { ...state, sellingPrices: prices }
    }

    case 'SET_TAX_PERCENTAGE':
      return { ...state, taxPercentage: action.percentage }

    case 'ADD_EMPLOYEE': {
      const emp: Employee = {
        id: generateId(),
        cargo: action.cargo,
        salarioBase: action.salarioBase,
        custoTotal: action.custoTotal,
      }
      return { ...state, employees: [...state.employees, emp] }
    }

    case 'REMOVE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.id),
      }

    case 'ADD_FIXED_EXPENSE': {
      const exp: FixedExpense = {
        id: generateId(),
        categoria: action.categoria,
        valor: action.valor,
      }
      return { ...state, fixedExpenses: [...state.fixedExpenses, exp] }
    }

    case 'UPDATE_FIXED_EXPENSE': {
      const expenses = state.fixedExpenses.map((e) =>
        e.id === action.id ? { ...e, valor: action.valor } : e
      )
      return { ...state, fixedExpenses: expenses }
    }

    case 'REMOVE_FIXED_EXPENSE':
      return {
        ...state,
        fixedExpenses: state.fixedExpenses.filter((e) => e.id !== action.id),
      }

    case 'ADD_EMPLOYEE_PACKAGE': {
      const pkg: EmployeePackage = {
        id: generateId(),
        name: action.name || 'Novo pacote',
        items: [],
        costPerEmployee: 0,
      }
      return { ...state, employeePackages: [...state.employeePackages, pkg] }
    }

    case 'UPDATE_EMPLOYEE_PACKAGE_NAME': {
      const packages = state.employeePackages.map((p) =>
        p.id === action.id ? { ...p, name: action.name } : p
      )
      return { ...state, employeePackages: packages }
    }

    case 'REMOVE_EMPLOYEE_PACKAGE':
      return {
        ...state,
        employeePackages: state.employeePackages.filter((p) => p.id !== action.id),
      }

    case 'ADD_EMPLOYEE_PACKAGE_ITEM': {
      const item = buildEmployeePackageItem(action.specialty, 1)
      const packages = state.employeePackages.map((p) => {
        if (p.id !== action.packageId) return p
        const items = [...p.items, item]
        const costPerEmployee = items.reduce((sum, i) => sum + i.costPerEmployee, 0)
        return { ...p, items, costPerEmployee }
      })
      return { ...state, employeePackages: packages }
    }

    case 'UPDATE_EMPLOYEE_PACKAGE_ITEM': {
      const packages = state.employeePackages.map((p) => {
        if (p.id !== action.packageId) return p
        const items = p.items.map((i) => {
          if (i.id !== action.itemId) return i
          const costPerEmployee = action.quantityPerEmployee * i.pricePerConsultation
          return {
            ...i,
            quantityPerEmployee: action.quantityPerEmployee,
            costPerEmployee,
          }
        })
        return recalcEmployeePackageCost({ ...p, items })
      })
      return { ...state, employeePackages: packages }
    }

    case 'REMOVE_EMPLOYEE_PACKAGE_ITEM': {
      const packages = state.employeePackages.map((p) => {
        if (p.id !== action.packageId) return p
        const items = p.items.filter((i) => i.id !== action.itemId)
        return recalcEmployeePackageCost({ ...p, items })
      })
      return { ...state, employeePackages: packages }
    }

    case 'SET_NUMBER_OF_EMPLOYEES':
      return { ...state, numberOfEmployees: Math.max(0, action.count) }

    default:
      return state
  }
}

// ---- Context ----

interface ProposalContextType {
  state: ProposalState
  dispatch: React.Dispatch<Action>
}

const ProposalContext = createContext<ProposalContextType | null>(null)

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ProposalContext.Provider value={{ state, dispatch }}>
      {children}
    </ProposalContext.Provider>
  )
}

export function useProposal() {
  const context = useContext(ProposalContext)
  if (!context) {
    throw new Error('useProposal must be used within a ProposalProvider')
  }
  return context
}
