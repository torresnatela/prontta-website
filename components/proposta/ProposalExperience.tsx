'use client';

import { BenefitFundingStep } from '@/components/proposta/simulator/BenefitFundingStep';
import { BenefitProfileStep } from '@/components/proposta/simulator/BenefitProfileStep';
import { BenefitReturnStep } from '@/components/proposta/simulator/BenefitReturnStep';
import { ConsultationsStep } from '@/components/proposta/simulator/ConsultationsStep';
import { CostsStep } from '@/components/proposta/simulator/CostsStep';
import { DREStep } from '@/components/proposta/simulator/DREStep';
import { MarginsStep } from '@/components/proposta/simulator/MarginsStep';
import { ProgramsStep } from '@/components/proposta/simulator/ProgramsStep';
import { SellerFields } from '@/components/proposta/simulator/SellerFields';
import { ExplainerProvider } from '@/components/simulador/shared/ExplainerProvider';
import { ExplainerSection } from '@/components/simulador/shared/ExplainerSection';
import { SimFooter, SimTopBar } from '@/components/simulador/shared/SimChrome';
import { EMPRESA_CHAPTERS } from '@/lib/empresa/videos';
import type { ClientType } from '@/lib/pricing';
import type { ProposalMode } from '@/lib/proposta/mode';
import { PROPOSTA_CHAPTERS } from '@/lib/proposta/videos';
import { BenefitMobileBar, BenefitResultPanel } from './sections/BenefitResultPanel';
import { ComplianceSection } from './sections/ComplianceSection';
import { ContactSection } from './sections/ContactSection';
import { IncludedSection } from './sections/IncludedSection';
import { ProposalHero } from './sections/ProposalHero';
import { ProposalMobileBar, ProposalResultPanel } from './sections/ProposalResultPanel';
import { ResponsibilitiesSection } from './sections/ResponsibilitiesSection';
import { RisksSection } from './sections/RisksSection';
import { ProposalProvider, useProposalNarrative } from './state/ProposalProvider';

interface ProposalExperienceProps {
  /** Canal que abre selecionado — muda a headline do hero e o rótulo salvo. */
  clientType: ClientType;
  /** Legenda da topbar, logo abaixo da logo. */
  topBarSubtitle: string;
  /**
   * Revenda (padrão) ou benefício. No modo benefício a empresa compra para
   * ofertar ao colaborador: não há margem, não há DRE, e os passos são outros.
   */
  mode?: ProposalMode;
}

const EXPLAINER_COPY = {
  revenda: {
    title: 'Cinco vídeos curtos e você monta a proposta sozinho',
    lead: 'Da formação do preço de uma consulta até o PDF assinado. Assista na ordem ou pule direto para a dúvida que você tem agora.',
  },
  beneficio: {
    title: 'Seis vídeos curtos e você monta a proposta sozinho',
    lead: 'Do preço de uma consulta ao custo por colaborador. Assista na ordem ou pule direto para a dúvida que você tem agora.',
  },
} as const;

/** Os passos da coluna esquerda — a diferença estrutural entre os dois modos. */
function SimulatorSteps({ mode }: { mode: ProposalMode }) {
  if (mode === 'beneficio') {
    return (
      <>
        <BenefitProfileStep />
        <div className="divider" />
        <ConsultationsStep />
        <div className="divider" />
        <ProgramsStep />
        <div className="divider" />
        <BenefitFundingStep />
        <div className="divider" />
        <BenefitReturnStep />
        <div className="divider" />
        <SellerFields />
      </>
    );
  }

  return (
    <>
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
    </>
  );
}

/** Precisa estar DENTRO do provider para ler a narrativa já resolvida. */
function Footer() {
  return <SimFooter>{useProposalNarrative().footerNote}</SimFooter>;
}

/**
 * A proposta comercial inteira: hero, camada explicativa, simulador, painel de
 * resultado e as seções de escopo/compliance.
 *
 * Uma rota por canal de venda (/proposta para clínicas, /proposta/academias
 * para academias, /proposta/empresa para benefício corporativo) e todas montam
 * ESTE componente. O que `clientType` muda é só vocabulário; o que `mode` muda
 * é estrutura — passos, colunas das tabelas e o bloco que fecha a conta.
 *
 * Se um canal precisar apenas de texto próprio, o lugar é
 * `lib/proposta/narrative.ts`, não um fork desta árvore.
 */
export function ProposalExperience({
  clientType,
  topBarSubtitle,
  mode = 'revenda',
}: ProposalExperienceProps) {
  const beneficio = mode === 'beneficio';
  const copy = EXPLAINER_COPY[mode];

  return (
    <ProposalProvider clientType={clientType} mode={mode}>
      <ExplainerProvider chapters={beneficio ? EMPRESA_CHAPTERS : PROPOSTA_CHAPTERS}>
        <div className={`sim-root proposta${beneficio ? ' empresa' : ''}`}>
          <div className="shell">
            <SimTopBar
              subtitle={topBarSubtitle}
              pill={beneficio ? 'Simulador de benefício corporativo' : 'Simulador de proposta e DRE'}
            />
            <ProposalHero />

            <ExplainerSection kicker="Entenda antes de montar" title={copy.title} lead={copy.lead} />

            <div className="main-grid" id="simulador">
              <main className="panel">
                <SimulatorSteps mode={mode} />
              </main>
              {beneficio ? <BenefitResultPanel /> : <ProposalResultPanel />}
            </div>

            {beneficio ? <BenefitMobileBar /> : <ProposalMobileBar />}

            <IncludedSection />
            <ResponsibilitiesSection />
            <ComplianceSection />
            <RisksSection />
            <ContactSection />

            <Footer />
          </div>
        </div>
      </ExplainerProvider>
    </ProposalProvider>
  );
}
