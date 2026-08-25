'use client';

import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import { siteConfig } from '@/lib/site-config';
import { useProposal } from '../state/ProposalProvider';

const c = PROPOSAL_CONTENT;

export function ContactSection() {
  const { state } = useProposal();
  // Sem consultor preenchido a proposta sai com os dados institucionais.
  const name = state.seller.name.trim() || siteConfig.name;
  const email = state.seller.email.trim() || siteConfig.contact.email;
  const phone = state.seller.phone.trim() || siteConfig.contact.phoneDisplay;

  return (
    <section className="panel" id="contato">
      <div className="section-head">
        <div>
          <div className="step-tag">
            <span className="step-dot" aria-hidden="true">
              →
            </span>{' '}
            Próximo passo
          </div>
          <h2>Vamos abrir o seu ponto Prontta?</h2>
          <p>
            Responda a esta proposta para agendarmos o alinhamento, formalizar o contrato e iniciar
            a implantação do seu ponto de acesso.
          </p>
        </div>
      </div>
      <div className="contact">
        <div className="info">
          <b>{name}</b>
          <span>
            {email} · {phone}
          </span>
        </div>
        <a className="cta" href={`mailto:${email}`}>
          {c.cta.primary}
        </a>
      </div>
      <p className="note">{c.proposalValidity}</p>
    </section>
  );
}
