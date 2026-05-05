// ============================================
// Catalogo unico de Especialidades
// Source of truth — Agenda Compartilhada e Dedicada sao derivadas daqui
// ============================================

import type { SpecialtyPricing } from "../calculator-types";
import { CLINICAL_AREAS } from "./clinical-areas";
import type { Specialty } from "./types";

// Helper que monta um SpecialtyPricing nomeando os campos
function tiers(
  popular: { consultsPerHour: number; pricePerConsultation: number },
  intermediaria: { consultsPerHour: number; pricePerConsultation: number },
  alto_padrao: { consultsPerHour: number; pricePerConsultation: number },
): SpecialtyPricing {
  return { popular, intermediaria, alto_padrao };
}

export const SPECIALTIES: Specialty[] = [
  // ---- Atencao Primaria ----
  {
    id: "medico-generalista",
    displayName: "Médico Generalista",
    legacyDedicatedKey: "Médico Generalista",
    professionalType: "medico",
    audience: "ambos",
    clinicalAreaId: "atencao-primaria",
    shortDescription:
      "Avaliação clínica geral, triagem e acompanhamento de queixas comuns.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 76 },
      { consultsPerHour: 2.0, pricePerConsultation: 120 },
      { consultsPerHour: 1.5, pricePerConsultation: 100 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 10,
  },
  {
    id: "medicina-da-familia",
    displayName: "Medicina da Família",
    legacyDedicatedKey: "Medicina da Família",
    professionalType: "medico",
    audience: "ambos",
    clinicalAreaId: "atencao-primaria",
    shortDescription:
      "Cuidado longitudinal e contínuo para indivíduos e famílias.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 250.91 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["empresa"],
    sortOrder: 20,
  },
  {
    id: "geriatria",
    displayName: "Geriatria",
    legacyDedicatedKey: "Geriatria",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "atencao-primaria",
    shortDescription:
      "Acompanhamento clínico do paciente idoso e suas comorbidades.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    sortOrder: 30,
  },

  // ---- Saude Mental ----
  {
    id: "psicologia-adulto",
    displayName: "Psicologia (Adulto)",
    legacyDedicatedKey: "Psicólogo",
    legacySharedKey: "Psicologia Adulto",
    professionalType: "psicologo",
    audience: "adulto",
    clinicalAreaId: "saude-mental",
    shortDescription:
      "Atendimento psicológico para adultos, com foco em ansiedade, depressão e questões do cotidiano.",
    pricing: tiers(
      { consultsPerHour: 2.0, pricePerConsultation: 73 },
      { consultsPerHour: 1.33, pricePerConsultation: 78.62 },
      { consultsPerHour: 1.0, pricePerConsultation: 103.5 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 110,
  },
  {
    id: "psicologia-infantil",
    displayName: "Psicologia Infantil",
    legacyDedicatedKey: "Psicologia Infantil",
    professionalType: "psicologo",
    audience: "infantil",
    clinicalAreaId: "saude-mental",
    shortDescription:
      "Atendimento psicológico voltado para crianças e adolescentes.",
    pricing: tiers(
      { consultsPerHour: 2.0, pricePerConsultation: 122 },
      { consultsPerHour: 1.33, pricePerConsultation: 133.01 },
      { consultsPerHour: 1.0, pricePerConsultation: 199.52 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["empresa"],
    sortOrder: 120,
  },
  {
    id: "psiquiatria-adulto",
    displayName: "Psiquiatria (Adulto)",
    legacyDedicatedKey: "Psiquiatria",
    legacySharedKey: "Psiquiatria Adulto",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "saude-mental",
    shortDescription:
      "Avaliação psiquiátrica e manejo medicamentoso para adultos.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 157.24 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 130,
  },
  {
    id: "psiquiatria-infantil",
    displayName: "Psiquiatria Infantil",
    legacyDedicatedKey: "Psiquiatria Infantil",
    professionalType: "medico",
    audience: "infantil",
    clinicalAreaId: "saude-mental",
    shortDescription:
      "Avaliação psiquiátrica especializada para crianças e adolescentes.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 195 },
      { consultsPerHour: 2.0, pricePerConsultation: 235.86 },
      { consultsPerHour: 1.0, pricePerConsultation: 475.66 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: [],
    sortOrder: 140,
  },

  // ---- Pediatria ----
  {
    id: "pediatria",
    displayName: "Pediatria",
    legacyDedicatedKey: "Pediatria",
    professionalType: "medico",
    audience: "infantil",
    clinicalAreaId: "pediatria",
    shortDescription:
      "Cuidado clínico de crianças e adolescentes, do crescimento à doença aguda.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 201.01 },
      { consultsPerHour: 1.0, pricePerConsultation: 313.64 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    featured: true,
    sortOrder: 210,
  },
  {
    id: "neuropediatria",
    displayName: "Neuropediatria",
    legacyDedicatedKey: "Neuropediatria",
    professionalType: "medico",
    audience: "infantil",
    clinicalAreaId: "pediatria",
    shortDescription:
      "Avaliação neurológica de crianças, com foco em desenvolvimento e neurodivergências.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 180.0 },
      { consultsPerHour: 2.0, pricePerConsultation: 230.0 },
      { consultsPerHour: 1.0, pricePerConsultation: 522.73 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: [],
    sortOrder: 220,
  },

  // ---- Saude da Mulher ----
  {
    id: "ginecologia",
    displayName: "Ginecologia",
    legacyDedicatedKey: "Ginecologia",
    legacySharedKey: "Ginecologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "saude-da-mulher",
    shortDescription:
      "Cuidado ginecológico preventivo e manejo de queixas comuns da saúde da mulher.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 310,
  },

  // ---- Clinica Medica ----
  {
    id: "cardiologia",
    displayName: "Cardiologia",
    legacyDedicatedKey: "Cardiologista",
    legacySharedKey: "Cardiologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Avaliação cardiovascular, ajuste de medicações e acompanhamento de hipertensão e arritmias.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.5, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 410,
  },
  {
    id: "endocrinologia",
    displayName: "Endocrinologia",
    legacyDedicatedKey: "Endocrinologia",
    legacySharedKey: "Endocrinologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Acompanhamento de diabetes, tireoide, obesidade e outras disfunções hormonais.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 198.2 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    sortOrder: 420,
  },
  {
    id: "gastroenterologia",
    displayName: "Gastroenterologia",
    legacyDedicatedKey: "Gastroenterologia",
    legacySharedKey: "Gastroenterologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Avaliação de queixas digestivas, dispepsia, doenças hepáticas e intestinais.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 157.24 },
      { consultsPerHour: 1.0, pricePerConsultation: 250.91 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    sortOrder: 430,
  },
  {
    id: "hematologia",
    displayName: "Hematologia",
    legacyDedicatedKey: "Hematologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Avaliação de alterações hematológicas e acompanhamento de doenças do sangue.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 206.39 },
      { consultsPerHour: 1.0, pricePerConsultation: 313.64 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: [],
    sortOrder: 440,
  },
  {
    id: "infectologia",
    displayName: "Infectologia",
    legacyDedicatedKey: "Infectologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Diagnóstico e manejo de doenças infecciosas e antibioticoterapia.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 129.73 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    sortOrder: 450,
  },
  {
    id: "nefrologia",
    displayName: "Nefrologia",
    legacyDedicatedKey: "Nefrologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Acompanhamento de doença renal crônica e distúrbios hidroeletrolíticos.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 198.2 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: [],
    sortOrder: 460,
  },
  {
    id: "neurologia-adulto",
    displayName: "Neurologia (Adulto)",
    legacyDedicatedKey: "Neurologia",
    legacySharedKey: "Neurologista Adulto",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Avaliação de cefaleias, epilepsia, AVC e demais condições neurológicas do adulto.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 206.39 },
      { consultsPerHour: 1.0, pricePerConsultation: 313.64 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    sortOrder: 470,
  },
  {
    id: "pneumologia",
    displayName: "Pneumologia",
    legacyDedicatedKey: "Pneumologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Avaliação de asma, DPOC, apneia do sono e demais doenças respiratórias.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 201.01 },
      { consultsPerHour: 1.0, pricePerConsultation: 313.64 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    sortOrder: 480,
  },
  {
    id: "reumatologia",
    displayName: "Reumatologia",
    legacyDedicatedKey: "Reumatologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "clinica-medica",
    shortDescription:
      "Diagnóstico e acompanhamento de doenças autoimunes e do sistema musculoesquelético.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 163 },
      { consultsPerHour: 2.0, pricePerConsultation: 201.01 },
      { consultsPerHour: 1.0, pricePerConsultation: 313.64 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: [],
    sortOrder: 490,
  },

  // ---- Especialidades Cirurgicas ----
  {
    id: "ortopedia",
    displayName: "Ortopedia",
    legacyDedicatedKey: "Ortopedia",
    legacySharedKey: "Ortopedia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "cirurgicas",
    shortDescription:
      "Avaliação de queixas musculoesqueléticas e direcionamento para procedimentos.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 510,
  },
  {
    id: "oftalmologia",
    displayName: "Oftalmologia",
    legacyDedicatedKey: "Oftalmologia",
    professionalType: "medico",
    audience: "ambos",
    clinicalAreaId: "cirurgicas",
    shortDescription:
      "Avaliação inicial de queixas oftalmológicas e triagem para exames presenciais.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    sortOrder: 520,
  },
  {
    id: "otorrinolaringologia",
    displayName: "Otorrinolaringologia",
    legacyDedicatedKey: "Otorrinolaringologia",
    professionalType: "medico",
    audience: "ambos",
    clinicalAreaId: "cirurgicas",
    shortDescription:
      "Avaliação de queixas de ouvido, nariz e garganta com encaminhamento quando necessário.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    sortOrder: 530,
  },
  {
    id: "urologia",
    displayName: "Urologia",
    legacyDedicatedKey: "Urologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "cirurgicas",
    shortDescription:
      "Avaliação urológica masculina e feminina com manejo clínico inicial.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 157.24 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["empresa"],
    sortOrder: 540,
  },

  // ---- Dermatologia ----
  {
    id: "dermatologia",
    displayName: "Dermatologia",
    legacyDedicatedKey: "Dermatologia",
    legacySharedKey: "Dermatologia",
    professionalType: "medico",
    audience: "ambos",
    clinicalAreaId: "dermatologia",
    shortDescription:
      "Avaliação dermatológica com suporte de imagem para lesões e doenças de pele.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 130 },
      { consultsPerHour: 2.0, pricePerConsultation: 158.56 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 610,
  },

  // ---- Terapias Multidisciplinares ----
  {
    id: "nutricao",
    displayName: "Nutrição",
    legacyDedicatedKey: "Nutricionista",
    legacySharedKey: "Nutricionista",
    professionalType: "nutricionista",
    audience: "ambos",
    clinicalAreaId: "terapias-multidisciplinares",
    shortDescription:
      "Acompanhamento nutricional individualizado para hábitos saudáveis e metas clínicas.",
    pricing: tiers(
      { consultsPerHour: 2.0, pricePerConsultation: 75 },
      { consultsPerHour: 1.33, pricePerConsultation: 99.1 },
      { consultsPerHour: 1.0, pricePerConsultation: 103.5 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    featured: true,
    sortOrder: 710,
  },
  {
    id: "nutrologia",
    displayName: "Nutrologia",
    legacyDedicatedKey: "Nutrólogo",
    legacySharedKey: "Nutrologia",
    professionalType: "medico",
    audience: "adulto",
    clinicalAreaId: "terapias-multidisciplinares",
    shortDescription:
      "Avaliação médica nutrológica com manejo de obesidade e deficiências nutricionais.",
    pricing: tiers(
      { consultsPerHour: 2.5, pricePerConsultation: 126.5 },
      { consultsPerHour: 2.0, pricePerConsultation: 161.0 },
      { consultsPerHour: 1.0, pricePerConsultation: 253.0 },
    ),
    availability: { sharedAgenda: true, dedicatedAgenda: true },
    recommendedFor: ["empresa", "estabelecimento"],
    sortOrder: 720,
  },
  {
    id: "fonoaudiologia",
    displayName: "Fonoaudiologia",
    legacyDedicatedKey: "Fonoaudiologia",
    professionalType: "fonoaudiologo",
    audience: "ambos",
    clinicalAreaId: "terapias-multidisciplinares",
    shortDescription:
      "Avaliação e acompanhamento de distúrbios da fala, linguagem e audição.",
    pricing: tiers(
      { consultsPerHour: 2, pricePerConsultation: 122 },
      { consultsPerHour: 2.0, pricePerConsultation: 184.0 },
      { consultsPerHour: 1.0, pricePerConsultation: 125.45 },
    ),
    availability: { sharedAgenda: false, dedicatedAgenda: true },
    recommendedFor: ["estabelecimento"],
    sortOrder: 730,
  },
];

// ---- Indices auxiliares ----

export const SPECIALTIES_BY_ID: Record<string, Specialty> = SPECIALTIES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, Specialty>,
);

export function getSpecialty(id: string): Specialty | undefined {
  return SPECIALTIES_BY_ID[id];
}

// Encontra Specialty pela chave legacy (string usada nos componentes atuais
// como `pkg.specialty`). Faz match em legacyDedicatedKey ou legacySharedKey.
export function getSpecialtyByLegacyKey(
  legacyKey: string,
): Specialty | undefined {
  return SPECIALTIES.find(
    (s) =>
      s.legacyDedicatedKey === legacyKey || s.legacySharedKey === legacyKey,
  );
}

export function getSpecialtiesByArea(areaId: string): Specialty[] {
  return SPECIALTIES.filter((s) => s.clinicalAreaId === areaId).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export function getSpecialtiesForClient(focus: string): Specialty[] {
  return SPECIALTIES.filter((s) =>
    s.recommendedFor.includes(focus as Specialty["recommendedFor"][number]),
  );
}

// ---- Validacao do catalogo ----

export function validateSpecialtyCatalog(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const dedicatedKeys = new Set<string>();
  const sharedKeys = new Set<string>();
  const validAreas = new Set(CLINICAL_AREAS.map((a) => a.id));

  for (const s of SPECIALTIES) {
    if (ids.has(s.id)) errors.push(`ID duplicado: ${s.id}`);
    ids.add(s.id);

    if (dedicatedKeys.has(s.legacyDedicatedKey)) {
      errors.push(`legacyDedicatedKey duplicado: ${s.legacyDedicatedKey}`);
    }
    dedicatedKeys.add(s.legacyDedicatedKey);

    if (s.legacySharedKey) {
      if (sharedKeys.has(s.legacySharedKey)) {
        errors.push(`legacySharedKey duplicado: ${s.legacySharedKey}`);
      }
      sharedKeys.add(s.legacySharedKey);
    }

    if (s.availability.sharedAgenda && !s.legacySharedKey) {
      errors.push(`${s.id} marcada como sharedAgenda mas sem legacySharedKey`);
    }

    if (!validAreas.has(s.clinicalAreaId)) {
      errors.push(
        `${s.id} aponta para clinicalAreaId inexistente: ${s.clinicalAreaId}`,
      );
    }

    if (s.recommendedFor.length === 0) {
      errors.push(`${s.id} sem recommendedFor`);
    }

    for (const tier of ["popular", "intermediaria", "alto_padrao"] as const) {
      const t = s.pricing[tier];
      if (!t || t.consultsPerHour <= 0 || t.pricePerConsultation <= 0) {
        errors.push(`${s.id} tier ${tier} invalido`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
