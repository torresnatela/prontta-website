'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { SectionShell } from '../shared/SectionShell';

export function ComplianceSection() {
  return (
    <SectionShell
      id="compliance"
      kicker="Segurança e compliance"
      title="Um modelo desenhado dentro das regras"
      subtitle="Telessaúde assistida com limites claros de atuação, proteção de dados e responsabilidade técnica médica."
      tone="muted"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROPOSAL_CONTENT.compliance.map((item) => (
          <div key={item.title} className="rounded-2xl border border-accent-light bg-white p-6">
            <h3 className="font-display font-bold text-primary-navy mb-2">{item.title}</h3>
            <p className="text-sm text-neutral-gray">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-accent-light bg-white p-6">
        <p className="text-xs uppercase tracking-widest text-primary-cyan font-semibold mb-2">Marco legal</p>
        <p className="text-sm text-primary-navy">{PROPOSAL_CONTENT.legalFramework}</p>
      </div>
    </SectionShell>
  );
}
