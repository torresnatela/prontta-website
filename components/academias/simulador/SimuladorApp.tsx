'use client';

import { getAcademiaProgram } from '@/lib/academias/catalog';
import { AcademiaFooter, AcademiaTopBar } from '../shared/AcademiaChrome';
import { BelowSections } from './BelowSections';
import { DREPanel } from './DREPanel';
import { MobileResultBar, ResultPanel } from './ResultPanel';
import { CycleStep, OfferPreview, PriceStep, ProgramStep } from './StepsColumn';
import { SimuladorProvider, useSimulador } from './state/SimuladorProvider';

function Hero() {
  return (
    <section className="hero" aria-label="Simulador de receita para academias">
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
function SimuladorShell() {
  const { state } = useSimulador();
  const theme = getAcademiaProgram(state.programId).theme;

  return (
    <div className="academias-root sim" data-theme={theme}>
      <div className="shell">
        <AcademiaTopBar
          subtitle="Simulador para academias"
          pill="Receita recorrente com saúde assistida"
        />
        <Hero />

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

export function SimuladorApp() {
  return (
    <SimuladorProvider>
      <SimuladorShell />
    </SimuladorProvider>
  );
}
