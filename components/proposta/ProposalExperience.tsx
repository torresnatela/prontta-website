'use client';

import { ConsultationsStep } from '@/components/proposta/simulator/ConsultationsStep';
import { CostsStep } from '@/components/proposta/simulator/CostsStep';
import { DREStep } from '@/components/proposta/simulator/DREStep';
import { MarginsStep } from '@/components/proposta/simulator/MarginsStep';
import { ProgramsStep } from '@/components/proposta/simulator/ProgramsStep';
import { SellerFields } from '@/components/proposta/simulator/SellerFields';
import { ExplainerProvider } from '@/components/simulador/shared/ExplainerProvider';
import { ExplainerSection } from '@/components/simulador/shared/ExplainerSection';
import { SimFooter, SimTopBar } from '@/components/simulador/shared/SimChrome';
import type { ClientType } from '@/lib/pricing';
import { PROPOSTA_CHAPTERS } from '@/lib/proposta/videos';
import { ComplianceSection } from './sections/ComplianceSection';
import { ContactSection } from './sections/ContactSection';
import { IncludedSection } from './sections/IncludedSection';
import { ProposalHero } from './sections/ProposalHero';
import { ProposalMobileBar, ProposalResultPanel } from './sections/ProposalResultPanel';
import { ResponsibilitiesSection } from './sections/ResponsibilitiesSection';
import { RisksSection } from './sections/RisksSection';
import { ProposalProvider } from './state/ProposalProvider';

interface ProposalExperienceProps {
  /** Canal que abre selecionado — muda a headline do hero e o rótulo salvo. */
  clientType: ClientType;
  /** Legenda da topbar, logo abaixo da logo. */
  topBarSubtitle: string;
}

/**
 * A proposta comercial inteira: hero, camada explicativa, simulador em cinco
 * passos, painel de resultado e as seções de escopo/compliance.
 *
 * Uma rota por canal de venda (/proposta para clínicas, /academias/proposta
 * para academias) e todas montam ESTE componente. A matemática, os passos e o
 * PDF são idênticos — o que muda é o vocabulário, e ele todo vem de
 * `clientType`. Se um canal precisar de conteúdo próprio de verdade, o lugar é
 * `lib/proposal-content.ts`, não um fork desta árvore.
 */
export function ProposalExperience({ clientType, topBarSubtitle }: ProposalExperienceProps) {
  return (
    <ProposalProvider clientType={clientType}>
      <ExplainerProvider chapters={PROPOSTA_CHAPTERS}>
        <div className="sim-root proposta">
          <div className="shell">
            <SimTopBar subtitle={topBarSubtitle} pill="Simulador de proposta e DRE" />
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
