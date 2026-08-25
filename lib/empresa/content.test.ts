import { describe, expect, it } from 'vitest';
import { resolveNarrative } from '@/lib/proposta/narrative';
import { SERVICE_MODELS, type ServiceModel } from './pricing';
import { getEmpresaImplantationNote, getEmpresaNarrative } from './content';

const everyString = (narrative: ReturnType<typeof getEmpresaNarrative>): string[] => [
  narrative.category,
  narrative.headline,
  narrative.subheadline,
  narrative.positioningNotIs,
  narrative.legalFramework,
  narrative.risks,
  narrative.holdHarmless,
  narrative.cta.primary,
  narrative.cta.secondary,
  narrative.footerNote,
  narrative.heroExample.title,
  narrative.heroExample.note,
  narrative.heroExample.disclaimer,
  ...Object.values(narrative.legalNotes),
  ...narrative.scope.included,
  ...narrative.scope.notIncluded,
  ...narrative.responsibilities.flatMap((r) => [r.party, r.description]),
  ...narrative.compliance.flatMap((c) => [c.title, c.description]),
];

describe.each(SERVICE_MODELS)('narrativa da empresa — modelo %s', (serviceModel) => {
  const narrative = getEmpresaNarrative(serviceModel);

  it('preenche todos os campos do contrato', () => {
    for (const text of everyString(narrative)) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
    expect(narrative.heroExample.stats).toHaveLength(3);
  });

  /**
   * A defesa mais barata contra copiar texto da revenda para cá: nenhuma
   * palavra do vocabulário de revendedor pode aparecer numa proposta em que o
   * comprador não revende nada.
   */
  it('não carrega vocabulário de revenda', () => {
    const proibido =
      /dicotomia|parceiro leigo|revenda|sua margem|resultado líquido|receita bruta|repasse à Prontta/i;
    for (const text of everyString(narrative)) {
      expect(text).not.toMatch(proibido);
    }
  });

  it('afirma que não é plano de saúde e que não substitui o ocupacional', () => {
    const titulos = narrative.compliance.map((c) => c.title).join(' · ');
    expect(titulos).toMatch(/não plano de saúde/i);
    expect(titulos).toMatch(/ocupacional/i);
    expect(narrative.positioningNotIs).toMatch(/não é plano de saúde/i);
  });

  it('protege o dado clínico do colaborador e a voluntariedade da adesão', () => {
    const titulos = narrative.compliance.map((c) => c.title).join(' · ');
    expect(titulos).toMatch(/não acessa dados clínicos/i);
    expect(titulos).toMatch(/adesão voluntária/i);
  });

  it('cita o desconto em folha e mantém o marco legal da telessaúde', () => {
    expect(narrative.legalFramework).toContain('14.510/2022');
    expect(narrative.legalFramework).toMatch(/462/);
  });

  it('trata o colaborador como titular dos dados, não a empresa', () => {
    const partes = narrative.responsibilities.map((r) => r.party);
    expect(partes).toContain('Empresa contratante');
    expect(partes).toContain('Colaborador');
    expect(partes).not.toContain('Parceiro físico');
  });
});

describe('narrativa por modelo de atendimento', () => {
  it('o ponto de acesso fala de sala e infraestrutura local; o remoto não', () => {
    const ponto = getEmpresaNarrative('ponto_de_acesso');
    const remoto = getEmpresaNarrative('remoto');

    expect(ponto.scope.notIncluded.join(' ')).toMatch(/sala|infraestrutura local/i);
    expect(remoto.scope.notIncluded.join(' ')).not.toMatch(/mobiliário|energia, internet/i);
    expect(ponto.holdHarmless).toMatch(/infraestrutura local/i);
    expect(remoto.holdHarmless).toMatch(/dispositivo|conexão/i);
  });

  it('só o ponto de acesso tem a regra de telessaúde pura no local', () => {
    const titulo = /telessaúde pura no ponto de acesso/i;
    expect(getEmpresaNarrative('ponto_de_acesso').compliance.map((c) => c.title).join()).toMatch(titulo);
    expect(getEmpresaNarrative('remoto').compliance.map((c) => c.title).join()).not.toMatch(titulo);
  });

  it('o remoto não cobra implantação', () => {
    expect(getEmpresaImplantationNote('remoto').label).toBe('Não aplicável');
    expect(getEmpresaImplantationNote('remoto').note).toMatch(/não há.*taxa de implantação/i);
    expect(getEmpresaImplantationNote('ponto_de_acesso').note).toMatch(/R\$ 10 mil a R\$ 15 mil/);
  });

  it('os dois modelos sempre incluem a operação médica e os relatórios agregados', () => {
    for (const model of SERVICE_MODELS as readonly ServiceModel[]) {
      const included = getEmpresaNarrative(model).scope.included.join(' ');
      expect(included).toMatch(/operação médica completa/i);
      expect(included).toMatch(/agregados e anonimizados/i);
    }
  });
});

describe('resolveNarrative', () => {
  it('devolve o texto de revenda com o vocabulário do canal', () => {
    const clinica = resolveNarrative({ mode: 'revenda', clientType: 'clinica', serviceModel: 'remoto' });
    const academia = resolveNarrative({ mode: 'revenda', clientType: 'academia', serviceModel: 'remoto' });

    expect(clinica.headline).toMatch(/sua clínica/i);
    expect(academia.headline).toMatch(/sua academia/i);
    // A revenda continua mostrando margem — é o bloco que o benefício não tem.
    expect(clinica.heroExample.stats.map((s) => s.label).join()).toMatch(/margem líquida/i);
  });

  it('devolve o texto de benefício no modo beneficio, ignorando o clientType', () => {
    const narrative = resolveNarrative({
      mode: 'beneficio',
      clientType: 'empresa',
      serviceModel: 'ponto_de_acesso',
    });
    expect(narrative.headline).toMatch(/sua empresa/i);
    expect(narrative.heroExample.stats.map((s) => s.label).join()).toMatch(/por colaborador/i);
  });
});
