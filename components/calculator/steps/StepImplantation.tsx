'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Monitor, Rocket, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { useProposal } from '../ProposalContext'
import { SOFTWARE_MONTHLY_COST, SOFTWARE_FREE_THRESHOLD } from '@/lib/pricing-data'
import {
  calculateTotalMonthlyConsultations,
  calculateSoftwareCost,
} from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function StepImplantation() {
  const { state, dispatch } = useProposal()

  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const softwareCost = calculateSoftwareCost(totalConsultations)
  const isExempt = softwareCost === 0
  const remaining = SOFTWARE_FREE_THRESHOLD - totalConsultations

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Implantação e Software
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Custos de software de telemedicina e implantação do projeto.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Software */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'rounded-2xl border-2 p-6 md:p-8',
            isExempt
              ? 'border-emerald-200 bg-emerald-50/50'
              : 'border-gray-200 bg-white'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
              isExempt ? 'bg-emerald-100' : 'bg-primary-cyan/10'
            )}>
              <Monitor className={cn(
                'w-7 h-7',
                isExempt ? 'text-emerald-600' : 'text-primary-cyan'
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display text-xl font-bold text-primary-navy">
                  Software de Telemedicina
                </h3>
                {isExempt && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ISENTO
                  </motion.span>
                )}
              </div>
              <p className="text-neutral-gray mb-4">
                Plataforma completa de telemedicina com agendamento, prontuário eletrônico e
                gestão de consultas integrada.
              </p>

              <div className="flex items-baseline gap-2 mb-3">
                {isExempt ? (
                  <>
                    <span className="font-display text-2xl font-bold text-emerald-600">
                      R$ 0,00
                    </span>
                    <span className="text-sm text-neutral-gray line-through">
                      {formatCurrency(SOFTWARE_MONTHLY_COST)}/mês
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-2xl font-bold text-primary-navy">
                      {formatCurrency(SOFTWARE_MONTHLY_COST)}
                    </span>
                    <span className="text-sm text-neutral-gray">/mês</span>
                  </>
                )}
              </div>

              {/* Threshold info */}
              <div className={cn(
                'rounded-lg p-3 text-sm flex items-start gap-2',
                isExempt ? 'bg-emerald-100/50' : 'bg-amber-50'
              )}>
                {isExempt ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-emerald-700">
                      Parabéns! Com <strong>{totalConsultations} consultas/mês</strong>, você
                      está isento do custo do software.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-amber-700">
                      Isenção a partir de {SOFTWARE_FREE_THRESHOLD} consultas/mês.
                      Atualmente: <strong>{totalConsultations} consultas</strong>.
                      {remaining > 0 && (
                        <> Faltam <strong>{remaining}</strong> consultas para isenção.</>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Implantação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-gray-200 bg-white p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-primary-cyan/10">
              <Rocket className="w-7 h-7 text-primary-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-primary-navy mb-2">
                Implantação
              </h3>
              <p className="text-neutral-gray mb-4">
                O valor da implantação é definido de acordo com o escopo de cada projeto
                e deve ser combinado com nosso time comercial. Inclui setup completo,
                treinamento da equipe e acompanhamento inicial.
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-bold text-primary-navy">
                    A combinar
                  </span>
                  <span className="text-sm text-neutral-gray">
                    (definido pelo time comercial)
                  </span>
                </div>
              </div>

              <Textarea
                label="Observações sobre a implantação (opcional)"
                placeholder="Descreva detalhes ou necessidades específicas do seu projeto..."
                value={state.implantationNote}
                onChange={(e) => dispatch({ type: 'SET_IMPLANTATION_NOTE', note: e.target.value })}
                rows={3}
              />
            </div>
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
        >
          Continuar
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
