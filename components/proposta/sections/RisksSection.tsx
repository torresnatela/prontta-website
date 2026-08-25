'use client';

import { useProposalNarrative } from '../state/ProposalProvider';


export function RisksSection() {
  const c = useProposalNarrative();

  return (
    <section className="panel">
      <div className="twocol">
        <div className="riskbox">
          <b>Riscos e limitações.</b>
          <p>{c.risks}</p>
        </div>
        <div className="riskbox">
          <b>{c.holdHarmlessTitle}.</b>
          <p>{c.holdHarmless}</p>
        </div>
      </div>
      <p className="note">{c.addonsNote}</p>
    </section>
  );
}
