'use client';

import { formatCurrency } from '@/lib/utils';
import { useDRE, useProposal, useProposalTotals } from '../state/ProposalProvider';

interface StickyBarProps {
  onGenerate: () => void;
  generating: boolean;
}

export function StickyBar({ onGenerate, generating }: StickyBarProps) {
  const { state } = useProposal();
  const totals = useProposalTotals();
  const dre = useDRE();

  const consultCount = state.consultationLines.reduce((sum, l) => sum + l.quantity, 0);
  const programCount = state.programSelections.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="stickybar">
      <div>
        <div className="tt">Total da simulação ao paciente</div>
        <div className="vv">{formatCurrency(totals.totalContractValue)}</div>
        <div className="mini">
          {consultCount} consultas · {programCount} programa(s)
        </div>
      </div>
      <div>
        <div className="tt">Resultado líquido estimado/mês</div>
        <div className="vv">{formatCurrency(dre.resultadoLiquido)}</div>
      </div>
      <button
        className="sbtn"
        type="button"
        style={{ fontSize: 15, padding: '14px 22px' }}
        onClick={onGenerate}
        disabled={generating}
      >
        {generating ? 'Gerando…' : 'Gerar proposta em PDF'}
      </button>
    </div>
  );
}
