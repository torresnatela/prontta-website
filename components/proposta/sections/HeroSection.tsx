'use client';

import { CLIENT_TYPE_IDS } from '@/lib/pricing';
import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { cn } from '@/lib/utils';
import { useProposal } from '../state/ProposalProvider';

export function HeroSection() {
  const { state, dispatch } = useProposal();
  const clientContent = PROPOSAL_CONTENT.clientTypes[state.clientType];

  return (
    <section className="bg-primary-navy text-white">
      <div className="container-custom section-padding">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-cyan mb-6">
          Proposta digital · {PROPOSAL_CONTENT.category}
        </p>

        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Tipo de cliente">
          {CLIENT_TYPE_IDS.map((clientType) => (
            <button
              key={clientType}
              type="button"
              aria-pressed={state.clientType === clientType}
              onClick={() => dispatch({ type: 'SET_CLIENT_TYPE', clientType })}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors',
                state.clientType === clientType
                  ? 'bg-primary-cyan border-primary-cyan text-white'
                  : 'bg-transparent border-white/25 text-white/80 hover:border-primary-cyan',
              )}
            >
              {PROPOSAL_CONTENT.clientTypes[clientType].label}
            </button>
          ))}
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl">
          {clientContent.headline.replace(clientContent.headlineTarget, '')}
          <span className="text-primary-cyan">{clientContent.headlineTarget}</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl">{PROPOSAL_CONTENT.subheadline}</p>
        <p className="mt-3 text-white/70 max-w-3xl">{clientContent.audienceNote}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#contato"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-primary-cyan text-white font-semibold hover:bg-white hover:text-primary-navy transition-colors"
          >
            {PROPOSAL_CONTENT.cta.primary}
          </a>
          <a
            href="#simulador"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:border-primary-cyan hover:text-primary-cyan transition-colors"
          >
            {PROPOSAL_CONTENT.cta.secondary}
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          {PROPOSAL_CONTENT.stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-primary-cyan/60 pl-4">
              <dd className="font-display text-3xl font-bold">{stat.value}</dd>
              <dt className="text-sm text-white/70 mt-1">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg mb-2">Como funciona</h2>
            <p className="text-sm text-white/75">{PROPOSAL_CONTENT.modelDescription}</p>
          </div>
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg mb-2">O que a Prontta não é</h2>
            <p className="text-sm text-white/75">{PROPOSAL_CONTENT.positioningNotIs}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
