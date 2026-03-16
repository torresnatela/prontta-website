'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileDown, TrendingUp, Plus, Trash2, ChevronDown, CalendarRange, MonitorPlay } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { DRETable } from '../shared/DRETable'
import { EmployeeForm } from '../shared/EmployeeForm'
import { ExpenseForm } from '../shared/ExpenseForm'
import { CATEGORIES, DEFAULT_TAX_PERCENTAGE, SHARED_AGENDA_PRICES, DEDICATED_SPECIALTIES } from '@/lib/pricing-data'
import {
  generateInitialSellingPrices,
  calculateMargin,
  calculateProfitability,
} from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ServiceCategory } from '@/lib/calculator-types'

function mergeSellingPrices(
  state: { dedicatedPackages: { specialty: string; category: ServiceCategory }[]; sharedConsultations: { specialty: string }[]; sellingPrices: { specialty: string; category?: ServiceCategory; source: 'dedicada' | 'compartilhada'; sellingPrice: number; margin: number }[] }
) {
  const base = generateInitialSellingPrices(state as Parameters<typeof generateInitialSellingPrices>[0])
  return base.map((item) => {
    const old = state.sellingPrices.find(
      (p) =>
        p.specialty === item.specialty &&
        (p.category ?? undefined) === (item.category ?? undefined) &&
        p.source === item.source
    )
    return old ? { ...item, sellingPrice: old.sellingPrice, margin: old.margin } : item
  })
}

export function StepProfitability() {
  const { state, dispatch } = useProposal()

  // Sync selling prices when proposal items change (dedicated or shared)
  useEffect(() => {
    const merged = mergeSellingPrices(state)
    dispatch({ type: 'SET_SELLING_PRICES', prices: merged })
  }, [state.dedicatedPackages, state.sharedConsultations]) // eslint-disable-line react-hooks/exhaustive-deps

  const dre = useMemo(() => calculateProfitability(state), [state])

  const handlePriceChange = (index: number, value: string) => {
    const price = parseFloat(value) || 0
    const cost = state.sellingPrices[index].costPerConsultation
    const margin = calculateMargin(price, cost)
    dispatch({ type: 'UPDATE_SELLING_PRICE', index, sellingPrice: price, margin })
  }

  const handleExportPDF = async () => {
    // Dynamic import to keep bundle size small
    const { generateProposalPDF } = await import('../shared/pdf')
    generateProposalPDF(state, dre)
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Simulador de Rentabilidade
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Defina os preços de venda, custos operacionais e veja a projeção de resultado da sua operação.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left column: inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ajustar proposta */}
          {(state.useSharedAgenda || state.useDedicatedAgenda) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <h4 className="font-display font-bold text-primary-navy mb-4">Ajustar proposta</h4>
              <p className="text-sm text-neutral-gray mb-4">
                Altere quantidades ou itens; a DRE e os preços de venda serão atualizados.
              </p>

              {state.useDedicatedAgenda && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarRange className="w-4 h-4 text-primary-cyan" />
                    <span className="text-sm font-semibold text-primary-navy">Agenda Dedicada</span>
                  </div>
                  {state.dedicatedPackages.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {state.dedicatedPackages.map((pkg) => (
                        <div key={pkg.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-primary-navy">{pkg.specialty}</span>
                            <span className="text-xs text-neutral-gray ml-1">({CATEGORIES[pkg.category].label})</span>
                          </div>
                          <input
                            type="number"
                            min={1}
                            value={pkg.quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10)
                              const n = Number.isNaN(v) ? 1 : Math.max(1, v)
                              dispatch({ type: 'UPDATE_DEDICATED_PACKAGE', id: pkg.id, updates: { quantity: n } })
                            }}
                            className="w-12 text-center px-1.5 py-1 rounded border border-gray-200 text-xs font-medium focus:outline-none focus:border-primary-cyan"
                          />
                          <span className="text-xs text-neutral-gray">pct</span>
                          <span className="text-xs font-semibold shrink-0">{formatCurrency(pkg.totalCost)}</span>
                          <button
                            onClick={() => dispatch({ type: 'REMOVE_DEDICATED_PACKAGE', id: pkg.id })}
                            className="p-1 text-red-400 hover:text-red-600"
                            aria-label="Remover"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <ProfitabilityDedicatedAdder />
                </div>
              )}

              {state.useSharedAgenda && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MonitorPlay className="w-4 h-4 text-primary-cyan" />
                    <span className="text-sm font-semibold text-primary-navy">Agenda Compartilhada</span>
                  </div>
                  {state.sharedConsultations.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {state.sharedConsultations.map((sc) => (
                        <div key={sc.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-primary-navy">{sc.specialty}</span>
                          </div>
                          <input
                            type="number"
                            min={1}
                            value={sc.quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10)
                              const n = Number.isNaN(v) ? 1 : Math.max(1, v)
                              dispatch({ type: 'UPDATE_SHARED_CONSULTATION', id: sc.id, quantity: n })
                            }}
                            className="w-12 text-center px-1.5 py-1 rounded border border-gray-200 text-xs font-medium focus:outline-none focus:border-primary-cyan"
                          />
                          <span className="text-xs text-neutral-gray">cons.</span>
                          <span className="text-xs font-semibold shrink-0">{formatCurrency(sc.totalCost)}</span>
                          <button
                            onClick={() => dispatch({ type: 'REMOVE_SHARED_CONSULTATION', id: sc.id })}
                            className="p-1 text-red-400 hover:text-red-600"
                            aria-label="Remover"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <ProfitabilitySharedAdder />
                </div>
              )}
            </motion.div>
          )}

          {/* Selling Prices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-cyan" />
              <h4 className="font-display font-bold text-primary-navy">Preços de Venda</h4>
            </div>
            <p className="text-sm text-neutral-gray mb-4">
              Defina quanto você vai cobrar por consulta. O sistema sugere um valor com 60% de margem.
            </p>

            <div className="space-y-4">
              {state.sellingPrices.map((sp, index) => {
                const marginColor = sp.margin >= 30
                  ? 'text-emerald-600 bg-emerald-50'
                  : sp.margin >= 15
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-red-600 bg-red-50'

                return (
                  <div key={`${sp.specialty}-${sp.category}-${sp.source}`} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-primary-navy">{sp.specialty}</span>
                        {sp.category && (
                          <span className="text-xs text-neutral-gray ml-1">
                            ({CATEGORIES[sp.category]?.label})
                          </span>
                        )}
                        <span className="text-xs text-neutral-gray ml-1">
                          [{sp.source === 'dedicada' ? 'Dedicada' : 'Compartilhada'}]
                        </span>
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', marginColor)}>
                        {sp.margin.toFixed(0)}% margem
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-gray whitespace-nowrap">
                        Custo: {formatCurrency(sp.costPerConsultation)}
                      </span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-gray">R$</span>
                        <input
                          type="number"
                          value={sp.sellingPrice || ''}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-accent-light text-sm font-medium focus:outline-none focus:border-primary-cyan"
                          min={0}
                          step={5}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {state.sellingPrices.length === 0 && (
                <p className="text-sm text-neutral-gray text-center py-4">
                  Nenhuma consulta selecionada na proposta.
                </p>
              )}
            </div>
          </motion.div>

          {/* Tax */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h4 className="font-display font-bold text-primary-navy mb-3">Impostos sobre Vendas</h4>
            <p className="text-sm text-neutral-gray mb-3">
              Percentual sobre o faturamento bruto (ISS, PIS, COFINS, etc).
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={state.taxPercentage}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TAX_PERCENTAGE',
                    percentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 px-3 py-2.5 rounded-xl border-2 border-accent-light text-sm font-medium focus:outline-none focus:border-primary-cyan text-center"
                min={0}
                max={100}
                step={0.5}
              />
              <span className="text-sm text-neutral-gray">%</span>
              <button
                onClick={() => dispatch({ type: 'SET_TAX_PERCENTAGE', percentage: DEFAULT_TAX_PERCENTAGE })}
                className="text-xs text-primary-cyan hover:underline"
              >
                Usar padrão ({DEFAULT_TAX_PERCENTAGE}%)
              </button>
            </div>
          </motion.div>

          {/* Employees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <EmployeeForm />
          </motion.div>

          {/* Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <ExpenseForm />
          </motion.div>
        </div>

        {/* Right column: DRE */}
        <div className="lg:col-span-3">
          <div className="sticky top-40">
            <DRETable dre={dre} />

            {/* Export */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 group"
                onClick={handleExportPDF}
              >
                <FileDown className="mr-2 w-5 h-5" />
                Exportar Proposta + DRE em PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'PREV_STEP' })}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar para Proposta
        </Button>
      </div>
    </div>
  )
}

function ProfitabilityDedicatedAdder() {
  const { dispatch } = useProposal()
  const [open, setOpen] = useState(false)
  const [specialty, setSpecialty] = useState('')
  const [category, setCategory] = useState<ServiceCategory>('popular')
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    if (!specialty || quantity < 1) return
    dispatch({ type: 'ADD_DEDICATED_PACKAGE', specialty, category, quantity })
    setSpecialty('')
    setCategory('popular')
    setQuantity(1)
    setOpen(false)
  }

  const specialtyNames = Object.keys(DEDICATED_SPECIALTIES)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-2 rounded-lg border border-dashed border-primary-cyan/30 text-primary-cyan text-xs font-semibold flex items-center justify-center gap-1 hover:bg-primary-cyan/5"
      >
        <Plus className="w-3.5 h-3.5" />
        Adicionar pacote
      </button>
    )
  }

  return (
    <div className="border border-primary-cyan/20 rounded-lg p-3 space-y-3">
      <div className="relative">
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full px-2.5 py-2 rounded border border-gray-200 text-xs text-primary-navy focus:outline-none focus:border-primary-cyan"
        >
          <option value="">Especialidade</option>
          {specialtyNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-6 w-3.5 h-3.5 text-neutral-gray pointer-events-none" />
      </div>
      {specialty && (
        <>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-2.5 py-2 rounded border border-gray-200 text-xs text-primary-navy focus:outline-none focus:border-primary-cyan"
            >
              {(Object.keys(CATEGORIES) as ServiceCategory[]).map((cat) => (
                <option key={cat} value={cat}>{CATEGORIES[cat].label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="Pacotes"
                className="w-full px-2.5 py-2 rounded border border-gray-200 text-xs font-medium focus:outline-none focus:border-primary-cyan"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)} className="shrink-0">
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd} className="shrink-0">
              Adicionar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function ProfitabilitySharedAdder() {
  const { dispatch } = useProposal()
  const [open, setOpen] = useState(false)
  const [specialty, setSpecialty] = useState('')
  const [quantity, setQuantity] = useState(5)

  const specialties = Object.entries(SHARED_AGENDA_PRICES)
  const price = specialty ? SHARED_AGENDA_PRICES[specialty] : 0

  const handleAdd = () => {
    if (!specialty || quantity < 1) return
    dispatch({
      type: 'ADD_SHARED_CONSULTATION',
      specialty,
      quantity,
      pricePerConsultation: price,
    })
    setSpecialty('')
    setQuantity(5)
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-2 rounded-lg border border-dashed border-primary-cyan/30 text-primary-cyan text-xs font-semibold flex items-center justify-center gap-1 hover:bg-primary-cyan/5"
      >
        <Plus className="w-3.5 h-3.5" />
        Adicionar consulta avulsa
      </button>
    )
  }

  return (
    <div className="border border-primary-cyan/20 rounded-lg p-3 space-y-3">
      <div className="relative">
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full px-2.5 py-2 rounded border border-gray-200 text-xs text-primary-navy focus:outline-none focus:border-primary-cyan"
        >
          <option value="">Especialidade</option>
          {specialties.map(([name, p]) => (
            <option key={name} value={name}>{name} — {formatCurrency(p)}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-6 w-3.5 h-3.5 text-neutral-gray pointer-events-none" />
      </div>
      {specialty && (
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 px-2.5 py-2 rounded border border-gray-200 text-xs font-medium focus:outline-none focus:border-primary-cyan"
          />
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)} className="shrink-0">
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleAdd} className="shrink-0">
            Adicionar
          </Button>
        </div>
      )}
    </div>
  )
}
