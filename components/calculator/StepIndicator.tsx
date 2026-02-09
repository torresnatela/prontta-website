'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Introdução' },
  { label: 'Modelos' },
  { label: 'Infraestrutura' },
  { label: 'Implantação' },
  { label: 'Proposta' },
  { label: 'Rentabilidade' },
]

interface StepIndicatorProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle + Label */}
              <button
                onClick={() => isCompleted && onStepClick?.(index)}
                disabled={!isCompleted}
                className={cn(
                  'flex flex-col items-center gap-2 relative',
                  isCompleted && 'cursor-pointer'
                )}
              >
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2',
                    isCompleted && 'bg-emerald-500 border-emerald-500 text-white',
                    isActive && 'bg-primary-cyan border-primary-cyan text-white shadow-lg shadow-primary-cyan/30',
                    !isCompleted && !isActive && 'bg-white border-gray-200 text-gray-400'
                  )}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block whitespace-nowrap',
                    isActive && 'text-primary-cyan',
                    isCompleted && 'text-emerald-600',
                    !isCompleted && !isActive && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-20px] sm:mt-[-24px]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
