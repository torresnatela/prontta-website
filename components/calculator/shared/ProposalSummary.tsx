'use client'

import { motion } from 'framer-motion'
import { CalendarRange, MonitorPlay, Building2, Monitor, Rocket, Package } from 'lucide-react'
import { useProposal } from '../ProposalContext'
import { CATEGORIES, INFRASTRUCTURE_OPTIONS, SOFTWARE_MONTHLY_COST } from '@/lib/pricing-data'
import {
  calculateDedicatedPackagesCost,
  calculateSharedConsultationsCost,
  calculateTotalMonthlyConsultations,
  calculateSoftwareCost,
  calculateOneTimeInvestment,
  calculateTotalMonthlyCost,
} from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'

export function ProposalSummary() {
  const { state } = useProposal()

  const dedicatedCost = calculateDedicatedPackagesCost(state.dedicatedPackages)
  const sharedCost = calculateSharedConsultationsCost(state.sharedConsultations)
  const totalConsultations = calculateTotalMonthlyConsultations(state)
  const softwareCost = calculateSoftwareCost(totalConsultations)
  const totalMonthly = calculateTotalMonthlyCost(state)
  const oneTimeInvestment = calculateOneTimeInvestment(state)
  const infraData = INFRASTRUCTURE_OPTIONS[state.infrastructure.option]

  return (
    <div className="space-y-6">
      {/* 1. Agenda Dedicada — Resumo na proposta */}
      {state.dedicatedPackages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <CalendarRange className="w-5 h-5 text-primary-cyan" />
            <div>
              <h4 className="font-display font-bold text-primary-navy">
                1. Agenda Dedicada — Pacotes de Atendimento
              </h4>
              <p className="text-xs text-neutral-gray mt-0.5">Especialistas dedicados · plantões mensais · valor por consulta conforme categoria</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {state.dedicatedPackages.map((pkg) => (
              <div key={pkg.id} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-primary-navy">{pkg.specialty}</span>
                  <span className="text-sm text-neutral-gray ml-2">
                    ({CATEGORIES[pkg.category].label})
                  </span>
                  <div className="text-xs text-neutral-gray mt-0.5">
                    {pkg.quantity} pacote{pkg.quantity > 1 ? 's' : ''} &middot; {pkg.totalConsultations} consultas/mês &middot; {formatCurrency(pkg.pricePerConsultation)}/consulta
                  </div>
                </div>
                <span className="font-semibold text-primary-navy">{formatCurrency(pkg.totalCost)}/mês</span>
              </div>
            ))}
            <div className="px-6 py-3.5 bg-gray-50 flex items-center justify-between">
              <span className="font-semibold text-primary-navy">Subtotal — Agenda Dedicada</span>
              <span className="font-bold text-primary-navy">{formatCurrency(dedicatedCost)}/mês</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Consultas Avulsas — Resumo na proposta */}
      {state.sharedConsultations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <MonitorPlay className="w-5 h-5 text-primary-cyan" />
            <div>
              <h4 className="font-display font-bold text-primary-navy">
                2. Consultas Avulsas — Agenda Compartilhada
              </h4>
              <p className="text-xs text-neutral-gray mt-0.5">Preços categoria Intermediária · diversas especialidades · sem compromisso de pacote</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {state.sharedConsultations.map((sc) => (
              <div key={sc.id} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-primary-navy">{sc.specialty}</span>
                  <div className="text-xs text-neutral-gray mt-0.5">
                    {sc.quantity} consultas/mês &middot; {formatCurrency(sc.pricePerConsultation)}/consulta
                  </div>
                </div>
                <span className="font-semibold text-primary-navy">{formatCurrency(sc.totalCost)}/mês</span>
              </div>
            ))}
            <div className="px-6 py-3.5 bg-gray-50 flex items-center justify-between">
              <span className="font-semibold text-primary-navy">Subtotal — Consultas Avulsas</span>
              <span className="font-bold text-primary-navy">{formatCurrency(sharedCost)}/mês</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. Infraestrutura */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Building2 className="w-5 h-5 text-primary-cyan" />
          <h4 className="font-display font-bold text-primary-navy">3. Infraestrutura</h4>
        </div>
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div>
            <span className="font-medium text-primary-navy">{infraData.label}</span>
            {state.infrastructure.option !== 'propria' && (
              <span className="text-sm text-neutral-gray ml-2">
                ({state.infrastructure.paymentMode === 'compra' ? 'Compra' : 'Aluguel'})
              </span>
            )}
          </div>
          <div className="text-right">
            {state.infrastructure.monthlyCost > 0 && (
              <span className="font-semibold text-primary-navy">
                {formatCurrency(state.infrastructure.monthlyCost)}/mês
              </span>
            )}
            {state.infrastructure.oneTimeCost > 0 && (
              <span className="font-semibold text-primary-navy">
                {formatCurrency(state.infrastructure.oneTimeCost)} (à vista)
              </span>
            )}
            {state.infrastructure.option === 'propria' && (
              <span className="font-semibold text-emerald-600">Sem custo</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4. Software */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Monitor className="w-5 h-5 text-primary-cyan" />
          <h4 className="font-display font-bold text-primary-navy">4. Software de Telemedicina</h4>
        </div>
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div>
            <span className="font-medium text-primary-navy">Plataforma de Telemedicina</span>
            <div className="text-xs text-neutral-gray">
              {totalConsultations} consultas/mês
              {softwareCost === 0 && ' — Isento (150+ consultas)'}
            </div>
          </div>
          <span className={softwareCost === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-primary-navy'}>
            {softwareCost === 0 ? 'ISENTO' : `${formatCurrency(softwareCost)}/mês`}
          </span>
        </div>
      </motion.div>

      {/* 5. Implantação */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Rocket className="w-5 h-5 text-primary-cyan" />
          <h4 className="font-display font-bold text-primary-navy">5. Implantação</h4>
        </div>
        <div className="px-6 py-3.5 flex items-center justify-between">
          <span className="font-medium text-primary-navy">Projeto de implantação</span>
          <span className="font-semibold text-primary-navy">A combinar</span>
        </div>
      </motion.div>

      {/* Totals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-navy rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-primary-cyan" />
          <h4 className="font-display text-xl font-bold">Resumo da Proposta</h4>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-white/70">
            <span>Total de consultas/mês</span>
            <span className="font-semibold text-white">{totalConsultations}</span>
          </div>
          {oneTimeInvestment > 0 && (
            <div className="flex justify-between text-white/70">
              <span>Investimento inicial</span>
              <span className="font-semibold text-white">{formatCurrency(oneTimeInvestment)}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/20">
          <div className="flex justify-between items-baseline">
            <span className="text-white/70">Custo mensal recorrente</span>
            <span className="font-display text-3xl md:text-4xl font-bold text-primary-cyan">
              {formatCurrency(totalMonthly)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
