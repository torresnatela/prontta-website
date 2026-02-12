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

  useSharedAgenda: false,
  useDedicatedAgenda: false,
  dedicatedPackages: [],

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

function generateId() {
  return Math.random().toString(36).substring(2, 9)
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
    case 'SET_STEP':
      return { ...state, currentStep: action.step }

    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) }

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }

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
