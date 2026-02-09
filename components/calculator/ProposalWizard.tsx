'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useProposal } from './ProposalContext'
import { StepIndicator } from './StepIndicator'
import { StepIntro } from './steps/StepIntro'
import { StepServiceModel } from './steps/StepServiceModel'
import { StepInfrastructure } from './steps/StepInfrastructure'
import { StepImplantation } from './steps/StepImplantation'
import { StepProposal } from './steps/StepProposal'
import { StepProfitability } from './steps/StepProfitability'

const steps = [
  StepIntro,
  StepServiceModel,
  StepInfrastructure,
  StepImplantation,
  StepProposal,
  StepProfitability,
]

export function ProposalWizard() {
  const { state, dispatch } = useProposal()
  const CurrentStep = steps[state.currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-light/30">
      {/* Step Indicator */}
      {state.currentStep > 0 && (
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <StepIndicator
            currentStep={state.currentStep}
            onStepClick={(step) => dispatch({ type: 'SET_STEP', step })}
          />
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <CurrentStep />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
