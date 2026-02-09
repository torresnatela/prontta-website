'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { ProposalSummary } from '../shared/ProposalSummary'
import { SHARED_AGENDA_PRICES } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'

export function StepProposal() {
  const { state, dispatch } = useProposal()

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Proposta Comercial
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Revise sua proposta completa. Adicione consultas avulsas da agenda compartilhada
          para compor seu custo final.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Add shared consultations */}
        <div className="lg:col-span-2 space-y-6">
          {state.useSharedAgenda && (
            <SharedConsultationAdder />
          )}

          {/* Info */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
            <strong>Dica:</strong> A partir de 150 consultas mensais no total, o custo do
            software de telemedicina é isento automaticamente.
          </div>
        </div>

        {/* Right: Proposal Summary */}
        <div className="lg:col-span-3">
          <ProposalSummary />
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
          Voltar
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
        >
          Simulador de Rentabilidade
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function SharedConsultationAdder() {
  const { state, dispatch } = useProposal()
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [quantity, setQuantity] = useState(5)

  const specialties = Object.entries(SHARED_AGENDA_PRICES)
  const selectedPrice = selectedSpecialty ? SHARED_AGENDA_PRICES[selectedSpecialty] : 0

  const handleAdd = () => {
    if (!selectedSpecialty || quantity < 1) return
    dispatch({
      type: 'ADD_SHARED_CONSULTATION',
      specialty: selectedSpecialty,
      quantity,
      pricePerConsultation: selectedPrice,
    })
    setSelectedSpecialty('')
    setQuantity(5)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-display text-lg font-bold text-primary-navy mb-4">
        Adicionar Consultas Avulsas
      </h3>
      <p className="text-sm text-neutral-gray mb-4">
        Adicione consultas da agenda compartilhada à sua proposta.
      </p>

      {/* Current shared consultations list */}
      {state.sharedConsultations.length > 0 && (
        <div className="space-y-2 mb-4">
          {state.sharedConsultations.map((sc) => (
            <div key={sc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <span className="text-sm font-medium text-primary-navy">{sc.specialty}</span>
                <span className="text-xs text-neutral-gray ml-1">({sc.quantity}x)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(sc.totalCost)}</span>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_SHARED_CONSULTATION', id: sc.id })}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="space-y-3">
        <div className="relative">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-accent-light bg-white text-sm text-primary-navy appearance-none cursor-pointer focus:outline-none focus:border-primary-cyan"
          >
            <option value="">Selecione a especialidade</option>
            {specialties.map(([name, price]) => (
              <option key={name} value={name}>
                {name} — {formatCurrency(price)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray pointer-events-none" />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 rounded-xl border-2 border-accent-light text-sm font-medium focus:outline-none focus:border-primary-cyan"
              placeholder="Qtd"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={!selectedSpecialty}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {selectedSpecialty && (
          <div className="text-sm text-neutral-gray">
            Custo: {formatCurrency(selectedPrice * quantity)} ({quantity}x {formatCurrency(selectedPrice)})
          </div>
        )}
      </div>
    </div>
  )
}
