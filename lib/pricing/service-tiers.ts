// ============================================
// Categorias de Atendimento (tiers de servico)
// ============================================

import type { CategoryInfo } from "../calculator-types";

export const CATEGORIES: Record<string, CategoryInfo> = {
  popular: {
    label: "Popular",
    description:
      "Maior volume de atendimentos com tempo reduzido por consulta.",
    avgMinutes: 24,
    consultsPerHour: 2.5,
  },
  intermediaria: {
    label: "Intermediária",
    description: "Equilíbrio entre volume de atendimentos e tempo de consulta.",
    avgMinutes: 30,
    consultsPerHour: 2,
  },
  alto_padrao: {
    label: "Alto Padrão",
    description:
      "Atendimento premium com mais tempo por consulta e menor volume.",
    avgMinutes: 60,
    consultsPerHour: 1,
  },
};
