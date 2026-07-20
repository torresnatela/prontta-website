'use client';

import { useGenerateProposal } from '../pdf/useGenerateProposal';
import { ConsultationsStep } from '../simulator/ConsultationsStep';
import { CostsStep } from '../simulator/CostsStep';
import { DREStep } from '../simulator/DREStep';
import { MarginsStep } from '../simulator/MarginsStep';
import { ProgramsStep } from '../simulator/ProgramsStep';
import { SellerFields } from '../simulator/SellerFields';
import { StickyBar } from '../simulator/StickyBar';

export function SimulatorSection() {
  const { generate, generating } = useGenerateProposal();

  return (
    <section className="reveal" id="simulador" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Simulador</span>
          <h2>Monte sua proposta e veja seu resultado</h2>
          <p className="muted">
            Mesmo racional da planilha oficial. Misture planos e agendas linha a linha, escolha sua
            margem e gere a proposta em PDF.
          </p>
        </div>

        <div className="sg">
          <MarginsStep />
          <ConsultationsStep />
          <ProgramsStep />
          <div className="sg duo">
            <CostsStep />
            <DREStep />
          </div>
          <SellerFields />
        </div>

        <StickyBar onGenerate={generate} generating={generating} />
      </div>
    </section>
  );
}
