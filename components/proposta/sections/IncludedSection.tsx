import { PROPOSAL_CONTENT } from '@/lib/proposal-content';

const c = PROPOSAL_CONTENT;

export function IncludedSection() {
  return (
    <section className="panel" id="escopo">
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot" aria-hidden="true">
              ✓
            </span>{' '}
            Escopo
          </div>
          <h2>O que está incluso e o que não está</h2>
        </div>
      </div>
      <div className="twocol">
        <div className="box in">
          <span className="tag in">Incluso</span>
          <ul>
            {c.scope.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="box out">
          <span className="tag out">Não incluso</span>
          <ul>
            {c.scope.notIncluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="note">{c.softwareRule}</p>
      <p className="note">
        <b>Taxa de implementação:</b> {c.implantation.label}. {c.implantation.note}
      </p>
    </section>
  );
}
