// ============================================
// Bundles — pacotes pre-montados de especialidades
// ============================================

import type { Bundle } from "./types";

export const BUNDLES: Bundle[] = [
  {
    id: "atencao-primaria-municipal",
    name: "Atenção Primária Municipal",
    description:
      "Cobertura básica para uma UBS: clínico geral, pediatria e ginecologia em volume popular.",
    recommendedFor: ["municipio"],
    items: [
      {
        specialtyId: "medico-generalista",
        defaultTier: "popular",
        defaultQuantity: 4,
      },
      {
        specialtyId: "pediatria",
        defaultTier: "popular",
        defaultQuantity: 2,
      },
      {
        specialtyId: "ginecologia",
        defaultTier: "popular",
        defaultQuantity: 2,
      },
    ],
  },
  {
    id: "saude-mental-completa",
    name: "Saúde Mental Completa",
    description:
      "Pacote integrado de psicologia e psiquiatria para adultos e crianças.",
    recommendedFor: ["municipio", "empresa"],
    items: [
      {
        specialtyId: "psicologia-adulto",
        defaultTier: "intermediaria",
        defaultQuantity: 4,
      },
      {
        specialtyId: "psiquiatria-adulto",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
      {
        specialtyId: "psicologia-infantil",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
    ],
  },
  {
    id: "empresa-basico",
    name: "Pacote Empresa Básico",
    description:
      "Atendimento essencial para colaboradores: clínica geral, nutrição e saúde mental.",
    recommendedFor: ["empresa"],
    items: [
      {
        specialtyId: "medico-generalista",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
      {
        specialtyId: "nutricao",
        defaultTier: "intermediaria",
        defaultQuantity: 1,
      },
      {
        specialtyId: "psicologia-adulto",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
    ],
  },
  {
    id: "especialidades-municipio",
    name: "Especialidades para Município",
    description:
      "Conjunto de especialidades de alta demanda para reduzir filas em municípios.",
    recommendedFor: ["municipio"],
    items: [
      {
        specialtyId: "cardiologia",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
      {
        specialtyId: "endocrinologia",
        defaultTier: "intermediaria",
        defaultQuantity: 1,
      },
      {
        specialtyId: "ortopedia",
        defaultTier: "intermediaria",
        defaultQuantity: 2,
      },
      {
        specialtyId: "dermatologia",
        defaultTier: "intermediaria",
        defaultQuantity: 1,
      },
    ],
  },
];

export function getBundle(id: string): Bundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}

export function getBundlesForClient(focus: string): Bundle[] {
  return BUNDLES.filter((b) =>
    b.recommendedFor.includes(focus as Bundle["recommendedFor"][number]),
  );
}
