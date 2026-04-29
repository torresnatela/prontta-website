// ============================================
// Opcoes de Infraestrutura
// ============================================

import type { InfrastructureOption } from "../calculator-types";

export const INFRASTRUCTURE_OPTIONS: Record<
  InfrastructureOption,
  {
    label: string;
    description: string;
    purchasePrice: number;
    monthlyRent: number;
  }
> = {
  propria: {
    label: "Infraestrutura Própria",
    description:
      "Monte sua própria sala de atendimento com seus equipamentos. Sem custo adicional de infraestrutura.",
    purchasePrice: 0,
    monthlyRent: 0,
  },
  totem: {
    label: "Totem de Autoatendimento",
    description:
      "Totem de autoatendimento com telemedicina integrada. Solução prática e compacta para sua operação.",
    purchasePrice: 46000,
    monthlyRent: 3600,
  },
  cabine: {
    label: "Cabine Completa",
    description:
      "Cabine completa com isolamento acústico, equipamentos integrados e interface premium para o paciente.",
    purchasePrice: 100000,
    monthlyRent: 10000,
  },
};
