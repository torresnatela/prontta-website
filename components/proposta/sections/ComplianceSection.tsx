import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function ComplianceSection() {
  return (
    <section className="band">
      <div className="step-tag">
        <span className="step-dot" aria-hidden="true">
          ✓
        </span>{' '}
        Compliance
      </div>
      <h2>Feito dentro da regra, por definição</h2>
      <p className="band-lead">{c.legalFramework}</p>
      <div className="clist">
        {c.compliance.map((item) => (
          <div className="cli" key={item.title}>
            <span className="mk" aria-hidden="true">
              ✓
            </span>
            <span>
              <b>{item.title}.</b> {item.description}
            </span>
          </div>
        ))}
      </div>
      <div className="notbe">{c.positioningNotIs}</div>
    </section>
  );
}
