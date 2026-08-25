'use client';

import { useProposal } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

export function SellerFields() {
  const { state, dispatch } = useProposal();

  return (
    <section id="passo-vendedor">
      <StepHeader
        step={6}
        tag="Assine a proposta"
        title="Seus dados de consultor"
        lead="Entram na página de contato do PDF. Em branco, a proposta sai com os dados institucionais da Prontta."
        chapterId="pdf"
      />
      <div className="frow">
        <label style={{ flex: '1 1 220px' }}>
          Nome do consultor
          <input
            type="text"
            placeholder="Ex.: Leonardo Diniz"
            value={state.seller.name}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { name: e.currentTarget.value } })}
          />
        </label>
        <label style={{ flex: '1 1 220px' }}>
          E-mail
          <input
            type="email"
            placeholder="voce@pronttasaude.com.br"
            value={state.seller.email}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { email: e.currentTarget.value } })}
          />
        </label>
        <label style={{ flex: '1 1 180px' }}>
          Telefone
          <input
            type="tel"
            placeholder="(31) 90000-0000"
            value={state.seller.phone}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { phone: e.currentTarget.value } })}
          />
        </label>
      </div>
    </section>
  );
}
