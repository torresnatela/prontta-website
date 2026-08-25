import type { Metadata } from 'next';
import { ProposalExperience } from '@/components/proposta/ProposalExperience';

export const metadata: Metadata = {
  title: 'Proposta e Simulador para academias',
  description:
    'Monte a proposta de Programas de Saúde Assistida e consultas por telessaúde para uma academia e simule o resultado da operação com a Prontta Saúde.',
  alternates: { canonical: '/proposta/academias' },
};

/**
 * Mesma proposta de /proposta, aberta no canal academia: a headline do hero e o
 * rótulo salvo no painel falam de academia; a matemática é idêntica.
 *
 * Mora sob /proposta (e não sob /academias) de propósito: é a ferramenta do
 * parceiro montando uma proposta, irmã de /proposta. /academias/* é a vitrine
 * do dono da academia — outro público, outro vocabulário.
 */
export default function PropostaAcademiasPage() {
  return <ProposalExperience clientType="academia" topBarSubtitle="Proposta comercial · academias" />;
}
