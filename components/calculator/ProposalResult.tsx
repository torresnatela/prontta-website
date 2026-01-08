'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Mail, 
  Check, 
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { PricingResult } from '@/lib/pricing'

interface ProposalResultProps {
  pricing: PricingResult
  formData: {
    companyName: string
    email: string
    phone: string
    proposalType: string
    patientsPerMonth: number
    consultDuration?: number
  }
  onBack: () => void
}

const proposalTypeNames: Record<string, string> = {
  'agenda-on-demand': 'Agenda On Demand',
  'agenda-compartilhada': 'Agenda Compartilhada',
  'pacotes-atendimento': 'Pacotes de Atendimento',
}

export function ProposalResult({ pricing, formData, onBack }: ProposalResultProps) {
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate a PDF
    alert('Funcionalidade de download do PDF será implementada com @react-pdf/renderer')
  }

  const handleSendEmail = () => {
    // In a real implementation, this would send an email
    alert('Proposta enviada para: ' + formData.email)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-navy mb-2">
          Proposta Gerada com Sucesso!
        </h2>
        <p className="text-neutral-gray">
          Confira os detalhes abaixo e faça o download ou envie por e-mail.
        </p>
      </div>

      {/* Proposal Card */}
      <Card variant="default" hover={false} className="p-8 mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-accent-light mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-primary-cyan font-medium mb-1">
              <FileText className="w-4 h-4" />
              Proposta Comercial
            </div>
            <h3 className="font-display text-xl font-bold text-primary-navy">
              {proposalTypeNames[formData.proposalType]}
            </h3>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <div className="text-sm text-neutral-gray">Data</div>
            <div className="font-semibold text-primary-navy">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <Building2 className="w-5 h-5 text-primary-cyan" />
            </div>
            <div>
              <div className="text-sm text-neutral-gray">Empresa</div>
              <div className="font-semibold text-primary-navy">{formData.companyName || 'Não informado'}</div>
              <div className="text-sm text-neutral-gray">{formData.email}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <Users className="w-5 h-5 text-primary-cyan" />
            </div>
            <div>
              <div className="text-sm text-neutral-gray">Pacientes/Mês</div>
              <div className="font-semibold text-primary-navy">{formData.patientsPerMonth}</div>
              {formData.consultDuration && (
                <div className="text-sm text-neutral-gray">
                  Consulta de {formData.consultDuration} min
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-accent-light rounded-2xl p-6 mb-8">
          <h4 className="font-semibold text-primary-navy mb-4">Valores</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-gray">Valor por paciente</span>
              <span className="font-semibold text-primary-navy">
                {formatCurrency(pricing.unitPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-gray">Quantidade mensal</span>
              <span className="font-semibold text-primary-navy">
                {formData.patientsPerMonth} pacientes
              </span>
            </div>
            <div className="h-px bg-primary-navy/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary-navy">Total Mensal Estimado</span>
              <span className="text-2xl font-bold text-primary-cyan">
                {formatCurrency(pricing.totalMonthly)}
              </span>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-8">
          <h4 className="font-semibold text-primary-navy mb-4">O que está incluso</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {pricing.includes.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary-cyan/10 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-primary-cyan" />
                </div>
                <span className="text-neutral-gray">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-primary-navy/5 rounded-xl">
          <p className="text-sm text-neutral-gray">
            <strong className="text-primary-navy">Observação:</strong> {pricing.description}. 
            Os valores apresentados são estimativas baseadas nas informações fornecidas. 
            O valor final pode variar de acordo com especificidades do contrato.
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Editar Proposta
        </Button>
        <Button
          variant="primary"
          onClick={handleDownloadPDF}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </Button>
        <Button
          variant="primary"
          onClick={handleSendEmail}
          className="gap-2 bg-primary-navy hover:bg-primary-navy/90"
        >
          <Mail className="w-4 h-4" />
          Enviar por E-mail
        </Button>
      </div>

      {/* Validity Note */}
      <p className="text-center text-sm text-neutral-gray mt-6">
        <Calendar className="w-4 h-4 inline-block mr-1" />
        Esta proposta é válida por 30 dias a partir da data de emissão.
      </p>
    </motion.div>
  )
}

