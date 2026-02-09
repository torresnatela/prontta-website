'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { ProposalProvider, ProposalWizard } from '@/components/calculator'

export default function PropostaPage() {
  return (
    <ProposalProvider>
      {/* Simplified header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-gray hover:text-primary-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <ProposalWizard />
    </ProposalProvider>
  )
}
