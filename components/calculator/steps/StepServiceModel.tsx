'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MonitorPlay, CalendarRange, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { SharedAgendaTable } from '../shared/SharedAgendaTable'
import { DedicatedPackageSelector } from '../shared/DedicatedPackageSelector'
import { cn } from '@/lib/utils'

export function StepServiceModel() {
  const { state, dispatch } = useProposal()

  const canProceed = state.useSharedAgenda || (state.useDedicatedAgenda && state.dedicatedPackages.length > 0)

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Modelos de Atendimento
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Escolha um ou ambos os modelos para compor sua operação. Na agenda compartilhada você compra consultas avulsas nos mesmos preços da categoria Intermediária; pode combinar com pacotes dedicados.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Agenda Compartilhada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className={cn(
              'rounded-2xl border-2 transition-all duration-300 overflow-hidden',
              state.useSharedAgenda
                ? 'border-primary-cyan shadow-lg shadow-primary-cyan/10'
                : 'border-gray-200'
            )}
          >
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SHARED_AGENDA' })}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  state.useSharedAgenda ? 'bg-primary-cyan/10' : 'bg-gray-100'
                )}>
                  <MonitorPlay className={cn(
                    'w-6 h-6',
                    state.useSharedAgenda ? 'text-primary-cyan' : 'text-gray-400'
                  )} />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xl font-bold text-primary-navy">
                    Agenda Compartilhada
                  </h3>
                  <p className="text-sm text-neutral-gray">
                    Consultas avulsas com preços da categoria Intermediária — mesmo padrão de tempo e valor da agenda dedicada intermediária.
                  </p>
                </div>
              </div>
              {state.useSharedAgenda ? (
                <ToggleRight className="w-8 h-8 text-primary-cyan" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-300" />
              )}
            </button>

            {state.useSharedAgenda && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-6"
              >
                <SharedAgendaTable />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Agenda Dedicada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={cn(
              'rounded-2xl border-2 transition-all duration-300 overflow-hidden',
              state.useDedicatedAgenda
                ? 'border-primary-cyan shadow-lg shadow-primary-cyan/10'
                : 'border-gray-200'
            )}
          >
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DEDICATED_AGENDA' })}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  state.useDedicatedAgenda ? 'bg-primary-cyan/10' : 'bg-gray-100'
                )}>
                  <CalendarRange className={cn(
                    'w-6 h-6',
                    state.useDedicatedAgenda ? 'text-primary-cyan' : 'text-gray-400'
                  )} />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xl font-bold text-primary-navy">
                    Agenda Dedicada
                  </h3>
                  <p className="text-sm text-neutral-gray">
                    Pacotes exclusivos com especialistas dedicados à sua operação
                  </p>
                </div>
              </div>
              {state.useDedicatedAgenda ? (
                <ToggleRight className="w-8 h-8 text-primary-cyan" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-300" />
              )}
            </button>

            {state.useDedicatedAgenda && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-6"
              >
                <DedicatedPackageSelector />
              </motion.div>
            )}
          </div>
        </motion.div>
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
