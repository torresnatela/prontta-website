'use client';

import { getAcademiaProgram } from '@/lib/academias/catalog';
import { SIMULADOR_CHAPTERS } from '@/lib/academias/videos';
import { AcademiaFooter, AcademiaTopBar } from '../shared/AcademiaChrome';
import { ChapterCue } from '../shared/ChapterCue';
import { ExplainerProvider, type ExplainerMedia } from '../shared/ExplainerProvider';
import { ExplainerSection } from '../shared/ExplainerSection';
import { HeroMedia } from '../shared/HeroMedia';
import { BelowSections } from './BelowSections';
import { DREPanel } from './DREPanel';
import { MobileResultBar, ResultPanel } from './ResultPanel';
import { CycleStep, OfferPreview, PriceStep, ProgramStep } from './StepsColumn';
import { SimuladorProvider, useSimulador } from './state/SimuladorProvider';

function Hero() {
  return (
    <section className="hero" aria-label="Simulador de receita para academias">
      <HeroMedia />
      <div className="hero-content">
        <div className="eyebrow">Prontta Saúde para Academias</div>
        <h1>Simule uma nova fonte de receita para sua academia.</h1>
        <p>
          Programas de saúde que geram resultado para seus alunos e receita recorrente para o seu
          negócio — com médicos, nutrição e psicologia por telessaúde.
        </p>
        <div className="hero-actions">
          <a className="hero-cta" href="#simulador">
            Simular agora gratuitamente
          </a>
          <ChapterCue
            chapterId="visao-geral"
            label="Ver como funciona · 2 min"
            labelImagem="Entender antes de simular"
          />
          <a className="hero-link" href="#resultado">
            Ver o resultado →
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <b aria-hidden="true">✓</b> Ciclos de 3, 6 ou 12 meses
          </div>
          <div className="hero-stat">
            <b aria-hidden="true">↗</b> Receita recorrente e previsível
          </div>
          <div className="hero-stat">
            <b aria-hidden="true">R$</b> Margem calculada em tempo real
          </div>
        </div>
      </div>
    </section>
  );
}

/** Precisa estar dentro do provider para ler o tema do programa selecionado. */
function SimuladorShell({ media }: { media: ExplainerMedia }) {
  const { state } = useSimulador();
  const theme = getAcademiaProgram(state.programId).theme;
  const isVideo = media === 'video';

  return (
    <div className="academias-root sim" data-theme={theme}>
      <div className="shell">
        <AcademiaTopBar
          subtitle="Simulador para academias"
          pill="Receita recorrente com saúde assistida"
        />
        <Hero />

        <ExplainerSection
          kicker="Entenda antes de simular"
          title={
            isVideo
              ? 'Quatro vídeos curtos e você domina a conta inteira'
              : 'Quatro passos e você domina a conta inteira'
          }
          lead={
            isVideo
              ? 'Do que é um programa de saúde até como ler a DRE do mês. Assista na ordem ou pule direto para a dúvida que você tem agora.'
              : 'Do que é um programa de saúde até como ler a DRE do mês. Leia na ordem ou pule direto para a dúvida que você tem agora.'
          }
          variantHref={isVideo ? '/academias/simulador/sem-video' : '/academias/simulador'}
        />

        <div className="main-grid" id="simulador">
          <main className="panel">
            <ProgramStep />
            <div className="divider" />
            <CycleStep />
            <div className="divider" />
            <OfferPreview />
            <div className="divider" />
            <PriceStep />
            <DREPanel />
          </main>
          <ResultPanel />
        </div>

        <MobileResultBar />
        <BelowSections />

        <AcademiaFooter>Simulador comercial · Prontta Saúde para Academias</AcademiaFooter>
      </div>
    </div>
  );
}

interface SimuladorAppProps {
  /** `imagem` monta a variante /sem-video: mesma explicação, sem player. */
  media?: ExplainerMedia;
}

export function SimuladorApp({ media = 'video' }: SimuladorAppProps = {}) {
  return (
    <SimuladorProvider>
      <ExplainerProvider chapters={SIMULADOR_CHAPTERS} media={media}>
        <SimuladorShell media={media} />
      </ExplainerProvider>
    </SimuladorProvider>
  );
}
