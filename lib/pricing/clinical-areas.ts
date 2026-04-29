// ============================================
// Areas Clinicas — agrupamento das especialidades
// ============================================

import type { ClinicalArea } from "./types";

export const CLINICAL_AREAS: ClinicalArea[] = [
  {
    id: "atencao-primaria",
    label: "Atenção Primária",
    description:
      "Cuidado contínuo de baixa complexidade, voltado à prevenção, promoção e gestão de doenças crônicas.",
    sortOrder: 1,
  },
  {
    id: "saude-mental",
    label: "Saúde Mental",
    description:
      "Acolhimento e tratamento psicológico e psiquiátrico para adultos e crianças.",
    sortOrder: 2,
  },
  {
    id: "pediatria",
    label: "Pediatria",
    description:
      "Cuidado especializado para crianças e adolescentes, incluindo desenvolvimento neurológico.",
    sortOrder: 3,
  },
  {
    id: "saude-da-mulher",
    label: "Saúde da Mulher",
    description:
      "Cuidado ginecológico e preventivo voltado à saúde feminina em todas as fases da vida.",
    sortOrder: 4,
  },
  {
    id: "clinica-medica",
    label: "Clínica Médica",
    description:
      "Especialidades clínicas para diagnóstico e acompanhamento de condições do adulto.",
    sortOrder: 5,
  },
  {
    id: "cirurgicas",
    label: "Especialidades Cirúrgicas",
    description:
      "Especialidades com avaliação inicial via teleconsulta e encaminhamento para procedimentos quando necessário.",
    sortOrder: 6,
  },
  {
    id: "dermatologia",
    label: "Dermatologia",
    description:
      "Avaliação dermatológica com suporte de imagem para doenças de pele e anexos.",
    sortOrder: 7,
  },
  {
    id: "terapias-multidisciplinares",
    label: "Terapias Multidisciplinares",
    description:
      "Acompanhamento nutricional e fonoaudiológico complementar ao cuidado médico.",
    sortOrder: 8,
  },
];

export function getClinicalArea(id: string): ClinicalArea | undefined {
  return CLINICAL_AREAS.find((area) => area.id === id);
}
