/**
 * Os dois modos comerciais da proposta.
 *
 * `revenda` é o modelo original: o parceiro compra pelo repasse, aplica a
 * própria margem, vende ao paciente e lê a DRE da operação dele.
 *
 * `beneficio` é a empresa que compra para OFERTAR ao colaborador. Ela não
 * revende — logo não há margem, não há repasse a exibir e não há DRE. O que
 * fecha a conta é o custo do benefício por colaborador e o retorno estimado.
 *
 * O modo mora no domínio (e não num `clientType === 'empresa'` espalhado pela
 * árvore) porque a diferença é ESTRUTURAL: muda os passos, as colunas das
 * tabelas e as páginas do PDF. `clientType` continua sendo só vocabulário.
 */
export type ProposalMode = 'revenda' | 'beneficio';

export const PROPOSAL_MODES: readonly ProposalMode[] = ['revenda', 'beneficio'] as const;

export function isProposalMode(value: unknown): value is ProposalMode {
  return value === 'revenda' || value === 'beneficio';
}
