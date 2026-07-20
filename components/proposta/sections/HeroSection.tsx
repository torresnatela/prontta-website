'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { formatCurrency } from '@/lib/utils';
import { useProposal } from '../state/ProposalProvider';

const c = PROPOSAL_CONTENT;

export function HeroSection() {
  const { state } = useProposal();
  const clientType = c.clientTypes[state.clientType];
  const example = c.heroExample;

  return (
    <header className="hero">
      <div className="wrap grid">
        <div>
          <span className="eyebrow">{c.category}</span>
          <h1 style={{ marginTop: 12 }}>{clientType.headline}</h1>
          <p className="sub">{c.subheadline}</p>
          <p className="desc">{c.modelDescription}</p>
          <div className="chips">
            <span className="chip">{c.numEspecialistas}</span>
            <span className="chip">{c.numEspecialidades}</span>
            <span className="chip">Ciclos de {c.ciclos}</span>
          </div>
          <div className="btns">
            <a className="btn primary" href="#contato">
              {c.cta.primary}
            </a>
            <a className="btn ghost" href="#simulador">
              {c.cta.secondary}
            </a>
          </div>
        </div>

        <div className="simcard">
          <h3>{example.title}</h3>
          <p style={{ fontSize: 13, color: '#C9DDEA', margin: '2px 0 10px' }}>{example.note}</p>
          <div className="simrow">
            <span className="k">Receita estimada / mês</span>
            <span className="v">{formatCurrency(example.receita)}</span>
          </div>
          <div className="simrow">
            <span className="k">Resultado líquido / mês</span>
            <span className="v big">{formatCurrency(example.resultadoLiquido)}</span>
          </div>
          <div className="simrow">
            <span className="k">Margem líquida</span>
            <span className="v">
              {example.margemLiquida.toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              %
            </span>
          </div>
          <a
            href="#simulador"
            className="btn primary"
            style={{ display: 'block', textAlign: 'center', marginTop: 14 }}
          >
            Simular com meus números
          </a>
          <p className="muted" style={{ fontSize: 12, marginTop: 12, color: '#9FC0D3' }}>
            {example.disclaimer}
          </p>
        </div>
      </div>
    </header>
  );
}
