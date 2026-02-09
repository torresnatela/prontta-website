'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { DRETable } from '../shared/DRETable'
import { EmployeeForm } from '../shared/EmployeeForm'
import { ExpenseForm } from '../shared/ExpenseForm'
import { CATEGORIES, DEFAULT_TAX_PERCENTAGE } from '@/lib/pricing-data'
import {
  generateInitialSellingPrices,
  calculateMargin,
  calculateProfitability,
} from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function StepProfitability() {
  const { state, dispatch } = useProposal()

  // Initialize selling prices when entering this step
  useEffect(() => {
    if (state.sellingPrices.length === 0) {
      const initial = generateInitialSellingPrices(state)
      dispatch({ type: 'SET_SELLING_PRICES', prices: initial })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dre = useMemo(() => calculateProfitability(state), [state])

  const handlePriceChange = (index: number, value: string) => {
    const price = parseFloat(value) || 0
    const cost = state.sellingPrices[index].costPerConsultation
    const margin = calculateMargin(price, cost)
    dispatch({ type: 'UPDATE_SELLING_PRICE', index, sellingPrice: price, margin })
  }

  const handleExportPDF = async () => {
    // Dynamic import to keep bundle size small
    const { generateProposalPDF } = await import('../shared/PDFDocument')
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
              Defina quanto você vai cobrar por consulta. O sistema sugere um valor com 30% de margem.
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
