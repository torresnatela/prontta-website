'use client';

import { formatCurrency, formatPercent } from '@/lib/utils';
import { useDRE } from '../state/ProposalProvider';
import { StepHeader } from './StepHeader';

export function DREStep() {
  const dre = useDRE();

  return (
    <section id="resultado">
      <StepHeader
        step={5}
        tag="Leia o resultado"
        title="Sua DRE do mês"
        lead="O que sobra depois do repasse à Prontta, dos seus impostos e das suas despesas."
        chapterId="dre"
      />
      <div className="dre-line">
        <span>Receita bruta/mês</span>
        <strong>{formatCurrency(dre.receitaBruta)}</strong>
      </div>
      <div className="dre-line">
        <span>Repasse à Prontta</span>
        <strong>{formatCurrency(dre.repasse)}</strong>
      </div>
      <div className="dre-line">
        <span>Margem bruta</span>
        <strong>{formatCurrency(dre.margemBruta)}</strong>
      </div>
      <div className="dre-line">
        <span>Despesas do mês</span>
        <strong>{formatCurrency(dre.totalDespesas)}</strong>
      </div>
      <div className="dre-line">
        <span>Margem líquida</span>
        <strong>{formatPercent(dre.margemLiquidaPct)}</strong>
      </div>
    </section>
  );
}
