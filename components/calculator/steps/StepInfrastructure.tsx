'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Wrench, Monitor, Box } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { InfrastructureCard } from '../shared/InfrastructureCard'
import { INFRASTRUCTURE_OPTIONS } from '@/lib/pricing-data'
import type { InfrastructureOption, PaymentMode } from '@/lib/calculator-types'

const infraIcons: Record<InfrastructureOption, React.ReactNode> = {
  propria: <Wrench className="w-7 h-7 text-primary-cyan" />,
  totem: <Monitor className="w-7 h-7 text-primary-cyan" />,
  cabine: <Box className="w-7 h-7 text-primary-cyan" />,
}

export function StepInfrastructure() {
  const { state, dispatch } = useProposal()

  const handleSelect = (option: InfrastructureOption) => {
    const data = INFRASTRUCTURE_OPTIONS[option]
    const paymentMode: PaymentMode = option === 'propria' ? 'compra' : state.infrastructure.paymentMode

    dispatch({
      type: 'SET_INFRASTRUCTURE',
      infrastructure: {
        option,
        paymentMode,
        monthlyCost: option === 'propria' ? 0 : paymentMode === 'aluguel' ? data.monthlyRent : 0,
        oneTimeCost: option === 'propria' ? 0 : paymentMode === 'compra' ? data.purchasePrice : 0,
      },
    })
  }

  const handlePaymentModeChange = (mode: PaymentMode) => {
    const data = INFRASTRUCTURE_OPTIONS[state.infrastructure.option]
    dispatch({
      type: 'SET_INFRASTRUCTURE',
      infrastructure: {
        ...state.infrastructure,
        paymentMode: mode,
        monthlyCost: mode === 'aluguel' ? data.monthlyRent : 0,
        oneTimeCost: mode === 'compra' ? data.purchasePrice : 0,
      },
    })
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Infraestrutura
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Defina como será o espaço de atendimento na sua operação.
          Você pode usar sua própria estrutura ou adquirir nossos equipamentos.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {(Object.keys(INFRASTRUCTURE_OPTIONS) as InfrastructureOption[]).map((option, index) => {
          const data = INFRASTRUCTURE_OPTIONS[option]
          return (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InfrastructureCard
                option={option}
                label={data.label}
                description={data.description}
                icon={infraIcons[option]}
                purchasePrice={data.purchasePrice}
                monthlyRent={data.monthlyRent}
                isSelected={state.infrastructure.option === option}
                paymentMode={state.infrastructure.paymentMode}
                onSelect={() => handleSelect(option)}
                onPaymentModeChange={handlePaymentModeChange}
              />
            </motion.div>
          )
        })}
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
          Continuar
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
