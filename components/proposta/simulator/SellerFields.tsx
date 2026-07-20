'use client';

import { useProposal } from '../state/ProposalProvider';

export function SellerFields() {
  const { state, dispatch } = useProposal();

  return (
    <div className="sc">
      <h3>
        <span className="n">6</span>Seus dados (aparecem na proposta em PDF)
      </h3>
      <div className="frow">
        <label style={{ flex: '1 1 220px' }}>
          Nome do consultor
          <input
            type="text"
            placeholder="Ex.: Leonardo Diniz"
            defaultValue={state.seller.name}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { name: e.currentTarget.value } })}
          />
        </label>
        <label style={{ flex: '1 1 220px' }}>
          E-mail
          <input
            type="email"
            placeholder="voce@pronttasaude.com.br"
            defaultValue={state.seller.email}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { email: e.currentTarget.value } })}
          />
        </label>
        <label style={{ flex: '1 1 180px' }}>
          Telefone
          <input
            type="tel"
            placeholder="(31) 90000-0000"
            defaultValue={state.seller.phone}
            onChange={(e) => dispatch({ type: 'SET_SELLER', patch: { phone: e.currentTarget.value } })}
          />
        </label>
      </div>
    </div>
  );
}
