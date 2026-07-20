import type { ClientType } from './pricing';

/**
 * Textos narrativos da proposta 3.0.
 * Fonte: HTML oficial "Prontta_Landing_Prontta_Oficial_10" (bloco PRONTTA_DATA).
 * O modelo é transparente sobre o P&L do parceiro — a proposta mostra abertamente o
 * repasse à Prontta e o resultado estimado do parceiro.
 */

interface ClientTypeContent {
  label: string;
  /** Trecho que personaliza a headline (ex.: "sua academia"). */
  headlineTarget: string;
  headline: string;
  audienceNote: string;
}

const clientType = (label: string, headlineTarget: string, audienceNote: string): ClientTypeContent => ({
  label,
  headlineTarget,
  headline: `Programas de Saúde Assistida para ${headlineTarget}`,
  audienceNote,
});

export const PROPOSAL_CONTENT = {
  brand: 'Prontta Saúde',
  category: 'Healthtech B2B semipresencial · telessaúde assistida · recorrente',
  subheadline:
    'Cuidado recorrente em ciclos de 3, 6 e 12 meses, com IA de pré-triagem e especialistas por telessaúde.',
  modelDescription:
    'Um ponto de acesso digital dentro do seu espaço: o parceiro cede o local e a agenda; a Prontta cuida da operação médica, tecnologia, treinamento e suporte.',
  numEspecialistas: '+400 especialistas',
  numEspecialidades: '+20 especialidades (26 mapeadas)',
  ciclos: '3, 6 e 12 meses',
  stats: [
    { value: '+400', label: 'especialistas na rede' },
    { value: '26', label: 'especialidades mapeadas' },
    { value: '12', label: 'programas de saúde assistida' },
    { value: '3·6·12', label: 'meses por ciclo de cuidado' },
  ],
  positioningNotIs:
    'Não é plano de saúde, seguro-saúde, marketplace de consulta barata ou telemedicina genérica.',
  aiDisclaimer:
    'A inteligência artificial da Prontta realiza a pré-triagem e organiza a jornada do paciente. Ela não realiza diagnóstico: o ato médico é sempre do profissional habilitado, por telessaúde, sob seu CRM.',

  /** Card ilustrativo do hero — reflete o mix padrão que abre no simulador. */
  heroExample: {
    title: 'Exemplo real de simulação',
    note: '44 consultas especializadas + 6 Programas de Saúde no mês, com as margens recomendadas',
    receita: 28900,
    resultadoLiquido: 6457,
    margemLiquida: 22.3,
    disclaimer:
      'Exemplo calculado pelo simulador abaixo, já descontando software, equipe, espaço e impostos. Simulação ilustrativa; resultado varia por operação.',
  },

  clientTypes: {
    academia: clientType(
      'Academia',
      'sua academia',
      'Transforme o fluxo de alunos em uma nova linha de receita recorrente com saúde assistida.',
    ),
    clinica: clientType(
      'Clínica',
      'sua clínica',
      'Amplie especialidades sem contratar médicos e mantenha o paciente no seu ecossistema.',
    ),
    farmacia: clientType(
      'Farmácia',
      'sua farmácia',
      'Um ponto de cuidado especializado dentro da farmácia, com jornada recorrente.',
    ),
    laboratorio: clientType(
      'Laboratório',
      'seu laboratório',
      'Converta exames em jornadas de cuidado contínuo com especialistas por telessaúde.',
    ),
    empresa: clientType(
      'Empresa',
      'sua empresa',
      'Saúde assistida para colaboradores, com acesso rápido a especialistas e menos afastamento.',
    ),
  } satisfies Record<ClientType, ClientTypeContent>,

  implantationSteps: [
    'Alinhamento comercial e assinatura do contrato de parceria.',
    'Implantação do ponto de acesso no seu espaço e integração da agenda.',
    'Treinamento da sua equipe para recepção e agendamento.',
    'Lançamento com materiais de divulgação e apoio comercial.',
    'Operação assistida com suporte contínuo e acompanhamento de resultados.',
  ],

  scope: {
    included: [
      'Operação médica completa: recrutamento, escala e responsabilidade técnica dos especialistas',
      'Plataforma de telessaúde e IA de pré-triagem',
      'Implantação, treinamento da equipe local e suporte contínuo',
      'Gestão da jornada assistencial e curadoria da rede médica',
    ],
    notIncluded: [
      'Espaço físico, mobiliário e infraestrutura local (energia, internet)',
      'Agendamento e recepção, feitos pela equipe do parceiro',
      'Qualquer ato de saúde presencial no ponto de acesso (vedado)',
    ],
  },

  responsibilities: [
    {
      party: 'Prontta',
      description:
        'Plataforma, IA de pré-triagem, gestão da jornada, curadoria e responsabilidade técnica da rede médica.',
    },
    {
      party: 'Parceiro físico',
      description:
        'Cede o espaço/ponto de acesso, cuida da agenda e da recepção e mantém a infraestrutura local.',
    },
    {
      party: 'Médico',
      description:
        'Responsável pelo ato médico e pela prescrição, via telessaúde, sob seu CRM (responsabilidade técnica na sede, CRM-MG).',
    },
    {
      party: 'Fornecedor',
      description: 'Responsável pelo insumo na etapa 2 (add-on), quando aplicável.',
    },
    {
      party: 'Paciente',
      description:
        'Titular dos dados; adere ao programa e à jornada; consente por TCLE digital antes de qualquer coleta.',
    },
  ],

  compliance: [
    {
      title: 'IA de pré-triagem, não de diagnóstico',
      description:
        'A IA faz pré-triagem, não realiza diagnóstico. O ato médico é sempre do profissional habilitado.',
    },
    {
      title: 'Telessaúde pura no ponto de acesso',
      description:
        'No ponto de acesso não se realiza ato de saúde presencial nem aferição de sinais vitais.',
    },
    {
      title: 'Remuneração do parceiro dentro da regra',
      description:
        'Parceiro leigo remunerado por cessão de espaço/revenda, nunca por consulta (veda dicotomia, CFM 2.333/2023).',
    },
    {
      title: 'Canal de vendas formalizado',
      description: 'Canal de vendas (Indicador/Gestor/Master) só recebe com MEI/CNPJ e nota fiscal.',
    },
    {
      title: 'Dados clínicos protegidos',
      description:
        'O parceiro não acessa dados clínicos, prontuários ou informações de saúde: são criptografados e restritos à Prontta e ao médico assistente.',
    },
    {
      title: 'LGPD e consentimento',
      description:
        'Dados tratados conforme a LGPD; base legal, finalidade e retenção informadas ao titular; consentimento por TCLE digital.',
    },
    {
      title: 'Independência entre as partes',
      description:
        'Não há vínculo empregatício, societário ou de subordinação entre Prontta e parceiro; cada parte responde por seus encargos.',
    },
    {
      title: 'Propriedade intelectual da Prontta',
      description:
        'Marca, plataforma, IA, metodologia e conteúdos são de titularidade exclusiva da Prontta; o contrato não importa cessão ou licença.',
    },
  ],
  legalFramework:
    'Lei 14.510/2022 (Marco Legal da Telemedicina) · Resoluções CFM 2.314/2022 e 2.333/2023 · LGPD (Lei 13.709/2018)',

  risks:
    'Depende de infraestrutura local do parceiro; resultado de saúde não é garantido; volume de vendas influencia software e margem; implantação sujeita a negociação.',
  holdHarmless:
    'Falhas de infraestrutura local (internet, energia, equipamentos) são de responsabilidade do parceiro e exoneram a Prontta perante o cliente final.',
  addonsNote: 'Etapa 2, como add-on aos programas. Não há venda direta de insumo.',

  softwareRule:
    'Software mensal apenas na compra de consultas; isento a partir de 150 consultas/mês. Os programas já incluem a plataforma.',
  implantation: {
    label: 'A combinar',
    note:
      'Taxa única de implantação (R$ 10 mil a R$ 15 mil), a combinar ou isenta conforme negociação.',
  },
  proposalValidity: 'Proposta válida por 30 dias a partir da emissão.',

  /** Avisos legais reproduzidos no PDF. */
  legalNotes: {
    totalSimulado: 'Valor simulado a partir do mix escolhido. Não constitui valor contratual.',
    resultadoParceiro:
      'Todos os números apresentados são uma simulação, elaborada para que o parceiro tenha noção das possibilidades de ganho e de escala do modelo. Não representam o total de um contrato nem constituem compromisso de volume, faturamento ou resultado: as vendas são variáveis e dependem da operação de cada parceiro. Não há garantia de resultado comercial ou de saúde. As condições definitivas serão formalizadas em contrato.',
  },

  cta: {
    primary: 'Quero ser um ponto Prontta',
    secondary: 'Simular meu resultado',
  },
} as const;

export type ProposalContent = typeof PROPOSAL_CONTENT;
