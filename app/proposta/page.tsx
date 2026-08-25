'use client';

import {
  ComplianceSection,
  ContactSection,
  IncludedSection,
  ProposalHero,
  ProposalMobileBar,
  ProposalProvider,
  ProposalResultPanel,
  ResponsibilitiesSection,
  RisksSection,
} from '@/components/proposta';
import { ConsultationsStep } from '@/components/proposta/simulator/ConsultationsStep';
import { CostsStep } from '@/components/proposta/simulator/CostsStep';
import { DREStep } from '@/components/proposta/simulator/DREStep';
import { MarginsStep } from '@/components/proposta/simulator/MarginsStep';
import { ProgramsStep } from '@/components/proposta/simulator/ProgramsStep';
import { SellerFields } from '@/components/proposta/simulator/SellerFields';
import { ExplainerProvider } from '@/components/simulador/shared/ExplainerProvider';
import { ExplainerSection } from '@/components/simulador/shared/ExplainerSection';
import { SimFooter, SimTopBar } from '@/components/simulador/shared/SimChrome';
import { PROPOSTA_CHAPTERS } from '@/lib/proposta/videos';

export default function PropostaPage() {
  return (
    <ProposalProvider>
      <ExplainerProvider chapters={PROPOSTA_CHAPTERS}>
        <div className="sim-root proposta">
          <div className="shell">
            <SimTopBar subtitle="Proposta comercial" pill="Simulador de proposta e DRE" />
            <ProposalHero />

            <ExplainerSection
              kicker="Entenda antes de montar"
              title="Cinco vídeos curtos e você monta a proposta sozinho"
              lead="Da formação do preço de uma consulta até o PDF assinado. Assista na ordem ou pule direto para a dúvida que você tem agora."
            />

            <div className="main-grid" id="simulador">
              <main className="panel">
                <MarginsStep />
                <div className="divider" />
                <ConsultationsStep />
                <div className="divider" />
                <ProgramsStep />
                <div className="divider" />
                <CostsStep />
                <div className="divider" />
                <DREStep />
                <div className="divider" />
                <SellerFields />
              </main>
              <ProposalResultPanel />
            </div>

            <ProposalMobileBar />

            <IncludedSection />
            <ResponsibilitiesSection />
            <ComplianceSection />
            <RisksSection />
            <ContactSection />

            <SimFooter>Proposta comercial · válida por 30 dias</SimFooter>
          </div>
        </div>
      </ExplainerProvider>
    </ProposalProvider>
  );
}
