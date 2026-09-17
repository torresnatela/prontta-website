import type { Metadata } from 'next';
import { ProposalExperience } from '@/components/proposta/ProposalExperience';

export const metadata: Metadata = {
  title: 'Proposta e Simulador para clínicas',
  description:
    'Monte a proposta de Programas de Saúde Assistida e consultas por telessaúde para uma clínica e simule o resultado da operação com a Prontta Saúde.',
  alternates: { canonical: '/proposta/clinicas' },
};

/**
 * A proposta no canal clínica — a rota "padrão" do parceiro comercial.
 *
 * `/proposta` (sem sufixo) redireciona para cá em `next.config.js`: os links
 * institucionais (header, footer, CTAs, painel) apontam direto para esta URL,
 * e a raiz existe só para não quebrar link antigo.
 *
 * Irmã de `/proposta/academias` e `/proposta/empresa`: mesmo componente, o que
 * muda é o canal (vocabulário) — e, na empresa, o modo (estrutura).
 */
export default function PropostaClinicasPage() {
  return <ProposalExperience clientType="clinica" topBarSubtitle="Proposta comercial · clínicas" />;
}
