'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useProposal } from './ProposalContext'
import { StepIndicator } from './StepIndicator'
import { StepIntro } from './steps/StepIntro'
import { StepClientCategory } from './steps/StepClientCategory'
import { StepServiceModel } from './steps/StepServiceModel'
import { StepEmployeePackages } from './steps/StepEmployeePackages'
import { StepInfrastructure } from './steps/StepInfrastructure'
import { StepImplantation } from './steps/StepImplantation'
import { StepProposal } from './steps/StepProposal'
import { StepCompanyProposal } from './steps/StepCompanyProposal'
import { StepProfitability } from './steps/StepProfitability'
import type { ClientCategory } from '@/lib/calculator-types'

type StepComponent = () => JSX.Element

function getStepsAndLabels(
  clientCategory: ClientCategory | null
): { steps: StepComponent[]; labels: { label: string }[] } {
  const intro = { step: StepIntro, label: 'Introdução' }
  const cat = { step: StepClientCategory, label: 'Categoria' }
  const modelos = { step: StepServiceModel, label: 'Modelos' }
  const infra = { step: StepInfrastructure, label: 'Infraestrutura' }
  const implant = { step: StepImplantation, label: 'Implantação' }
  const proposta = { step: StepProposal, label: 'Proposta' }
  const rent = { step: StepProfitability, label: 'Rentabilidade' }
  const pacotes = { step: StepEmployeePackages, label: 'Pacotes' }
  const propostaEmp = { step: StepCompanyProposal, label: 'Proposta' }

  if (clientCategory === null) {
    return {
      steps: [intro.step, cat.step],
      labels: [intro.label, cat.label].map((l) => ({ label: l })),
    }
  }
  if (clientCategory === 'municipio') {
    return {
      steps: [intro.step, cat.step, modelos.step, infra.step, implant.step, proposta.step],
      labels: [intro.label, cat.label, modelos.label, infra.label, implant.label, proposta.label].map(
        (l) => ({ label: l })
      ),
    }
  }
  if (clientCategory === 'empresa') {
    return {
      steps: [intro.step, cat.step, pacotes.step, infra.step, implant.step, propostaEmp.step],
      labels: [intro.label, cat.label, pacotes.label, infra.label, implant.label, propostaEmp.label].map(
        (l) => ({ label: l })
      ),
    }
  }
  // estabelecimento
  return {
    steps: [intro.step, cat.step, modelos.step, infra.step, implant.step, proposta.step, rent.step],
    labels: [intro.label, cat.label, modelos.label, infra.label, implant.label, proposta.label, rent.label].map(
      (l) => ({ label: l })
    ),
  }
}

export function ProposalWizard() {
  const { state, dispatch } = useProposal()
  const { steps, labels } = getStepsAndLabels(state.clientCategory)
  const CurrentStep = steps[state.currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-light/30">
      {state.currentStep > 0 && (
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <StepIndicator
            currentStep={state.currentStep}
            steps={labels}
            onStepClick={(step) => dispatch({ type: 'SET_STEP', step })}
          />
        </div>
      )}

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
