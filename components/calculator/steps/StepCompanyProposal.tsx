'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, FileDown, Package, Users, Building2, Monitor, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProposal } from '../ProposalContext'
import { INFRASTRUCTURE_OPTIONS } from '@/lib/pricing-data'
import {
  calculateCompanyTotalConsultations,
  calculateCompanyTotalMonthlyCost,
  calculateSoftwareCost,
  calculateOneTimeInvestment,
} from '@/lib/pricing-engine'
import { formatCurrency } from '@/lib/utils'

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

export function StepCompanyProposal() {
  const { state, dispatch } = useProposal()

  const totalConsultations = calculateCompanyTotalConsultations(
    state.employeePackages,
    state.numberOfEmployees
  )
  const softwareCost = calculateSoftwareCost(totalConsultations)
  const totalMonthly = calculateCompanyTotalMonthlyCost(state)
  const oneTimeInvestment = calculateOneTimeInvestment(state)
  const infraData = INFRASTRUCTURE_OPTIONS[state.infrastructure.option]

  const costPerEmployeeTotal = state.employeePackages.reduce(
    (sum, pkg) => sum + pkg.costPerEmployee,
    0
  )

  const handleExportPDF = async () => {
    const { generateProposalPDF } = await import('../shared/PDFDocument')
    generateProposalPDF(state, emptyDRE)
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-navy mb-3">
          Proposta Comercial — Plano Empresarial
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Resumo dos pacotes por colaborador e custo total para sua empresa.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Pacotes por colaborador */}
        {state.employeePackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-cyan" />
                <h4 className="font-display font-bold text-primary-navy">{pkg.name}</h4>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-gray">Por colaborador</div>
                <div className="font-bold text-primary-cyan">{formatCurrency(pkg.costPerEmployee)}/mês</div>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {pkg.items.map((item) => (
                <div key={item.id} className="px-6 py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-primary-navy">{item.specialty}</span>
                    <div className="text-xs text-neutral-gray">
                      {item.quantityPerEmployee} consultas/colab. &middot; {formatCurrency(item.pricePerConsultation)}/consulta
                    </div>
                  </div>
                  <span className="font-semibold text-primary-navy">
                    {formatCurrency(item.costPerEmployee)}/colab.
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-3.5 bg-gray-50 flex items-center justify-between">
              <span className="font-semibold text-primary-navy">
                Total do pacote ({state.numberOfEmployees} colaboradores)
              </span>
              <span className="font-bold text-primary-navy">
                {formatCurrency(pkg.costPerEmployee * state.numberOfEmployees)}/mês
              </span>
            </div>
          </motion.div>
        ))}

        {/* Número de colaboradores */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary-cyan" />
            <h4 className="font-display font-bold text-primary-navy">Colaboradores</h4>
          </div>
          <p className="text-sm text-neutral-gray">
            {state.numberOfEmployees} colaboradores &middot; {totalConsultations} consultas/mês no total
          </p>
        </motion.div>

        {/* Infraestrutura */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Building2 className="w-5 h-5 text-primary-cyan" />
            <h4 className="font-display font-bold text-primary-navy">Infraestrutura</h4>
          </div>
          <div className="px-6 py-3.5 flex items-center justify-between">
            <span className="font-medium text-primary-navy">{infraData.label}</span>
            <span className="font-semibold text-primary-navy">
              {state.infrastructure.option === 'propria'
                ? 'Sem custo'
                : state.infrastructure.monthlyCost > 0
                  ? `${formatCurrency(state.infrastructure.monthlyCost)}/mês`
                  : oneTimeInvestment > 0
                    ? `${formatCurrency(oneTimeInvestment)} (à vista)`
                    : '-'}
            </span>
          </div>
        </motion.div>

        {/* Software */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Monitor className="w-5 h-5 text-primary-cyan" />
            <h4 className="font-display font-bold text-primary-navy">Software de Telemedicina</h4>
          </div>
          <div className="px-6 py-3.5 flex items-center justify-between">
            <span className="font-medium text-primary-navy">
              Plataforma ({totalConsultations} consultas/mês)
              {softwareCost === 0 && ' — Isento (150+ consultas)'}
            </span>
            <span className={softwareCost === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-primary-navy'}>
              {softwareCost === 0 ? 'ISENTO' : `${formatCurrency(softwareCost)}/mês`}
            </span>
          </div>
        </motion.div>

        {/* Implantação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Rocket className="w-5 h-5 text-primary-cyan" />
            <h4 className="font-display font-bold text-primary-navy">Implantação</h4>
          </div>
          <div className="px-6 py-3.5 flex items-center justify-between">
            <span className="font-medium text-primary-navy">Projeto de implantação</span>
            <span className="font-semibold text-primary-navy">A combinar</span>
          </div>
        </motion.div>

        {/* Resumo final */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-navy rounded-2xl p-6 md:p-8 text-white"
        >
          <h4 className="font-display text-xl font-bold mb-4">Resumo da Proposta</h4>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-white/80">
              <span>Consultas totais/mês</span>
              <span className="font-semibold text-white">{totalConsultations}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Custo por colaborador/mês</span>
              <span className="font-semibold text-white">{formatCurrency(costPerEmployeeTotal)}</span>
            </div>
            {oneTimeInvestment > 0 && (
              <div className="flex justify-between text-white/80">
                <span>Investimento inicial</span>
                <span className="font-semibold text-white">{formatCurrency(oneTimeInvestment)}</span>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between items-baseline">
              <span className="text-white/80">Custo mensal total</span>
              <span className="font-display text-3xl md:text-4xl font-bold text-primary-cyan">
                {formatCurrency(totalMonthly)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
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
          size="lg"
          className="group"
          onClick={handleExportPDF}
        >
          <FileDown className="mr-2 w-5 h-5" />
          Exportar Proposta em PDF
        </Button>
      </div>
    </div>
  )
}
