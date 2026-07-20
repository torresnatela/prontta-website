import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function RisksSection() {
  return (
    <section className="reveal">
      <div className="wrap">
        <div className="twocol">
          <div className="riskbox">
            <b>Riscos e limitações.</b>
            <p style={{ margin: '.4em 0 0' }}>{c.risks}</p>
          </div>
          <div className="riskbox">
            <b>Responsabilidade por infraestrutura.</b>
            <p style={{ margin: '.4em 0 0' }}>{c.holdHarmless}</p>
          </div>
        </div>
        <p className="note">{c.addonsNote}</p>
      </div>
    </section>
  );
}
