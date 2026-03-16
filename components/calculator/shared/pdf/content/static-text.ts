// ============================================
// Texto institucional estático — Proposta Município v4
// ============================================

// ---- Seção 1: Sobre a Prontta Saúde ----

export const SOBRE_PRONTTA = {
  intro:
    'A Prontta Saúde é uma empresa brasileira de tecnologia em saúde, fundada com a missão de democratizar o acesso à atenção médica especializada. Combinamos telemedicina de alta resolução com infraestrutura física assistida para levar especialistas a regiões onde a oferta é escassa ou inexistente.',
  naturezaJuridica: {
    title: '1.1 Natureza Jurídica e Escopo de Atuação',
    text: 'Empresa privada de tecnologia e serviços em saúde, registrada sob CNPJ válido, com atuação em todo o território nacional. Nossos profissionais médicos são habilitados pelo CRM e seguem integralmente as resoluções do Conselho Federal de Medicina (CFM) para teleconsultas.',
  },
}

// ---- Seção 2: O Desafio do Acesso à Saúde Especializada ----

export const DESAFIO_ACESSO = {
  paragraphs: [
    'Milhões de brasileiros enfrentam filas de meses — ou anos — para consultar um especialista pelo SUS. Municípios de pequeno e médio porte frequentemente não dispõem de profissionais locais em especialidades como cardiologia, endocrinologia, neurologia e psiquiatria, entre outras.',
    'Esse cenário gera agravamento de condições crônicas, internações evitáveis e aumento dos custos assistenciais para a gestão municipal. A telessaúde semipresencial assistida surge como resposta eficaz: o paciente é atendido em seu próprio município, com suporte técnico presencial, enquanto o especialista conduz a consulta remotamente com acesso a equipamentos de exame em tempo real.',
  ],
}

// ---- Seção 3: O Modelo Prontta Care ----

export const MODELO_PRONTTA_CARE = {
  intro:
    'O Prontta Care é o nosso modelo integrado de telessaúde, estruturado em três pilares:',
  pilares: [
    {
      title: 'Pilar 1 — Tecnologia',
      text: 'Plataforma proprietária de teleconsulta com prontuário eletrônico, agendamento inteligente e integração com dispositivos médicos IoT para exame físico remoto em tempo real.',
    },
    {
      title: 'Pilar 2 — Infraestrutura',
      text: 'Pontos de atendimento equipados (totens ou cabines) instalados em UBS, policlínicas e centros de saúde. Cada ponto permite que o paciente realize a consulta com suporte presencial de um facilitador de saúde treinado.',
    },
    {
      title: 'Pilar 3 — Corpo Clínico',
      text: 'Rede de médicos especialistas contratados e credenciados, com agendas dedicadas ou compartilhadas conforme a demanda do município. Todos os profissionais seguem protocolos clínicos padronizados e as normativas do CFM.',
    },
  ],
}

// ---- Seção 4: Fluxo de Atendimento ----

export const FLUXO_ATENDIMENTO = {
  intro:
    'O atendimento segue um fluxo estruturado em quatro etapas, garantindo qualidade e rastreabilidade:',
  etapas: [
    {
      title: 'Etapa 1 — Agendamento',
      text: 'A Unidade de Saúde agenda a consulta pela plataforma Prontta. O paciente recebe confirmação com data, horário e orientações de preparo.',
    },
    {
      title: 'Etapa 2 — Recepção e Preparo',
      text: 'No dia da consulta, o paciente comparece à Unidade de Saúde. Um facilitador presencial acolhe o paciente, confere documentos e prepara os dispositivos de exame.',
    },
    {
      title: 'Etapa 3 — Teleconsulta Assistida',
      text: 'O especialista conduz a consulta por videoconferência em alta definição. O facilitador auxilia na aplicação dos dispositivos de exame (estetoscópio digital, otoscópio, dermatoscópio, etc.), permitindo exame físico remoto em tempo real.',
    },
    {
      title: 'Etapa 4 — Desfecho e Seguimento',
      text: 'Ao final, o médico registra o atendimento no prontuário eletrônico, emite receitas e solicitações de exames digitalmente. O paciente sai com toda a documentação em mãos e, se necessário, o seguimento é agendado automaticamente.',
    },
  ],
}

// ---- Seção 5: Infraestrutura Adaptável ----

export const INFRAESTRUTURA_ADAPTAVEL = {
  intro:
    'Oferecemos três opções de infraestrutura para atender diferentes realidades municipais. O município pode escolher a que melhor se adequa ao espaço disponível e ao volume de atendimentos:',
  opcoes: [
    {
      key: 'propria' as const,
      title: 'Opção A — Kit Básico (Infraestrutura Própria)',
      description:
        'A Unidade de Saúde disponibiliza uma sala com computador, webcam e internet estável. A Prontta fornece os dispositivos médicos IoT e o software. Ideal para municípios que já possuem estrutura física adequada.',
    },
    {
      key: 'totem' as const,
      title: 'Opção B — Totem de Autoatendimento',
      description:
        'Estação compacta com tela, câmera e dispositivos médicos integrados. Não requer sala dedicada — pode ser instalado em recepções de UBS ou policlínicas. Inclui conectividade 4G de backup.',
    },
    {
      key: 'cabine' as const,
      title: 'Opção C — Cabine Completa',
      description:
        'Consultório modular com isolamento acústico, climatização, iluminação profissional e todos os dispositivos médicos embarcados. Experiência premium para o paciente e máxima privacidade. Pode ser instalada interna ou externamente.',
    },
  ],
}

// ---- Seção 6: Conectividade e Interoperabilidade com o SUS ----

export const CONECTIVIDADE = {
  paragraphs: [
    'A plataforma Prontta é projetada para operar com conectividade a partir de 2 Mbps, com fallback automático para rede 4G embarcada nos totens e cabines. A qualidade da videoconferência se adapta dinamicamente à banda disponível.',
    'Os dados clínicos são armazenados em conformidade com a LGPD e seguem os padrões de interoperabilidade do Ministério da Saúde (RNDS). Os atendimentos geram registros BPA compatíveis, permitindo ao município reportar a produção ao SUS e buscar ressarcimento quando aplicável.',
  ],
  itens: [
    'Prontuário eletrônico com padrão TISS/TUSS',
    'Integração com e-SUS AB e SISREG quando disponível',
    'Relatórios de produção exportáveis para BPA magnético',
    'Dados anonimizados para painel epidemiológico municipal',
  ],
}

// ---- Seção 7: Metodologia de Implementação ----

export const METODOLOGIA_IMPLEMENTACAO = {
  intro:
    'A implementação segue uma metodologia estruturada em 8 etapas, com responsabilidades claramente definidas entre Prefeitura e Prontta Saúde:',
  etapas: [
    {
      numero: '7.1',
      title: 'Diagnóstico e Planejamento',
      prefeitura: [
        'Designar interlocutor do projeto',
        'Fornecer dados epidemiológicos e de fila de espera',
        'Definir unidades de saúde participantes',
      ],
      prontta: [
        'Realizar diagnóstico de demanda reprimida',
        'Dimensionar volume de consultas por especialidade',
        'Elaborar cronograma de implantação',
      ],
    },
    {
      numero: '7.2',
      title: 'Adequação de Infraestrutura',
      prefeitura: [
        'Disponibilizar espaço físico conforme opção escolhida',
        'Garantir ponto de energia elétrica e internet',
        'Viabilizar reformas ou adaptações necessárias',
      ],
      prontta: [
        'Avaliar e homologar espaço físico',
        'Instalar equipamentos e dispositivos médicos',
        'Configurar conectividade e sistemas',
      ],
    },
    {
      numero: '7.3',
      title: 'Capacitação de Equipes',
      prefeitura: [
        'Liberar equipe para treinamento',
        'Designar facilitadores de saúde para os turnos',
      ],
      prontta: [
        'Treinar facilitadores no uso dos equipamentos',
        'Capacitar equipe de agendamento na plataforma',
        'Fornecer material de apoio e manuais',
      ],
    },
    {
      numero: '7.4',
      title: 'Configuração da Plataforma',
      prefeitura: [
        'Fornecer cadastro das unidades no CNES',
        'Validar escala de atendimento proposta',
      ],
      prontta: [
        'Configurar agendas por especialidade e unidade',
        'Cadastrar profissionais e protocolos clínicos',
        'Integrar com sistemas municipais quando possível',
      ],
    },
    {
      numero: '7.5',
      title: 'Piloto Assistido',
      prefeitura: [
        'Selecionar pacientes para fase piloto',
        'Garantir presença do facilitador nos atendimentos',
      ],
      prontta: [
        'Acompanhar presencialmente os primeiros atendimentos',
        'Ajustar fluxos com base no feedback',
        'Validar qualidade técnica e clínica',
      ],
    },
    {
      numero: '7.6',
      title: 'Operação Plena',
      prefeitura: [
        'Manter facilitadores nos horários agendados',
        'Divulgar serviço à população',
        'Monitorar satisfação dos pacientes',
      ],
      prontta: [
        'Garantir disponibilidade dos especialistas',
        'Monitorar indicadores de qualidade em tempo real',
        'Fornecer suporte técnico contínuo',
      ],
    },
    {
      numero: '7.7',
      title: 'Monitoramento e Relatórios',
      prefeitura: [
        'Acompanhar indicadores no painel de gestão',
        'Participar de reuniões mensais de acompanhamento',
      ],
      prontta: [
        'Gerar relatórios mensais de produção e qualidade',
        'Apresentar indicadores de impacto à gestão',
        'Propor ajustes de escala conforme demanda',
      ],
    },
    {
      numero: '7.8',
      title: 'Expansão e Melhoria Contínua',
      prefeitura: [
        'Avaliar novas unidades para expansão',
        'Incluir novas especialidades conforme demanda',
      ],
      prontta: [
        'Dimensionar crescimento de capacidade',
        'Atualizar equipamentos e software',
        'Incorporar novas tecnologias de exame remoto',
      ],
    },
  ],
}

// ---- Seção 8: Resumo de Responsabilidades ----

export const RESUMO_RESPONSABILIDADES = {
  intro:
    'Tabela sintética das responsabilidades de cada parte ao longo de toda a operação:',
  prefeitura: [
    'Espaço físico e infraestrutura básica (energia, internet)',
    'Facilitadores de saúde presenciais',
    'Agendamento e organização do fluxo de pacientes',
    'Divulgação do serviço à população',
    'Acompanhamento de indicadores e reuniões periódicas',
  ],
  prontta: [
    'Plataforma de telemedicina e prontuário eletrônico',
    'Equipamentos e dispositivos médicos IoT',
    'Corpo clínico especializado (médicos habilitados pelo CRM)',
    'Instalação, configuração e manutenção técnica',
    'Treinamento de equipes e suporte contínuo',
    'Relatórios de produção e indicadores de qualidade',
  ],
}

// ---- Seção 10: Impactos Estratégicos ----

export const IMPACTOS_ESTRATEGICOS = {
  intro:
    'A implementação da telessaúde semipresencial assistida gera impactos mensuráveis em múltiplas dimensões:',
  impactos: [
    {
      title: 'Redução de Filas de Espera',
      text: 'Atendimentos especializados realizados localmente eliminam a necessidade de deslocamento e reduzem drasticamente o tempo de espera, que pode cair de meses para dias.',
    },
    {
      title: 'Economia com TFD (Tratamento Fora do Domicílio)',
      text: 'Com atendimentos locais, o município reduz gastos com transporte sanitário, diárias, alimentação e acompanhantes — despesas que frequentemente superam o custo do próprio atendimento.',
    },
    {
      title: 'Resolutividade na Atenção Primária',
      text: 'O acesso rápido ao especialista permite diagnóstico precoce e início imediato do tratamento, evitando complicações, internações e procedimentos de alto custo.',
    },
    {
      title: 'Fortalecimento da Rede Municipal de Saúde',
      text: 'A telessaúde complementa a rede existente sem competir com ela, fortalecendo as UBS como pontos de resolutividade e valorizando o papel da atenção primária.',
    },
    {
      title: 'Dados para Gestão Baseada em Evidências',
      text: 'Relatórios detalhados de produção e perfil epidemiológico permitem ao gestor tomar decisões informadas sobre alocação de recursos e prioridades de saúde.',
    },
    {
      title: 'Valorização Política e Institucional',
      text: 'Oferecer acesso a especialistas na própria cidade é uma entrega tangível e percebida pela população, fortalecendo a gestão municipal e a confiança no SUS local.',
    },
  ],
}

// ---- Seção 11: Conclusão ----

export const CONCLUSAO = {
  paragraphs: [
    'A Prontta Saúde coloca à disposição do município uma solução completa e comprovada de telessaúde semipresencial assistida, capaz de transformar o acesso à saúde especializada com rapidez, qualidade e custo acessível.',
    'Nossa equipe está pronta para iniciar o diagnóstico de demanda e apresentar um plano de implementação personalizado. Estamos à disposição para agendar uma reunião presencial ou remota para detalhar cada aspecto desta proposta.',
  ],
  fechamento: 'Atenciosamente,\nEquipe Prontta Saúde',
}
