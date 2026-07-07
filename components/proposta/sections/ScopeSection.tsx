'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { SectionShell } from '../shared/SectionShell';

export function ScopeSection() {
  return (
    <SectionShell
      id="escopo"
      kicker="Escopo da parceria"
      title="O que está incluso — e o que fica com você"
      subtitle="Papéis claros: a Prontta entrega a operação médica e a tecnologia; o parceiro entra com o espaço, a agenda e a recepção."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
          <h3 className="font-display font-bold text-lg text-emerald-800 mb-4">A Prontta entrega</h3>
          <ul className="space-y-3">
            {PROPOSAL_CONTENT.scope.included.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-emerald-900">
                <span aria-hidden className="mt-0.5 text-emerald-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-accent-light bg-accent-light/40 p-6">
          <h3 className="font-display font-bold text-lg text-primary-navy mb-4">Responsabilidade local do parceiro</h3>
          <ul className="space-y-3">
            {PROPOSAL_CONTENT.scope.notIncluded.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-primary-navy/90">
                <span aria-hidden className="mt-0.5 text-primary-cyan">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROPOSAL_CONTENT.responsibilities.map((responsibility) => (
          <div key={responsibility.party} className="rounded-2xl border border-accent-light p-5">
            <h4 className="font-display font-bold text-primary-navy mb-2">{responsibility.party}</h4>
            <p className="text-sm text-neutral-gray">{responsibility.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
