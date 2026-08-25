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
 * Mora sob /proposta (e não sob /academias) de propósito: é ferramenta de
 * parceiro, e o `proxy.ts` já exige login em `/proposta/:path*`. /academias/* é
 * a vitrine pública, aberta ao dono da academia.
 */
export default function PropostaAcademiasPage() {
  return <ProposalExperience clientType="academia" topBarSubtitle="Proposta comercial · academias" />;
}
