import { PROPOSAL_CONTENT } from '@/lib/proposal-content';
import type {
  NarrativeComplianceItem,
  NarrativeParty,
  ProposalNarrative,
} from '@/lib/proposta/narrative';
import type { ServiceModel } from './pricing';

/**
 * Conteúdo narrativo do canal EMPRESA — saúde assistida como benefício.
 *
 * Não é uma tradução do texto de revenda. O comprador aqui não revende, não tem
 * margem e não opera nada: ele contrata para ofertar ao colaborador. Isso muda
 * quem responde pelo quê, e muda sobretudo o compliance — metade dos itens da
 * revenda (dicotomia CFM sobre remuneração de parceiro leigo, canal de vendas
 * com MEI/CNPJ) não tem sujeito nesta proposta, e o que a empresa precisa
 * (não é plano de saúde, RH não vê dado clínico, não substitui ocupacional)
 * não existe do outro lado.
 *
 * ⚠️ REVISÃO JURÍDICA PENDENTE — nenhum PDF deve ir a cliente antes disso.
 * Pontos que precisam de parecer, em ordem de impacto:
 *
 *  1. Fronteira com plano de saúde (Lei 9.656/1998 e a exigência de registro de
 *     operadora na ANS). O argumento aqui é que o produto fica de fora por ser
 *     serviço enumerado, com prazo determinado, sem cobertura de custo
 *     assistencial, sem reembolso, sem rede de livre escolha e sem assunção de
 *     risco. Cada um desses pontos precisa ser confirmado.
 *  2. Desconto em folha (CLT, art. 462 e Súmula TST 342). A Súmula enumera
 *     planos de saúde — e esta proposta afirma NÃO ser um. Essa tensão é real e
 *     não foi resolvida aqui: confirmar se o desconto é lícito neste desenho,
 *     e a forma da autorização (prévia, específica, revogável).
 *  3. Natureza salarial (CLT, art. 458, §2º, IV e §5º). O RH vai perguntar na
 *     primeira reunião se o benefício integra salário. Não há texto sobre isso
 *     aqui de propósito — falta parecer.
 *  4. LGPD: base legal do dado clínico (art. 11) e papéis de controlador /
 *     operador entre empresa e Prontta (art. 42).
 *  5. Sigilo profissional perante o empregador (Código de Ética Médica) e
 *     normas dos conselhos não médicos (CFP, CFN, CFFa), já que os programas
 *     corporativos são dominados por psicologia e nutrição.
 *
 * ⚠️ NUNCA escrever "a preço de custo". O divisor 0,37 do engine é
 * `1 − margem 0,40 − infra 0,08 − imposto 0,15`: a margem da Prontta já está
 * dentro do repasse. O termo correto é "preço Prontta ao contratante".
 */

const base = PROPOSAL_CONTENT;

/** Escopo e implantação dependem de onde o colaborador é atendido. */
const SCOPE_BY_SERVICE_MODEL: Record<
  ServiceModel,
  { included: readonly string[]; notIncluded: readonly string[] }
> = {
  ponto_de_acesso: {
    included: [
      'Operação médica completa: recrutamento, escala e responsabilidade técnica dos especialistas',
      'Plataforma de telessaúde e IA de pré-triagem',
      'Implantação do ponto de acesso, treinamento da equipe interna e suporte contínuo',
      'Gestão da jornada assistencial e curadoria da rede médica',
      'Materiais de divulgação interna e apoio à campanha de adesão',
      'Relatórios agregados e anonimizados de uso do benefício',
    ],
    notIncluded: [
      'Sala, mobiliário e infraestrutura local (energia, internet)',
      'Agendamento e recepção, feitos pela equipe da empresa',
      'Qualquer ato de saúde presencial no ponto de acesso (vedado)',
      'Exames ocupacionais, ASO e PCMSO — o serviço é assistencial, não ocupacional',
      'Medicamentos, exames de imagem e procedimentos',
    ],
  },
  remoto: {
    included: [
      'Operação médica completa: recrutamento, escala e responsabilidade técnica dos especialistas',
      'Plataforma de telessaúde e IA de pré-triagem, acessível de onde o colaborador estiver',
      'Onboarding do benefício, treinamento do RH e suporte contínuo',
      'Gestão da jornada assistencial e curadoria da rede médica',
      'Materiais de divulgação interna e apoio à campanha de adesão',
      'Relatórios agregados e anonimizados de uso do benefício',
    ],
    notIncluded: [
      'Dispositivo e conexão de internet do colaborador',
      'Ambiente reservado para a consulta durante a jornada de trabalho',
      'Exames ocupacionais, ASO e PCMSO — o serviço é assistencial, não ocupacional',
      'Medicamentos, exames de imagem e procedimentos',
    ],
  },
};

const MODEL_DESCRIPTION: Record<ServiceModel, string> = {
  ponto_de_acesso:
    'Um ponto de acesso digital dentro da empresa: o RH cede uma sala reservada e a Prontta cuida da operação médica, da tecnologia, do treinamento e do suporte. O colaborador agenda e se consulta ali mesmo, por telessaúde.',
  remoto:
    'Sem sala, sem obra e sem equipamento na empresa: o colaborador acessa do celular ou do computador, de onde estiver. O RH entra com a comunicação e a base de elegíveis; a Prontta cuida do resto.',
};

const IMPLANTATION_STEPS: Record<ServiceModel, readonly string[]> = {
  ponto_de_acesso: [
    'Alinhamento do escopo, do modelo de custeio e assinatura do contrato.',
    'Preparação do ponto de acesso na empresa e integração da agenda.',
    'Envio da base de elegíveis e configuração dos acessos, sob acordo de tratamento de dados.',
    'Campanha de comunicação interna e abertura da adesão, com TCLE digital.',
    'Operação assistida, suporte contínuo e relatórios agregados de uso ao RH.',
  ],
  remoto: [
    'Alinhamento do escopo, do modelo de custeio e assinatura do contrato.',
    'Envio da base de elegíveis e configuração dos acessos, sob acordo de tratamento de dados.',
    'Onboarding digital do colaborador, com TCLE antes de qualquer coleta.',
    'Campanha de comunicação interna e abertura da adesão, sem obra e sem sala.',
    'Operação assistida, suporte contínuo e relatórios agregados de uso ao RH.',
  ],
};

const IMPLANTATION_BY_SERVICE_MODEL: Record<ServiceModel, { label: string; note: string }> = {
  ponto_de_acesso: {
    label: base.implantation.label,
    note: 'Taxa única de implantação do ponto de acesso (R$ 10 mil a R$ 15 mil), a combinar ou isenta conforme negociação.',
  },
  remoto: {
    label: 'Não aplicável',
    note: 'O modelo remoto não tem ponto de acesso físico: não há obra, mobiliário nem taxa de implantação.',
  },
};

const RESPONSIBILITIES: readonly NarrativeParty[] = [
  {
    party: 'Prontta',
    description:
      'Plataforma, IA de pré-triagem, gestão da jornada, curadoria e responsabilidade técnica da rede médica.',
  },
  {
    party: 'Empresa contratante',
    description:
      'Contrata o benefício, divulga internamente e acompanha os indicadores agregados. Não participa do ato médico e não acessa dados clínicos do colaborador.',
  },
  {
    party: 'Médico',
    description:
      'Responsável pelo ato médico e pela prescrição, via telessaúde, sob seu CRM (responsabilidade técnica na sede, CRM-MG).',
  },
  {
    party: 'Colaborador',
    description:
      'Titular dos dados de saúde; adere de forma voluntária e consente por TCLE digital antes de qualquer coleta.',
  },
];

/** Itens válidos nos dois modelos de atendimento. */
const COMPLIANCE_COMMON: readonly NarrativeComplianceItem[] = [
  {
    title: 'Benefício de saúde, não plano de saúde',
    description:
      'A Prontta não é operadora de plano ou seguro-saúde e não é registrada na ANS. O benefício dá acesso às consultas e aos programas efetivamente contratados — não há cobertura assistencial garantida, rede credenciada obrigatória, carência ou reembolso, e ele não substitui plano de saúde.',
  },
  {
    title: 'A empresa não acessa dados clínicos',
    description:
      'O titular dos dados de saúde é o colaborador. A empresa não acessa prontuário, diagnóstico, prescrição nem a identificação de quem utilizou o benefício: o RH recebe apenas indicadores agregados e anonimizados.',
  },
  {
    title: 'Adesão voluntária',
    description:
      'A adesão é do colaborador, voluntária e revogável a qualquer tempo. Não aderir não pode gerar prejuízo, distinção ou qualquer consequência funcional.',
  },
  {
    title: 'Saúde não decide emprego',
    description:
      'Adesão, uso do benefício ou qualquer informação de saúde não podem ser usados para selecionar, avaliar, promover, remanejar ou desligar colaboradores, nem para excluir alguém do benefício.',
  },
  {
    title: 'Urgência e emergência não são escopo',
    description:
      'O programa é de cuidado agendado e continuado. Em urgência ou emergência, o colaborador deve acionar o SAMU (192) ou a rede de urgência — o benefício não cobre internação, pronto-socorro, exames de imagem nem procedimentos.',
  },
  {
    title: 'Não substitui a medicina ocupacional',
    description:
      'O serviço é assistencial. Não substitui PCMSO, ASO ou exames ocupacionais (NR-7), e nenhum atendimento aqui gera atestado de aptidão para o trabalho.',
  },
  {
    title: 'Coparticipação e desconto em folha',
    description:
      'Havendo coparticipação descontada em folha, o desconto depende de autorização prévia e expressa do colaborador (CLT, art. 462).',
  },
  {
    title: 'IA de pré-triagem, não de diagnóstico',
    description: base.aiDisclaimer,
  },
  {
    title: 'Sem vínculo entre as partes',
    description:
      'Não há vínculo empregatício, societário ou de subordinação entre Prontta e empresa, nem entre Prontta e colaborador. Cada parte responde por seus próprios encargos.',
  },
  {
    title: 'LGPD e consentimento',
    description:
      'Dados tratados conforme a LGPD; base legal, finalidade e retenção informadas ao titular. Dado de saúde é dado sensível (art. 11) e trafega criptografado, restrito à Prontta e ao médico assistente.',
  },
  {
    title: 'Propriedade intelectual da Prontta',
    description:
      'Marca, plataforma, IA, metodologia e conteúdos são de titularidade exclusiva da Prontta; o contrato não importa cessão ou licença.',
  },
];

/** Só faz sentido quando existe um ponto de acesso físico dentro da empresa. */
const COMPLIANCE_PONTO_DE_ACESSO: NarrativeComplianceItem = {
  title: 'Telessaúde pura no ponto de acesso',
  description:
    'No ponto de acesso não se realiza ato de saúde presencial nem aferição de sinais vitais: o atendimento é sempre por telessaúde.',
};

const RISKS_BY_SERVICE_MODEL: Record<ServiceModel, { risks: string; holdHarmless: string }> = {
  ponto_de_acesso: {
    risks:
      'A adesão real pode ficar abaixo da estimada; o retorno apresentado é projeção sobre premissas informadas pela própria empresa, não garantia de economia; resultado de saúde não é garantido; o benefício não substitui plano de saúde nem medicina ocupacional; implantação sujeita a negociação.',
    holdHarmless:
      'Falhas de infraestrutura local do ponto de acesso (internet, energia, equipamentos) são de responsabilidade da empresa contratante e exoneram a Prontta perante o colaborador.',
  },
  remoto: {
    risks:
      'A adesão real pode ficar abaixo da estimada; o retorno apresentado é projeção sobre premissas informadas pela própria empresa, não garantia de economia; resultado de saúde não é garantido; o benefício não substitui plano de saúde nem medicina ocupacional.',
    holdHarmless:
      'O atendimento remoto depende do dispositivo e da conexão do colaborador; falhas nesses recursos não são de responsabilidade da Prontta.',
  },
};

const HERO_EXAMPLE = {
  title: 'Exemplo de benefício simulado',
  note: '50 consultas/mês e 5 Programas de Saúde para uma empresa de 320 colaboradores',
  stats: [
    { label: 'Investimento / mês', value: 'R$ 6.627,67' },
    { label: 'Por colaborador / mês', value: 'R$ 20,71' },
    { label: 'Colaboradores cobertos', value: '320' },
  ],
  disclaimer:
    'Exemplo calculado pelo simulador abaixo, com custeio integral pela empresa. Simulação ilustrativa; o custo varia com o mix, a população e o modelo de custeio escolhidos.',
} as const;

const LEGAL_NOTES = {
  precoUnitario:
    'Preço unit. é o valor devido à Prontta por consulta ou por ciclo de programa, já incluídos plataforma e IA. Não há margem de intermediação nesta proposta: a empresa contrata para ofertar ao colaborador, não para revender. Agenda dedicada é vendida em plantões fechados de 4h; agenda avulsa usa o tempo ocioso da rede.',
  totalSimulado:
    'Valor simulado a partir do mix escolhido. Programas são contratados por ciclo de 3, 6 ou 12 meses; o valor mensal apresentado é o rateio do ciclo, e o compromisso contratual é o ciclo cheio. Não constitui valor contratual.',
  fechamento:
    'O custo por colaborador e o retorno estimado são uma simulação construída sobre premissas informadas pela própria empresa (população, adesão, salário médio, dias de afastamento e redução esperada). Não constituem garantia de economia, de adesão, de volume ou de desfecho de saúde, e não substituem análise atuarial. As condições definitivas serão formalizadas em contrato.',
} as const;

/** Resolve a narrativa do canal empresa conforme o modelo de atendimento. */
export function getEmpresaNarrative(serviceModel: ServiceModel): ProposalNarrative {
  const compliance =
    serviceModel === 'ponto_de_acesso'
      ? [COMPLIANCE_COMMON[0], COMPLIANCE_PONTO_DE_ACESSO, ...COMPLIANCE_COMMON.slice(1)]
      : COMPLIANCE_COMMON;

  return {
    brand: base.brand,
    category: 'Saúde assistida como benefício corporativo · telessaúde · recorrente',
    headline: base.clientTypes.empresa.headline,
    subheadline:
      'Acesso rápido a especialistas por telessaúde, em ciclos de cuidado de 3, 6 e 12 meses — sem fila e sem virar plano de saúde.',
    numEspecialistas: base.numEspecialistas,
    numEspecialidades: base.numEspecialidades,
    ciclos: base.ciclos,
    positioningNotIs:
      'Não é plano de saúde, seguro-saúde, medicina ocupacional, marketplace de consulta barata ou telemedicina genérica.',
    aiDisclaimer: base.aiDisclaimer,
    modelDescription: MODEL_DESCRIPTION[serviceModel],
    implantationSteps: IMPLANTATION_STEPS[serviceModel],
    cover: {
      eyebrow: 'Proposta de Benefício Corporativo',
      title: 'Saúde Assistida\ncomo benefício ao colaborador',
    },
    scope: SCOPE_BY_SERVICE_MODEL[serviceModel],
    responsibilities: RESPONSIBILITIES,
    compliance,
    legalFramework:
      'Lei 14.510/2022 (Marco Legal da Telemedicina) · Resolução CFM 2.314/2022 · LGPD (Lei 13.709/2018) · CLT, art. 462 (desconto em folha)',
    risks: RISKS_BY_SERVICE_MODEL[serviceModel].risks,
    holdHarmless: RISKS_BY_SERVICE_MODEL[serviceModel].holdHarmless,
    holdHarmlessTitle:
      serviceModel === 'ponto_de_acesso'
        ? 'Responsabilidade por infraestrutura'
        : 'Limites do atendimento remoto',
    addonsNote: base.addonsNote,
    heroExample: HERO_EXAMPLE,
    legalNotes: LEGAL_NOTES,
    softwareRule:
      'O software mensal incide apenas sobre a bolsa de consultas e é isento a partir de 150 consultas/mês. Os Programas de Saúde já incluem plataforma e IA.',
    implantation: IMPLANTATION_BY_SERVICE_MODEL[serviceModel],
    proposalValidity: base.proposalValidity,
    contact: {
      title: 'Vamos levar o benefício aos seus colaboradores?',
      lead:
        serviceModel === 'remoto'
          ? 'Responda a esta proposta para alinharmos o escopo, formalizar o contrato e abrir a adesão — sem obra e sem sala.'
          : 'Responda a esta proposta para alinharmos o escopo, formalizar o contrato e preparar o ponto de acesso na sua empresa.',
    },
    cta: {
      primary: 'Quero levar isso ao meu RH',
      secondary: 'Simular o custo por colaborador',
    },
    footerNote: 'Proposta de benefício corporativo · válida por 30 dias',
  };
}

/** Implantação por modelo de atendimento — consumida pelo passo de custos e pelo PDF. */
export function getEmpresaImplantationNote(serviceModel: ServiceModel): {
  label: string;
  note: string;
} {
  return IMPLANTATION_BY_SERVICE_MODEL[serviceModel];
}
