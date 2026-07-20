import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function ComplianceSection() {
  return (
    <section className="band reveal">
      <div className="wrap">
        <span className="eyebrow">Compliance</span>
        <h2 style={{ marginTop: 8 }}>Feito dentro da regra, por definição</h2>
        <p style={{ maxWidth: '60ch', color: '#BCD6E4' }}>{c.legalFramework}</p>
        <div className="clist">
          {c.compliance.map((item) => (
            <div className="cli" key={item.title}>
              <span className="mk">✓</span>
              <span>
                <b>{item.title}.</b> {item.description}
              </span>
            </div>
          ))}
        </div>
        <div className="notbe">{c.positioningNotIs}</div>
      </div>
    </section>
  );
}
