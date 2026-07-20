'use client';

import {
  ComplianceSection,
  ContactSection,
  HeroSection,
  IncludedSection,
  ProposalProvider,
  ResponsibilitiesSection,
  RisksSection,
  SimulatorSection,
  TopBar,
} from '@/components/proposta';

export default function PropostaPage() {
  return (
    <ProposalProvider>
      <div className="proposta-root">
        <TopBar />
        <main>
          <HeroSection />
          <SimulatorSection />
          <IncludedSection />
          <ResponsibilitiesSection />
          <ComplianceSection />
          <RisksSection />
          <ContactSection />
        </main>
        <footer>
          <div className="wrap">
            <span>Prontta Saúde · Programas de Saúde Assistida</span>
            <span>Proposta comercial · válida por 30 dias</span>
          </div>
        </footer>
      </div>
    </ProposalProvider>
  );
}
