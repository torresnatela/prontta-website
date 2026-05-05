'use client'

import { pdf } from '@react-pdf/renderer'
import type { ProposalState, DREResult } from '@/lib/calculator-types'

export async function generateProposalPDF(state: ProposalState, dre: DREResult) {
  const { ProposalPDF } = await import('./ProposalPDF')
  const doc = ProposalPDF({ state, dre })

  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `proposta-prontta-saude-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
