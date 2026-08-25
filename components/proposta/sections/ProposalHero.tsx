'use client';

import { ChapterCue } from '@/components/simulador/shared/ChapterCue';
import { HeroMedia } from '@/components/simulador/shared/HeroMedia';
import { PROPOSTA_HERO_IMAGE } from '@/lib/proposta/videos';
import { useProposalNarrative } from '../state/ProposalProvider';

/**
 * Hero da proposta.
 *
 * A manchete e o card de exemplo vêm da narrativa já resolvida pelo modo e pelo
 * canal: na revenda o card mostra receita e margem, no benefício mostra
 * investimento e custo por colaborador. Os dois espelham o mix semente
 * carregado no simulador logo abaixo.
 */
export function ProposalHero() {
  const c = useProposalNarrative();
  const example = c.heroExample;

  return (
    <section className="hero" aria-label="Proposta comercial Prontta Saúde">
      <HeroMedia src={PROPOSTA_HERO_IMAGE} />
      <div className="hero-content">
        <div className="eyebrow">{c.category}</div>
        <h1>{c.headline}</h1>
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
            {example.stats.map((stat) => (
              <div key={stat.label}>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
          <p>{example.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
