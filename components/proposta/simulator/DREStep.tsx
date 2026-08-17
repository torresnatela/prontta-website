'use client';

import { formatCurrency, formatPercent } from '@/lib/utils';
import { useDRE } from '../state/ProposalProvider';

export function DREStep() {
  const dre = useDRE();

  return (
    <div className="sc">
      <h3>
        <span className="n">5</span>Seu resultado (DRE)
      </h3>
      <div className="trow">
        <span>Receita bruta/mês</span>
        <b>{formatCurrency(dre.receitaBruta)}</b>
      </div>
      <div className="trow">
        <span>Repasse à Prontta</span>
        <b>{formatCurrency(dre.repasse)}</b>
      </div>
      <div className="trow">
        <span>Margem bruta</span>
        <b>{formatCurrency(dre.margemBruta)}</b>
      </div>
      <div className="trow">
        <span>Despesas do mês</span>
        <b>{formatCurrency(dre.totalDespesas)}</b>
      </div>
      <div className="trow">
        <span>Margem líquida</span>
        <b>{formatPercent(dre.margemLiquidaPct)}</b>
      </div>
    </div>
  );
}
