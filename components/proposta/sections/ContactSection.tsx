'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { siteConfig } from '@/lib/site-config';
import { useProposal } from '../state/ProposalProvider';

const c = PROPOSAL_CONTENT;

export function ContactSection() {
  const { state } = useProposal();
  const name = state.seller.name.trim() || siteConfig.name;
  const email = state.seller.email.trim() || siteConfig.contact.email;
  const phone = state.seller.phone.trim() || siteConfig.contact.phoneDisplay;

  return (
    <section className="cta-final reveal" id="contato">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Próximo passo</span>
          <h2>Vamos abrir o seu ponto Prontta?</h2>
          <p className="muted">
            Responda a esta proposta para agendarmos o alinhamento, formalizar o contrato e iniciar a
            implantação do seu ponto de acesso.
          </p>
        </div>
        <div className="contact">
          <div className="info">
            <b>{name}</b>
            <span className="muted">
              {email} · {phone}
            </span>
          </div>
          <a className="btn primary" href={`mailto:${email}`}>
            {c.cta.primary}
          </a>
        </div>
        <p className="note">{c.proposalValidity}</p>
      </div>
    </section>
  );
}
