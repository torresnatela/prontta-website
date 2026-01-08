'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  CalendarClock,
  CalendarRange,
  Package,
  Calculator, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  Users,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import { Card } from '../ui/Card'
import { 
  calculatePricing, 
  ProposalType, 
  ConsultDuration,
  PROPOSAL_OPTIONS,
  DURATION_OPTIONS 
} from '@/lib/pricing'
import { formatCurrency } from '@/lib/utils'
import { ProposalResult } from './ProposalResult'

const formSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  proposalType: z.enum(['agenda-on-demand', 'agenda-compartilhada', 'pacotes-atendimento']),
  patientsPerMonth: z.number().min(1, 'Informe a quantidade de pacientes'),
  consultDuration: z.number().optional(),
})

type FormData = z.infer<typeof formSchema>

const steps = [
  { id: 1, title: 'Tipo de Proposta', icon: FileText },
  { id: 2, title: 'Dados da Empresa', icon: Building2 },
  { id: 3, title: 'Configurações', icon: Calculator },
  { id: 4, title: 'Resultado', icon: FileText },
]

const serviceIcons: Record<ProposalType, typeof CalendarClock> = {
  'agenda-on-demand': CalendarClock,
  'agenda-compartilhada': CalendarRange,
  'pacotes-atendimento': Package,
}

export function ProposalForm() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const [pricingResult, setPricingResult] = useState<ReturnType<typeof calculatePricing> | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposalType: 'agenda-on-demand',
      patientsPerMonth: 10,
      consultDuration: 30,
    },
  })

  const proposalType = watch('proposalType')
  const patientsPerMonth = watch('patientsPerMonth')
  const consultDuration = watch('consultDuration') as ConsultDuration

  // Set service from URL param
  useEffect(() => {
    const servico = searchParams.get('servico')
    if (servico && ['agenda-on-demand', 'agenda-compartilhada', 'pacotes-atendimento'].includes(servico)) {
      setValue('proposalType', servico as ProposalType)
    }
  }, [searchParams, setValue])

  // Calculate pricing when relevant values change
  useEffect(() => {
    if (proposalType && patientsPerMonth > 0) {
      const result = calculatePricing({
        proposalType: proposalType as ProposalType,
        patientsPerMonth,
        consultDuration: consultDuration || 30,
      })
      setPricingResult(result)
    }
  }, [proposalType, patientsPerMonth, consultDuration])

  const onSubmit = (data: FormData) => {
    setShowResult(true)
    setCurrentStep(4)
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-primary-navy mb-2">
                Selecione o modelo de atendimento
              </h3>
              <p className="text-neutral-gray">
                Escolha o modelo que melhor atende às necessidades da sua clínica.
              </p>
            </div>

            <div className="grid gap-4">
              {PROPOSAL_OPTIONS.map((option) => {
                const Icon = serviceIcons[option.id]
                const isSelected = proposalType === option.id

                return (
                  <motion.label
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-start gap-4 p-5 rounded-xl cursor-pointer border-2 transition-all
                      ${isSelected 
                        ? 'border-primary-cyan bg-primary-cyan/5' 
                        : 'border-accent-light hover:border-primary-cyan/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.id}
                      {...register('proposalType')}
                      className="sr-only"
                    />
                    <div className={`
                      p-3 rounded-xl shrink-0
                      ${isSelected ? 'bg-primary-cyan text-white' : 'bg-accent-light text-primary-navy'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary-navy">{option.name}</div>
                      <div className="text-sm text-neutral-gray mt-1">{option.description}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-primary-cyan rounded-full flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.label>
                )
              })}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-primary-navy mb-2">
                Dados da sua empresa
              </h3>
              <p className="text-neutral-gray">
                Preencha as informações para gerar sua proposta personalizada.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                label="Nome da Clínica/Hospital"
                placeholder="Ex: Clínica São Lucas"
                icon={<Building2 className="w-5 h-5" />}
                error={errors.companyName?.message}
                {...register('companyName')}
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="contato@clinica.com.br"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                icon={<Phone className="w-5 h-5" />}
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-primary-navy mb-2">
                Configure sua proposta
              </h3>
              <p className="text-neutral-gray">
                Informe os detalhes para calcularmos o valor ideal.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-primary-navy mb-2">
                  Quantidade de pacientes/mês
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <input
                    type="number"
                    min="1"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-accent-light bg-white text-primary-navy transition-all duration-300 focus:outline-none focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/20"
                    {...register('patientsPerMonth', { valueAsNumber: true })}
                  />
                </div>
                {errors.patientsPerMonth && (
                  <p className="mt-2 text-sm text-red-500">{errors.patientsPerMonth.message}</p>
                )}
              </div>

              {proposalType !== 'pacotes-atendimento' && (
                <Select
                  label="Duração da consulta"
                  options={DURATION_OPTIONS.map(d => ({ value: d.value, label: d.label }))}
                  {...register('consultDuration', { valueAsNumber: true })}
                />
              )}
            </div>

            {/* Live Preview */}
            {pricingResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-accent-light rounded-2xl"
              >
                <h4 className="font-semibold text-primary-navy mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary-cyan" />
                  Prévia do valor
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-neutral-gray">Valor por paciente</div>
                    <div className="text-2xl font-bold text-primary-navy">
                      {formatCurrency(pricingResult.unitPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-gray">Estimativa mensal</div>
                    <div className="text-2xl font-bold text-primary-cyan">
                      {formatCurrency(pricingResult.totalMonthly)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  if (showResult && pricingResult) {
    return (
      <ProposalResult
        pricing={pricingResult}
        formData={watch()}
        onBack={() => {
          setShowResult(false)
          setCurrentStep(3)
        }}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.slice(0, 3).map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: currentStep >= step.id ? '#00B4E6' : '#E6F9FF',
                  color: currentStep >= step.id ? '#FFFFFF' : '#6B7280',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              >
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </motion.div>
              {index < 2 && (
                <div className="hidden sm:block w-24 md:w-32 h-1 mx-2 bg-accent-light rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      width: currentStep > step.id ? '100%' : '0%',
                    }}
                    className="h-full bg-primary-cyan"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.slice(0, 3).map((step) => (
            <div
              key={step.id}
              className={`text-xs sm:text-sm ${
                currentStep >= step.id ? 'text-primary-navy' : 'text-neutral-gray'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card variant="glass" hover={false} className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-accent-light">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                className="gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="gap-2"
              >
                Gerar Proposta
                <FileText className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
