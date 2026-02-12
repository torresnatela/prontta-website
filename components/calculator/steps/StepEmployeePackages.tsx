'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronDown, Package, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { DEDICATED_SPECIALTIES } from '@/lib/pricing-data'
import { getPackagePrice } from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const specialtyNames = Object.keys(DEDICATED_SPECIALTIES)

export function StepEmployeePackages() {
  const { state, dispatch } = useProposal()
  const [newPackageName, setNewPackageName] = useState('')

  const hasValidPackages =
    state.employeePackages.length > 0 &&
    state.employeePackages.some((p) => p.items.length > 0)
  const canProceed = hasValidPackages && state.numberOfEmployees >= 1

  const handleAddPackage = () => {
    const name = newPackageName.trim() || 'Novo pacote'
    dispatch({ type: 'ADD_EMPLOYEE_PACKAGE', name })
    setNewPackageName('')
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Pacotes por Colaborador
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Monte pacotes de consultas que cada colaborador terá por mês. Todos os valores são da categoria Intermediária.
        </p>
      </motion.div>

      {/* Número de colaboradores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-primary-cyan" />
          <h3 className="font-display text-lg font-bold text-primary-navy">
            Número de colaboradores
          </h3>
        </div>
        <input
          type="number"
          min={0}
          value={state.numberOfEmployees || ''}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10)
            dispatch({ type: 'SET_NUMBER_OF_EMPLOYEES', count: Number.isNaN(v) ? 0 : Math.max(0, v) })
          }}
          placeholder="Ex: 50"
          className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-accent-light text-lg font-semibold text-primary-navy focus:outline-none focus:border-primary-cyan"
        />
      </motion.div>

      {/* Lista de pacotes */}
      <div className="space-y-6 mb-8">
        <AnimatePresence>
          {state.employeePackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </AnimatePresence>
      </div>

      {/* Criar novo pacote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={newPackageName}
          onChange={(e) => setNewPackageName(e.target.value)}
          placeholder="Nome do pacote (ex: Pacote Saúde Mental)"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-accent-light text-primary-navy focus:outline-none focus:border-primary-cyan"
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleAddPackage}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar novo pacote
        </Button>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'PREV_STEP' })}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          disabled={!canProceed}
          className={cn(!canProceed && 'opacity-50 cursor-not-allowed')}
        >
          Continuar
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: { id: string; name: string; items: { id: string; specialty: string; quantityPerEmployee: number; pricePerConsultation: number; costPerEmployee: number }[]; costPerEmployee: number } }) {
  const { dispatch } = useProposal()
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(pkg.name)

  const handleBlurName = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'UPDATE_EMPLOYEE_PACKAGE_NAME', id: pkg.id, name: nameInput.trim() })
    }
    setEditingName(false)
  }

  const handleAddItem = () => {
    if (!selectedSpecialty) return
    dispatch({ type: 'ADD_EMPLOYEE_PACKAGE_ITEM', packageId: pkg.id, specialty: selectedSpecialty })
    setSelectedSpecialty('')
  }

  const availableSpecialties = specialtyNames.filter(
    (name) => !pkg.items.some((i) => i.specialty === name)
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Package className="w-5 h-5 text-primary-cyan shrink-0" />
          {editingName ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleBlurName}
              onKeyDown={(e) => e.key === 'Enter' && handleBlurName()}
              className="flex-1 px-3 py-1.5 rounded-lg border-2 border-primary-cyan/30 text-primary-navy font-bold focus:outline-none focus:border-primary-cyan"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingName(true)
                setNameInput(pkg.name)
              }}
              className="font-display text-lg font-bold text-primary-navy hover:text-primary-cyan transition-colors text-left truncate"
            >
              {pkg.name}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-primary-cyan">
            {formatCurrency(pkg.costPerEmployee)}/colaborador
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'REMOVE_EMPLOYEE_PACKAGE', id: pkg.id })}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="Remover pacote"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {pkg.items.length > 0 && (
          <div className="space-y-2">
            {pkg.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 sm:gap-4 items-center bg-gray-50 rounded-lg p-3 grid-cols-[minmax(0,1fr)_minmax(130px,auto)_minmax(115px,auto)_auto]"
              >
                <span className="text-sm font-medium text-primary-navy min-w-0 truncate">{item.specialty}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    value={item.quantityPerEmployee}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10)
                      const n = Number.isNaN(v) ? 1 : Math.max(1, v)
                      dispatch({
                        type: 'UPDATE_EMPLOYEE_PACKAGE_ITEM',
                        packageId: pkg.id,
                        itemId: item.id,
                        quantityPerEmployee: n,
                      })
                    }}
                    className="w-14 shrink-0 text-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary-cyan"
                  />
                  <span className="text-xs text-neutral-gray whitespace-nowrap">cons./colab.</span>
                </div>
                <span className="text-sm font-semibold text-primary-navy whitespace-nowrap shrink-0">
                  {formatCurrency(item.costPerEmployee)}/colab.
                </span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'REMOVE_EMPLOYEE_PACKAGE_ITEM', packageId: pkg.id, itemId: item.id })
                  }
                  className="p-1 text-red-400 hover:text-red-600"
                  aria-label="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Adicionar especialidade */}
        <div className="flex flex-wrap gap-2 items-end">
          <div className="relative min-w-[200px] flex-1">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-accent-light bg-white text-sm text-primary-navy focus:outline-none focus:border-primary-cyan appearance-none"
            >
              <option value="">Adicionar especialidade</option>
              {availableSpecialties.map((name) => (
                <option key={name} value={name}>
                  {name} — {formatCurrency(getPackagePrice(name, 'intermediaria'))}/cons.
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray pointer-events-none" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddItem}
            disabled={!selectedSpecialty}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
