'use client';

import { ChapterCue } from '@/components/simulador/shared/ChapterCue';
import { HeroMedia } from '@/components/simulador/shared/HeroMedia';
import { PROPOSTA_HERO_IMAGE } from '@/lib/proposta/videos';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useProposal } from '../state/ProposalProvider';

const c = PROPOSAL_CONTENT;

/**
 * Hero da proposta.
 *
 * A manchete muda conforme `state.clientType` (academia, clínica, farmácia…):
 * o mesmo link serve a todos os canais, e quem abre vê o vocabulário do seu.
 * O card à direita mostra o exemplo de `PROPOSAL_CONTENT.heroExample`, que
 * espelha o mix semente já carregado no simulador logo abaixo.
 */
export function ProposalHero() {
  const { state } = useProposal();
  const clientType = c.clientTypes[state.clientType];
  const example = c.heroExample;

  return (
    <section className="hero" aria-label="Proposta comercial Prontta Saúde">
      <HeroMedia src={PROPOSTA_HERO_IMAGE} />
      <div className="hero-content">
        <div className="eyebrow">{c.category}</div>
        <h1>{clientType.headline}</h1>
        <p>{c.subheadline}</p>

        <div className="hero-actions">
          <a className="hero-cta" href="#simulador">
            Montar minha proposta
          </a>
          <ChapterCue
            chapterId="visao-geral"
            label="Ver como funciona · 2 min"
            labelImagem="Entender antes de montar"
          />
          <a className="hero-link" href="#contato">
            {c.cta.primary} →
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <b aria-hidden="true">✓</b> {c.numEspecialistas}
          </div>
          <div className="hero-stat">
            <b aria-hidden="true">↗</b> {c.numEspecialidades}
          </div>
          <div className="hero-stat">
            <b aria-hidden="true">R$</b> Ciclos de {c.ciclos}
          </div>
        </div>

        <div className="hero-example">
          <div className="hero-example-head">
            <strong>{example.title}</strong>
            <small>{example.note}</small>
          </div>
          <div className="hero-example-grid">
            <div>
              <small>Receita estimada / mês</small>
              <strong>{formatCurrency(example.receita)}</strong>
            </div>
            <div>
              <small>Resultado líquido / mês</small>
              <strong>{formatCurrency(example.resultadoLiquido)}</strong>
            </div>
            <div>
              <small>Margem líquida</small>
              <strong>{formatPercent(example.margemLiquida)}</strong>
            </div>
          </div>
          <p>{example.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
