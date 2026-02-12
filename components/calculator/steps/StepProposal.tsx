'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronDown, CalendarRange, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { ProposalSummary } from '../shared/ProposalSummary'
import { SHARED_AGENDA_PRICES, DEDICATED_SPECIALTIES, CATEGORIES } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'
import type { ServiceCategory } from '@/lib/calculator-types'

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
          Detalhamento dos serviços e valores mensais. Ajuste quantidades e itens conforme sua necessidade; o resumo e o custo final são atualizados automaticamente.
        </p>
      </motion.div>

      {/* Detalhamento dos serviços — estilo proposta comercial */}
      <div className="space-y-8">
        {state.useDedicatedAgenda && (
          <section className="w-full" aria-labelledby="titulo-agenda-dedicada">
            <DedicatedPackageEditor />
          </section>
        )}
        {state.useSharedAgenda && (
          <section className="w-full" aria-labelledby="titulo-consultas-avulsas">
            <SharedConsultationAdder />
          </section>
        )}

        {/* Dica */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
          <strong>Dica:</strong> A partir de 150 consultas mensais no total, o custo do
          software de telemedicina é isento automaticamente.
        </div>

        {/* Resumo da proposta */}
        <ProposalSummary />
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
        {state.clientCategory === 'municipio' ? (
          <Button
            variant="primary"
            size="md"
            onClick={async () => {
              const { generateProposalPDF } = await import('../shared/PDFDocument')
              const emptyDRE = {
                receitaDedicada: 0,
                receitaCompartilhada: 0,
                receitaBruta: 0,
                impostos: 0,
                receitaLiquida: 0,
                custoDedicada: 0,
                custoCompartilhada: 0,
                custoSoftware: 0,
                custoInfraestrutura: 0,
                totalCustos: 0,
                lucroBruto: 0,
                margemBruta: 0,
                custoFuncionarios: 0,
                despesasFixas: 0,
                totalDespesas: 0,
                resultadoOperacional: 0,
                margemOperacional: 0,
              }
              generateProposalPDF(state, emptyDRE)
            }}
          >
            <FileDown className="mr-2 w-4 h-4" />
            Exportar Proposta
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
          >
            Simulador de Rentabilidade
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function DedicatedPackageEditor() {
  const { state, dispatch } = useProposal()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('popular')
  const [quantity, setQuantity] = useState(1)

  const specialtyNames = Object.keys(DEDICATED_SPECIALTIES)

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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-primary-navy/5 to-transparent border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <CalendarRange className="w-5 h-5 text-primary-cyan" />
          <h3 id="titulo-agenda-dedicada" className="font-display text-xl font-bold text-primary-navy">
            1. Agenda Dedicada — Pacotes de Atendimento
          </h3>
        </div>
        <p className="text-sm text-neutral-gray max-w-3xl">
          Pacotes com especialistas dedicados à sua operação. Cada pacote corresponde a um plantão mensal (4h), com número de consultas conforme a categoria escolhida (Popular, Intermediária ou Alto Padrão). Inclui atendimento exclusivo e previsibilidade de custo.
        </p>
      </div>
      <div className="p-6">
      {state.dedicatedPackages.length > 0 && (
        <div className="space-y-2 mb-4">
          {state.dedicatedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center bg-gray-50 rounded-lg p-3 sm:grid-cols-[minmax(0,1fr)_120px_140px_auto]"
            >
              <div className="min-w-0">
                <span className="text-sm font-medium text-primary-navy">{pkg.specialty}</span>
                <span className="text-xs text-neutral-gray ml-1">
                  ({CATEGORIES[pkg.category].label})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={pkg.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    const n = Number.isNaN(v) ? 1 : Math.max(1, v)
                    dispatch({ type: 'UPDATE_DEDICATED_PACKAGE', id: pkg.id, updates: { quantity: n } })
                  }}
                  className="w-14 text-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary-cyan"
                />
                <span className="text-xs text-neutral-gray whitespace-nowrap">pacotes</span>
              </div>
              <div className="text-sm font-semibold text-primary-navy whitespace-nowrap">
                {formatCurrency(pkg.totalCost)}
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_DEDICATED_PACKAGE', id: pkg.id })}
                className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
                aria-label="Remover"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-primary-cyan/20 rounded-xl p-4 space-y-4"
          >
            <div className="relative">
              <label className="block text-xs font-medium text-neutral-gray mb-1">Especialidade</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-accent-light bg-white text-sm text-primary-navy focus:outline-none focus:border-primary-cyan"
              >
                <option value="">Selecione</option>
                {specialtyNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-neutral-gray pointer-events-none" />
            </div>
            {selectedSpecialty && (
              <>
                <div>
                  <label className="block text-xs font-medium text-neutral-gray mb-1">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2.5 rounded-lg border-2 border-accent-light bg-white text-sm text-primary-navy focus:outline-none focus:border-primary-cyan"
                  >
                    {(Object.keys(CATEGORIES) as ServiceCategory[]).map((cat) => (
                      <option key={cat} value={cat}>{CATEGORIES[cat].label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-neutral-gray mb-1">Pacotes/mês</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-accent-light text-sm font-medium focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleAdd}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-primary-cyan/30 text-primary-cyan font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-cyan/5"
          >
            <Plus className="w-4 h-4" />
            Adicionar pacote
          </motion.button>
        )}
      </AnimatePresence>
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-primary-navy/5 to-transparent border-b border-gray-100">
        <h3 id="titulo-consultas-avulsas" className="font-display text-xl font-bold text-primary-navy mb-2">
          2. Consultas Avulsas — Agenda Compartilhada
        </h3>
        <p className="text-sm text-neutral-gray max-w-3xl">
          Consultas em diversas especialidades, sem compromisso de pacote. Os valores seguem a categoria Intermediária (mesmo preço e tempo médio por consulta da agenda dedicada intermediária). Ideal para complementar a operação ou atender demanda variável.
        </p>
      </div>
      <div className="p-6">
      {/* Current shared consultations list */}
      {state.sharedConsultations.length > 0 && (
        <div className="space-y-2 mb-4">
          {state.sharedConsultations.map((sc) => (
            <div
              key={sc.id}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center bg-gray-50 rounded-lg p-3 sm:grid-cols-[minmax(0,1fr)_120px_140px_auto]"
            >
              <div className="min-w-0">
                <span className="text-sm font-medium text-primary-navy">{sc.specialty}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={sc.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    const n = Number.isNaN(v) ? 1 : Math.max(1, v)
                    dispatch({ type: 'UPDATE_SHARED_CONSULTATION', id: sc.id, quantity: n })
                  }}
                  className="w-14 text-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary-cyan"
                />
                <span className="text-xs text-neutral-gray whitespace-nowrap">consultas</span>
              </div>
              <div className="text-sm font-semibold text-primary-navy whitespace-nowrap">
                {formatCurrency(sc.totalCost)}
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_SHARED_CONSULTATION', id: sc.id })}
                className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
                aria-label="Remover"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
    </div>
  )
}
