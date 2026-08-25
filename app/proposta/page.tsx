import type { Metadata } from 'next';
import { ProposalExperience } from '@/components/proposta/ProposalExperience';

export const metadata: Metadata = {
  title: 'Proposta e Simulador',
  description:
    'Monte sua proposta de Programas de Saúde Assistida e consultas por telessaúde e simule o resultado da sua operação com a Prontta Saúde.',
  alternates: { canonical: '/proposta' },
};

export default function PropostaPage() {
  return <ProposalExperience clientType="clinica" topBarSubtitle="Proposta comercial" />;
}
