import type { PlanId, Specialty } from './types';

/**
 * Catálogo único de especialidades do modelo 2.0.
 * Fonte: planilha oficial "Prontta_Simulador_Precos_DRE" (aba 2. Especialidades).
 * Armazena apenas os insumos (valor-hora e consultas/hora por plano);
 * preços e múltiplos de plantão são derivados pelo engine.
 */
const spec = (
  id: string,
  name: string,
  valorHora: number,
  popular: number,
  intermediario: number,
  premium: number,
): Specialty => ({ id, name, valorHora, consultsPerHour: { popular, intermediario, premium } });

export const SPECIALTIES: Specialty[] = [
  spec('cardiologia-adulto', 'Cardiologia Adulto', 120, 2.5, 2, 1),
  spec('dermatologia', 'Dermatologia', 120, 2.5, 2, 1),
  spec('endocrinologia', 'Endocrinologia', 120, 2.5, 2, 1),
  spec('fonoaudiologia', 'Fonoaudiologia', 60, 1.33, 2, 1),
  spec('gastroenterologia', 'Gastroenterologia', 120, 2.5, 2, 1),
  spec('geriatria', 'Geriatria', 120, 2.5, 2, 1),
  spec('ginecologia-obstetricia', 'Ginecologia/Obstetrícia', 120, 2.5, 2, 1),
  spec('hematologia', 'Hematologia', 150, 2.5, 2, 1),
  spec('infectologia', 'Infectologia', 150, 2.5, 2, 1),
  spec('medicina-da-familia', 'Medicina da Família', 120, 2.5, 2, 1),
  spec('nefrologia', 'Nefrologia', 150, 2.5, 2, 1),
  spec('neurologia-adulto', 'Neurologia Adulto', 150, 4, 2, 1),
  spec('neuropediatria', 'Neuropediatria', 250, 2.5, 2, 1),
  spec('nutricao', 'Nutrição', 40, 1.5, 1.33, 1),
  spec('nutrologia', 'Nutrologia', 130, 2.5, 2, 1),
  spec('oftalmologia', 'Oftalmologia', 120, 2.5, 2, 1),
  spec('ortopedia', 'Ortopedia', 120, 2.5, 2, 1),
  spec('otorrinolaringologia', 'Otorrinolaringologia', 120, 2.5, 2, 1),
  spec('pediatria', 'Pediatria', 150, 2.5, 2, 1),
  spec('pneumologia', 'Pneumologia', 150, 4, 2, 1),
  spec('psicologia-adulto', 'Psicologia Adulto', 40, 1.5, 2, 1),
  spec('psicologia-infantil', 'Psicologia Infantil', 60, 1.33, 1.33, 1),
  spec('psiquiatria-adulto', 'Psiquiatria Adulto', 120, 2.5, 2, 1),
  spec('psiquiatria-infantil', 'Psiquiatria Infantil', 180, 2.5, 2, 1),
  spec('reumatologia', 'Reumatologia', 150, 2.5, 2, 1),
  spec('urologia', 'Urologia', 120, 2.5, 2, 1),
  spec('medico-generalista', 'Médico Generalista', 70, 2.5, 2, 1),
];

export const PLAN_LABELS: Record<PlanId, string> = {
  popular: 'Popular',
  intermediario: 'Intermediário',
  premium: 'Premium',
};

export function getSpecialty(specialtyId: string): Specialty {
  const found = SPECIALTIES.find((s) => s.id === specialtyId);
  if (!found) {
    throw new Error(`Especialidade desconhecida: ${specialtyId}`);
  }
  return found;
}
