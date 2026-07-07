'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import {
  useConsultationsSummary,
  useDRE,
  useProgramsSummary,
  useProposal,
  useProposalTotals,
} from '../state/ProposalProvider';

export function ContactSection() {
  const { state } = useProposal();
  const consultations = useConsultationsSummary();
  const programs = useProgramsSummary();
  const totals = useProposalTotals();
  const dre = useDRE();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownloadPDF() {
    setIsGenerating(true);
    try {
      const { generateProposalPDF } = await import('../pdf/generate');
      await generateProposalPDF({ state, consultations, programs, totals, dre });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section id="contato" className="bg-primary-navy text-white">
      <div className="container-custom section-padding">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-cyan mb-3">
            Próximo passo
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Validar a proposta e avançar para o plano de implantação
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Baixe esta proposta em PDF para compartilhar internamente ou fale com nosso time para
            desenhar a operação no seu ponto de acesso.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary-cyan text-white font-semibold hover:bg-white hover:text-primary-navy transition-colors disabled:opacity-60"
          >
            {isGenerating ? 'Gerando PDF…' : 'Baixar proposta em PDF'}
          </button>
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:border-primary-cyan hover:text-primary-cyan transition-colors"
          >
            {PROPOSAL_CONTENT.cta.primary}
          </a>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-white/60 uppercase tracking-wide text-xs mb-1">Telefone</p>
            <a href={siteConfig.contact.phoneHref} className="text-white hover:text-primary-cyan">
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-white/60 uppercase tracking-wide text-xs mb-1">E-mail</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-primary-cyan">
              {siteConfig.contact.email}
            </a>
          </div>
          <div>
            <p className="text-white/60 uppercase tracking-wide text-xs mb-1">Atendimento</p>
            <p className="text-white">{siteConfig.contact.hours}</p>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/50">{PROPOSAL_CONTENT.proposalValidity}</p>
      </div>
    </section>
  );
}
