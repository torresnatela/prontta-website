import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function ResponsibilitiesSection() {
  return (
    <section className="reveal">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Segurança jurídica</span>
          <h2>Quem responde por quê</h2>
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
      </div>
    </section>
  );
}
