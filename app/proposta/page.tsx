import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProposalForm } from '@/components/calculator'
import { Logo } from '@/components/layout/Logo'

export const metadata: Metadata = {
  title: 'Calculadora de Propostas | Prontta Saúde',
  description: 'Calcule sua proposta de terceirização médica personalizada. Simule valores para retorno de implante capilar, acompanhamento pós-operatório e pré-operatório cardiológico.',
}

function ProposalFormWrapper() {
  return <ProposalForm />
}

export default function PropostaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light via-white to-accent-light">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-cyan/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-navy/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-accent-light bg-white/80 backdrop-blur-md">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <Logo size="sm" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-gray hover:text-primary-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan font-medium rounded-full text-sm mb-4">
            Calculadora de Propostas
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-navy mb-4">
            Monte sua proposta{' '}
            <span className="gradient-text">personalizada</span>
          </h1>
          <p className="text-neutral-gray text-lg">
            Selecione o tipo de serviço, informe os dados da sua clínica 
            e receba uma proposta detalhada em minutos.
          </p>
        </div>

        {/* Calculator Form */}
        <Suspense fallback={
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse bg-white rounded-2xl p-8 shadow-lg">
              <div className="h-8 bg-accent-light rounded w-1/3 mb-6" />
              <div className="space-y-4">
                <div className="h-20 bg-accent-light rounded" />
                <div className="h-20 bg-accent-light rounded" />
                <div className="h-20 bg-accent-light rounded" />
              </div>
            </div>
          </div>
        }>
          <ProposalFormWrapper />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-accent-light bg-white/80 backdrop-blur-md py-6">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-gray">
            © {new Date().getFullYear()} Prontta Saúde. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

