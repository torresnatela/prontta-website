'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Clock, Users, Zap, Crown, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { DEDICATED_SPECIALTIES, CATEGORIES, HOURS_PER_SHIFT } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ServiceCategory, DedicatedPackage } from '@/lib/calculator-types'

const categoryIcons = {
  popular: Zap,
  intermediaria: Users,
  alto_padrao: Crown,
}

const categoryColors = {
  popular: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-500',
    text: 'text-emerald-700',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  intermediaria: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBorder: 'border-blue-500',
    text: 'text-blue-700',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  alto_padrao: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBorder: 'border-amber-500',
    text: 'text-amber-700',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
}

export function DedicatedPackageSelector() {
  const { state, dispatch } = useProposal()
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('popular')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const specialtyNames = Object.keys(DEDICATED_SPECIALTIES)

  const currentPricing = selectedSpecialty
    ? DEDICATED_SPECIALTIES[selectedSpecialty]?.[selectedCategory]
    : null

  const consultationsPerPackage = currentPricing
    ? Math.floor(currentPricing.consultsPerHour * HOURS_PER_SHIFT)
    : 0

  const handleAdd = () => {
    if (!selectedSpecialty || quantity < 1) return
    dispatch({
      type: 'ADD_DEDICATED_PACKAGE',
      specialty: selectedSpecialty,
      category: selectedCategory,
      quantity,
    })
    setSelectedSpecialty('')
    setSelectedCategory('popular')
    setQuantity(1)
    setIsAdding(false)
  }

  const totalConsultations = state.dedicatedPackages.reduce((sum, p) => sum + p.totalConsultations, 0)
  const totalCost = state.dedicatedPackages.reduce((sum, p) => sum + p.totalCost, 0)

  return (
    <div className="space-y-6">
      {/* Package List */}
      {state.dedicatedPackages.length > 0 && (
        <div className="space-y-3">
          {state.dedicatedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}

          {/* Totals */}
          <div className="bg-primary-navy/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-neutral-gray">Total mensal</span>
              <div className="font-display text-lg font-bold text-primary-navy">
                {totalConsultations} consultas &middot; {formatCurrency(totalCost)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Package */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border-2 border-primary-cyan/20 p-6 space-y-6"
          >
            {/* Specialty Select */}
            <div>
              <label className="block text-base font-medium text-primary-navy mb-2">
                Especialidade
              </label>
              <div className="relative">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-accent-light bg-white text-lg text-primary-navy appearance-none cursor-pointer focus:outline-none focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/20"
                >
                  <option value="">Selecione uma especialidade</option>
                  {specialtyNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray pointer-events-none" />
              </div>
            </div>

            {/* Category Selection */}
            {selectedSpecialty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-base font-medium text-primary-navy mb-3">
                  Categoria do Atendimento
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {(Object.keys(CATEGORIES) as ServiceCategory[]).map((cat) => {
                    const info = CATEGORIES[cat]
                    const colors = categoryColors[cat]
                    const Icon = categoryIcons[cat]
                    const isSelected = selectedCategory === cat
                    const pricing = DEDICATED_SPECIALTIES[selectedSpecialty]?.[cat]
                    const consPerPkg = pricing
                      ? Math.floor(pricing.consultsPerHour * HOURS_PER_SHIFT)
                      : 0

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'rounded-xl border-2 p-4 text-left transition-all duration-200',
                          colors.bg,
                          isSelected ? colors.activeBorder : colors.border,
                          isSelected && 'shadow-md'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={cn('w-5 h-5', colors.icon)} />
                          <span className={cn('font-bold text-sm', colors.text)}>
                            {info.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-neutral-gray">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            ~{info.avgMinutes} min/consulta
                          </div>
                          <div>{consPerPkg} consultas/pacote</div>
                          {pricing && (
                            <div className={cn('font-semibold mt-1', colors.text)}>
                              {formatCurrency(pricing.pricePerConsultation)}/consulta
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Quantity + Preview */}
            {selectedSpecialty && currentPricing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-base font-medium text-primary-navy mb-2">
                    Quantidade de Pacotes/Mês
                  </label>
                  <p className="text-sm text-neutral-gray mb-3">
                    Cada pacote equivale a 1 plantão de {HOURS_PER_SHIFT} horas com {consultationsPerPackage} consultas.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-primary-navy hover:border-primary-cyan transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center px-3 py-2 rounded-xl border-2 border-accent-light text-lg font-bold text-primary-navy focus:outline-none focus:border-primary-cyan"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-primary-navy hover:border-primary-cyan transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-accent-light/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm text-neutral-gray">Resumo do pacote</span>
                    <div className="font-semibold text-primary-navy">
                      {quantity * consultationsPerPackage} consultas/mês
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-neutral-gray">Custo mensal</span>
                    <div className="font-display text-xl font-bold text-primary-cyan">
                      {formatCurrency(quantity * consultationsPerPackage * currentPricing.pricePerConsultation)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsAdding(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleAdd}
                    className="flex-1"
                  >
                    Adicionar Pacote
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-primary-cyan/30 text-primary-cyan font-semibold flex items-center justify-center gap-2 hover:bg-primary-cyan/5 hover:border-primary-cyan/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Adicionar Especialidade
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: DedicatedPackage }) {
  const { dispatch } = useProposal()
  const colors = categoryColors[pkg.category]
  const catLabel = CATEGORIES[pkg.category].label

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-primary-navy">{pkg.specialty}</span>
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', colors.badge)}>
            {catLabel}
          </span>
        </div>
        <div className="text-sm text-neutral-gray">
          {pkg.quantity} pacote{pkg.quantity > 1 ? 's' : ''} &middot;{' '}
          {pkg.totalConsultations} consultas/mês &middot;{' '}
          {formatCurrency(pkg.pricePerConsultation)}/consulta
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="font-display text-lg font-bold text-primary-navy">
            {formatCurrency(pkg.totalCost)}
          </span>
          <span className="text-xs text-neutral-gray block">/mês</span>
        </div>
        <button
          onClick={() => dispatch({ type: 'REMOVE_DEDICATED_PACKAGE', id: pkg.id })}
          className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
