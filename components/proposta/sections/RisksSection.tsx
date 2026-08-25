import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function RisksSection() {
  return (
    <section className="panel">
      <div className="twocol">
        <div className="riskbox">
          <b>Riscos e limitações.</b>
          <p>{c.risks}</p>
        </div>
        <div className="riskbox">
          <b>Responsabilidade por infraestrutura.</b>
          <p>{c.holdHarmless}</p>
        </div>
      </div>
      <p className="note">{c.addonsNote}</p>
    </section>
  );
}
