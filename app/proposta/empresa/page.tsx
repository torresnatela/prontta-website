import type { Metadata } from 'next';
import { ProposalExperience } from '@/components/proposta/ProposalExperience';

export const metadata: Metadata = {
  title: 'Proposta de benefício corporativo',
  description:
    'Monte a proposta de saúde assistida como benefício para os colaboradores de uma empresa: custo por colaborador, modelo de custeio e retorno estimado.',
  alternates: { canonical: '/proposta/empresa' },
};

/**
 * Mesma proposta de /proposta, no modo BENEFÍCIO: a empresa compra consultas e
 * Programas de Saúde para ofertar ao colaborador, e não para revender.
 *
 * Por isso não há margem, não há DRE e não há repasse na tela — o que fecha a
 * conta é o custo por colaborador e o retorno estimado. A diferença é
 * estrutural, e por isso vive num `mode` do domínio e não num `clientType`:
 * ver `lib/proposta/mode.ts`, `lib/empresa/pricing.ts` e `lib/empresa/content.ts`.
 */
export default function PropostaEmpresaPage() {
  return (
    <ProposalExperience
      mode="beneficio"
      clientType="empresa"
      topBarSubtitle="Proposta de benefício · empresas"
    />
  );
}
