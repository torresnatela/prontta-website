import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function ResponsibilitiesSection() {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot" aria-hidden="true">
              §
            </span>{' '}
            Segurança jurídica
          </div>
          <h2>Quem responde por quê</h2>
        </div>
      </div>
      <div className="resp">
        {c.responsibilities.map((item) => (
          <div className="ritem" key={item.party}>
            <div className="who">
              <span className="b" />
              {item.party}
            </div>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
