import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PROGRAMA_MARGIN,
  getProgramOfficialPrice,
  getProgramRepasse,
  getProgramSellPrice,
  type Cycle,
} from '@/lib/pricing';
import { ACADEMIA_CYCLES, ACADEMIA_PROGRAMS } from './catalog';
import {
  buildConversionScenarios,
  calculateAcademiaDRE,
  calculateImplantationPayback,
  compareBundleVsCustom,
  EXTRA_SPECIALTY_IDS,
  getAssociadoBundle,
  getBaseModulePrice,
  getBuilderModules,
  priceCustomPackage,
  priceExtras,
  simulateAcademiaOwner,
  type OwnerSimulatorInput,
} from './pricing';

const NO_EXPENSES = { pessoal: 0, aluguel: 0, fixas: 0, marketing: 0, outras: 0 };

/** Cenário padrão da página: Performance, 6 meses, 30% + 5%, 25 alunos, todas via personal. */
const baseInput: OwnerSimulatorInput = {
  programId: 'performance',
  cycle: 6,
  students: 25,
  personalSales: 25,
  ownerMarginPercent: 30,
  personalCommissionPercent: 5,
  manualMonthlyPrice: null,
};

// ---------------------------------------------------------------------------

describe('paridade com o engine oficial', () => {
  it('não reimplementa a tabela de repasse', () => {
    // custoBase + PLATFORM_FEE_BY_CYCLE {3:100, 6:250, 12:400}
    expect([3, 6, 12].map((c) => getProgramRepasse('performance', c as Cycle))).toEqual([
      944, 1735, 2932,
    ]);
    expect([3, 6, 12].map((c) => getProgramRepasse('sono-e-energia', c as Cycle))).toEqual([
      890, 1757, 3063,
    ]);
  });

  it('o preço derivado bate com a coluna "Ref. calc. ÷0,70" da planilha', () => {
    expect([3, 6, 12].map((c) => getProgramSellPrice('performance', c as Cycle, 0.3))).toEqual([
      1350, 2480, 4190,
    ]);
    expect(getProgramSellPrice('emagrecimento-inteligente', 6, 0.3)).toBe(2295);
    expect(getProgramSellPrice('longevidade-ativa', 6, 0.3)).toBe(2850);
  });

  it('não confunde o derivado com o preço de tabela V8', () => {
    // O V8 é comercialmente arredondado (2.700 = 6 × 450) e fica acima do que a
    // margem de 30% renderia. `lib/pricing/data.test.ts` trava a tabela toda.
    expect(getProgramOfficialPrice('performance', 6)).toBe(2700);
    expect(getProgramSellPrice('performance', 6, 0.3)).toBe(2480);
  });
});

// ---------------------------------------------------------------------------

describe('simulateAcademiaOwner — cenário padrão', () => {
  const result = simulateAcademiaOwner(baseInput);

  it('deriva o preço pela regra oficial: ceil R$ 5 sobre o TOTAL do ciclo', () => {
    // 1735 / (1 − 0,35) = 2669,23 → ceil5 → 2670 → 445/mês
    expect(result.repasseCycle).toBe(1735);
    expect(result.cycleSellTotal).toBe(2670);
    expect(result.monthlyPrice).toBe(445);
    expect(result.priceIsManual).toBe(false);
  });

  it('projeta receita e custo Prontta', () => {
    expect(result.pronttaMonthly).toBeCloseTo(289.1667, 4);
    expect(result.monthlyRevenue).toBe(11_125);
    expect(result.cycleRevenue).toBe(66_750);
    expect(result.pronttaMonthlyTotal).toBeCloseTo(7229.1667, 4);
    expect(result.pronttaCycleTotal).toBeCloseTo(43_375, 4);
  });

  it('calcula a comissão dos personais', () => {
    expect(result.personalPerSale).toBe(22.25);
    expect(result.personalCommissionMonthly).toBe(556.25);
    expect(result.personalCommissionCycle).toBe(3337.5);
  });

  it('fecha o lucro e a margem efetiva da academia', () => {
    expect(result.academyProfitMonthly).toBeCloseTo(3339.5833, 4);
    expect(result.academyProfitCycle).toBeCloseTo(20_037.5, 4);
    // Com o passo de R$ 5 o arredondamento quase não distorce a margem pedida:
    // 30,02% contra os 30,74% que o passo de R$ 50 entregava.
    expect(result.effectiveMarginPercent).toBeCloseTo(30.0187, 4);
  });

  it('divide cada mensalidade entre os três lados', () => {
    expect(result.split.associadoPays).toBe(445);
    expect(result.split.prontta).toBeCloseTo(289.1667, 4);
    expect(result.split.personal).toBe(22.25);
    expect(result.split.academia).toBeCloseTo(133.5833, 4);
  });

  it('invariante: o split soma exatamente a mensalidade', () => {
    const { prontta, personal, academia, associadoPays } = result.split;
    expect(prontta + personal + academia).toBeCloseTo(associadoPays, 9);
  });

  it('invariante: o mix soma 100%', () => {
    const { pronttaPercent, personalPercent, academiaPercent } = result.mix;
    expect(pronttaPercent).toBeCloseTo(64.9813, 4);
    expect(personalPercent).toBeCloseTo(5, 9);
    expect(academiaPercent).toBeCloseTo(30.0187, 4);
    expect(pronttaPercent + personalPercent + academiaPercent).toBeCloseTo(100, 9);
  });
});

describe('simulateAcademiaOwner — outros ciclos', () => {
  it('ciclo de 3 meses', () => {
    const result = simulateAcademiaOwner({ ...baseInput, cycle: 3 });
    // 944 / 0,65 = 1452,3 → ceil5 → 1455 → 485/mês
    expect(result.cycleSellTotal).toBe(1455);
    expect(result.monthlyPrice).toBe(485);
    expect(result.academyProfitCycle).toBeCloseTo(10_956.25, 4);
    expect(result.effectiveMarginPercent).toBeCloseTo(30.1203, 4);
  });

  it('ciclo de 12 meses produz mensalidade quebrada — e isso é intencional', () => {
    // O ceil de R$ 5 é aplicado ao TOTAL do ciclo (regra oficial), não à
    // mensalidade. Se alguém "consertar" isso arredondando o mês, este teste cai.
    const result = simulateAcademiaOwner({ ...baseInput, cycle: 12 });
    expect(result.cycleSellTotal).toBe(4515); // ceil5(2932 / 0,65 = 4510,77)
    expect(result.monthlyPrice).toBeCloseTo(376.25, 4);
    expect(result.monthlyPrice).not.toBe(380);
  });
});

describe('simulateAcademiaOwner — preço manual', () => {
  it('um preço manual acima do derivado sobe a margem re-derivada', () => {
    const result = simulateAcademiaOwner({ ...baseInput, manualMonthlyPrice: 450 });
    expect(result.priceIsManual).toBe(true);
    expect(result.cycleSellTotal).toBe(2700);
    // O derivado seria 445/mês; cobrar 450 entrega 30,74% em vez de 30,02%.
    expect(result.resolvedOwnerMarginPercent).toBeCloseTo(30.7407, 4);
  });

  it('um preço manual mais alto sobe a margem re-derivada', () => {
    const result = simulateAcademiaOwner({ ...baseInput, manualMonthlyPrice: 600 });
    expect(result.monthlyPrice).toBe(600);
    expect(result.cycleSellTotal).toBe(3600);
    // 1 − 289,1667/600 − 0,05 = 46,80%
    expect(result.resolvedOwnerMarginPercent).toBeCloseTo(46.8056, 4);
  });

  it('ignora preço manual inválido e volta ao derivado', () => {
    for (const manualMonthlyPrice of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = simulateAcademiaOwner({ ...baseInput, manualMonthlyPrice });
      expect(result.priceIsManual).toBe(false);
      expect(result.monthlyPrice).toBe(445);
    }
  });
});

describe('simulateAcademiaOwner — margem efetiva vs margem por venda', () => {
  it('divergem quando nem toda adesão vem de um personal', () => {
    const result = simulateAcademiaOwner({ ...baseInput, personalSales: 10 });
    expect(result.personalCommissionMonthly).toBe(222.5);
    expect(result.academyProfitMonthly).toBeCloseTo(3673.3333, 4);
    // Margem efetiva sobe (menos comissão paga); a margem por venda não muda.
    expect(result.effectiveMarginPercent).toBeCloseTo(33.0187, 4);
    expect(result.resolvedOwnerMarginPercent).toBeCloseTo(30.0187, 4);
  });
});

describe('simulateAcademiaOwner — bordas', () => {
  it('sem alunos, tudo zera sem NaN ou Infinity', () => {
    const result = simulateAcademiaOwner({ ...baseInput, students: 0, personalSales: 0 });
    for (const value of Object.values(result)) {
      if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
    }
    expect(result.monthlyRevenue).toBe(0);
    expect(result.effectiveMarginPercent).toBe(0);
    expect(result.mix).toEqual({ pronttaPercent: 0, personalPercent: 0, academiaPercent: 100 });
  });

  it('limita personalSales ao número de alunos', () => {
    const result = simulateAcademiaOwner({ ...baseInput, students: 10, personalSales: 999 });
    expect(result.personalCommissionMonthly).toBe(10 * result.personalPerSale);
  });

  it('com margem e comissão zeradas o preço nunca fica abaixo do repasse', () => {
    const result = simulateAcademiaOwner({
      ...baseInput,
      programId: 'sono-e-energia',
      cycle: 3,
      ownerMarginPercent: 0,
      personalCommissionPercent: 0,
    });
    expect(result.repasseCycle).toBe(890);
    expect(result.cycleSellTotal).toBe(890); // 890 já é múltiplo de 5
    expect(result.cycleSellTotal).toBeGreaterThanOrEqual(result.repasseCycle);
    expect(result.effectiveMarginPercent).toBeCloseTo(0, 9);
  });

  it('clampa margem e comissão nos limites do produto', () => {
    const result = simulateAcademiaOwner({
      ...baseInput,
      ownerMarginPercent: 999,
      personalCommissionPercent: 999,
    });
    // 70 + 20 = 90 → divisor 0,10
    expect(result.cycleSellTotal).toBe(ceil5(1735 / 0.1));
  });
});

function ceil5(value: number): number {
  return Math.ceil(value / 5) * 5;
}

// ---------------------------------------------------------------------------

describe('buildConversionScenarios', () => {
  it('projeta 1% / 3% / 5% de uma base de 800 alunos', () => {
    const result = simulateAcademiaOwner(baseInput);
    const scenarios = buildConversionScenarios(result, 6, 800);
    expect(scenarios.map((s) => s.students)).toEqual([8, 24, 40]);
    expect(scenarios[0].academyMonthlyProfit).toBeCloseTo(1068.6667, 4);
    expect(scenarios[1].academyMonthlyProfit).toBeCloseTo(3206, 4);
    expect(scenarios[2].academyMonthlyProfit).toBeCloseTo(5343.3333, 4);
    expect(scenarios[2].academyCycleProfit).toBeCloseTo(32_060, 4);
  });
});

// ---------------------------------------------------------------------------

describe('calculateAcademiaDRE', () => {
  const result = simulateAcademiaOwner(baseInput);
  const dre = calculateAcademiaDRE({ result, taxPercent: 6, expenses: NO_EXPENSES });

  it('reaproveita o calculateDRE do engine com o software zerado', () => {
    expect(dre.receitaBruta).toBe(11_125);
    expect(dre.impostos).toBeCloseTo(667.5, 4);
    // Programas nunca pagam software mensal.
    expect(dre.software).toBe(0);
    expect(dre.totalDespesas).toBeCloseTo(1223.75, 4);
    expect(dre.resultadoLiquido).toBeCloseTo(2672.0833, 4);
    expect(dre.margemLiquidaPct).toBeCloseTo(24.0187, 4);
  });

  it('mantém a comissão FORA do repasse à Prontta', () => {
    expect(dre.repasse).toBeCloseTo(result.pronttaMonthlyTotal, 9);
    expect(dre.repasse).not.toBeCloseTo(
      result.pronttaMonthlyTotal + result.personalCommissionMonthly,
      2,
    );
  });

  it('reconcilia com o painel: margemBruta − comissão === lucro exibido', () => {
    expect(dre.margemBruta - result.personalCommissionMonthly).toBeCloseTo(
      result.academyProfitMonthly,
      9,
    );
  });

  it('não sobrescreve o campo "outras" digitado pelo dono', () => {
    const comExtras = calculateAcademiaDRE({
      result,
      taxPercent: 6,
      expenses: { ...NO_EXPENSES, outras: 100 },
    });
    expect(comExtras.totalDespesas).toBeCloseTo(dre.totalDespesas + 100, 9);
  });
});

// ---------------------------------------------------------------------------

describe('getBuilderModules / priceCustomPackage', () => {
  it('monta os módulos do Performance no ciclo de 6 meses', () => {
    const modules = getBuilderModules('performance', 6);
    expect(modules.map((m) => m.moduleId)).toEqual([
      'cardiologia-adulto',
      'endocrinologia',
      'nutricao',
      'psicologia-adulto',
    ]);
    expect(modules.map((m) => m.quantity)).toEqual([1, 2, 3, 12]);
    expect(modules.map((m) => m.unitSellPrice)).toEqual([190, 190, 110, 110]);
    expect(modules.map((m) => m.lineTotal)).toEqual([190, 380, 330, 1320]);
  });

  it('o módulo base é o fee de plataforma com a margem padrão', () => {
    expect(getBaseModulePrice(3)).toBe(145); // ceil5(100 / 0,7 = 142,86)
    expect(getBaseModulePrice(6)).toBe(360); // ceil5(250 / 0,7 = 357,14)
    expect(getBaseModulePrice(12)).toBe(575); // ceil5(400 / 0,7 = 571,43)
  });

  it('soma o pacote personalizado completo do Performance', () => {
    const all = getBuilderModules('performance', 6).map((m) => m.moduleId);
    const custom = priceCustomPackage('performance', 6, all);
    expect(custom.baseModulePrice).toBe(360);
    expect(custom.cycleTotal).toBe(2580); // 360 + 190 + 380 + 330 + 1320
    expect(custom.monthlyPrice).toBe(430);
  });

  it('cobre os demais ciclos e programas', () => {
    const total = (programId: Parameters<typeof priceCustomPackage>[0], cycle: Cycle) => {
      const all = getBuilderModules(programId, cycle).map((m) => m.moduleId);
      return priceCustomPackage(programId, cycle, all).cycleTotal;
    };
    expect(total('performance', 3)).toBe(1405);
    expect(total('performance', 12)).toBe(4355);
    expect(total('emagrecimento-inteligente', 6)).toBe(2390);
    expect(total('longevidade-ativa', 12)).toBe(4885);
    expect(total('sono-e-energia', 6)).toBe(2620);
  });

  it('sem nenhum módulo selecionado, resta só a base', () => {
    const custom = priceCustomPackage('performance', 6, []);
    expect(custom.cycleTotal).toBe(360);
    expect(custom.lines).toHaveLength(0);
  });

  it('ignora ids que não existem no programa/ciclo', () => {
    const custom = priceCustomPackage('performance', 6, ['geriatria', 'inexistente']);
    expect(custom.cycleTotal).toBe(360);
  });
});

describe('promessa do produto: montar sai sempre mais caro que o pacote fechado', () => {
  it('vale para os 4 programas × 3 ciclos', () => {
    for (const entry of ACADEMIA_PROGRAMS) {
      for (const cycle of ACADEMIA_CYCLES) {
        const all = getBuilderModules(entry.id, cycle).map((m) => m.moduleId);
        const custom = priceCustomPackage(entry.id, cycle, all);
        const bundle = getProgramSellPrice(entry.id, cycle, DEFAULT_PROGRAMA_MARGIN);
        expect(
          custom.cycleTotal,
          `${entry.id}/${cycle}m: custom ${custom.cycleTotal} vs pacote ${bundle}`,
        ).toBeGreaterThan(bundle);
      }
    }
  });
});

// ---------------------------------------------------------------------------

describe('getAssociadoBundle', () => {
  it('sem ?preco=, usa o preço sugerido pelo engine', () => {
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: null }, 6);
    expect(bundle.cycleTotal).toBe(2480);
    expect(bundle.monthlyPrice).toBeCloseTo(413.3333, 4);
    expect(bundle.fromOwnerPrice).toBe(false);
    expect(bundle.composition.map((l) => l.specialtyName)).toEqual([
      'Cardiologia Adulto',
      'Endocrinologia',
      'Nutrição',
      'Psicologia Adulto',
    ]);
  });

  it('com ?preco=, respeita exatamente o valor da academia no ciclo original', () => {
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: 450 }, 6);
    expect(bundle.cycleTotal).toBe(2700);
    expect(bundle.monthlyPrice).toBe(450);
    expect(bundle.fromOwnerPrice).toBe(true);
  });

  it('reprojeta a margem da academia ao trocar de ciclo', () => {
    // margem do dono = 1 − 1735/2670 = 0,350187 → 2932 / 0,649813 = 4512,1 → ceil5 4515
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: 445 }, 12);
    expect(bundle.cycleTotal).toBe(4515);
    expect(bundle.monthlyPrice).toBeCloseTo(376.25, 4);
    expect(bundle.fromOwnerPrice).toBe(true);
  });

  it('o round-trip do simulador preserva o total do ciclo, sem centavos fantasma', () => {
    // Ciclo 12: total 4515 → mensalidade 376,25 → o link leva 376,25.
    // Em outros programas a mensalidade é dízima e o Math.round recupera o total.
    for (const cycle of ACADEMIA_CYCLES) {
      for (const entry of ACADEMIA_PROGRAMS) {
        const simulado = simulateAcademiaOwner({
          ...baseInput,
          programId: entry.id,
          cycle,
        });
        const precoNoLink = Math.round(simulado.monthlyPrice * 100) / 100;
        const bundle = getAssociadoBundle(
          { programa: entry.id, ciclo: cycle, preco: precoNoLink },
          cycle,
        );
        expect(
          bundle.cycleTotal,
          `${entry.id}/${cycle}m: link ${precoNoLink} devolveu ${bundle.cycleTotal}`,
        ).toBe(simulado.cycleSellTotal);
      }
    }
  });

  it('a composição acompanha o ciclo visualizado', () => {
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: null }, 12);
    expect(bundle.composition.map((l) => l.quantity)).toEqual([2, 4, 6, 18]);
  });
});

describe('compareBundleVsCustom', () => {
  it('quantifica a economia do pacote fechado', () => {
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: null }, 6);
    const all = getBuilderModules('performance', 6).map((m) => m.moduleId);
    const custom = priceCustomPackage('performance', 6, all);
    const comparison = compareBundleVsCustom(bundle, custom);

    expect(comparison.bundleCycleTotal).toBe(2480);
    expect(comparison.customCycleTotal).toBe(2580);
    expect(comparison.savings).toBe(100);
    expect(comparison.bundleDiscountPercent).toBeCloseTo(3.876, 3);
    expect(comparison.customPremiumPercent).toBeCloseTo(4.0323, 4);
  });
});

describe('calculateImplantationPayback', () => {
  const result = simulateAcademiaOwner(baseInput);
  const dre = calculateAcademiaDRE({ result, taxPercent: 6, expenses: NO_EXPENSES });

  it('isenta dá payback imediato', () => {
    const impl = calculateImplantationPayback({ mode: 'isento' }, dre.resultadoLiquido);
    expect(impl.value).toBe(0);
    expect(impl.paybackMonths).toEqual({ min: 0, max: 0 });
  });

  it('"a combinar" usa a faixa oficial R$ 10 mil – R$ 15 mil', () => {
    // resultado 2.672,08/mês → 10.000/2.672,08 = 3,74 ; 15.000/2.672,08 = 5,61
    const impl = calculateImplantationPayback({ mode: 'a_combinar' }, dre.resultadoLiquido);
    expect(impl.value).toBeNull();
    expect(impl.paybackMonths?.min).toBeCloseTo(3.7424, 3);
    expect(impl.paybackMonths?.max).toBeCloseTo(5.6136, 3);
  });

  it('valor definido dá um payback único', () => {
    const impl = calculateImplantationPayback({ mode: 'valor', value: 12_500 }, dre.resultadoLiquido);
    expect(impl.value).toBe(12_500);
    expect(impl.paybackMonths?.min).toBeCloseTo(4.678, 3);
    expect(impl.paybackMonths?.min).toBe(impl.paybackMonths?.max);
  });

  it('sem lucro não existe payback (nunca Infinity na tela)', () => {
    expect(calculateImplantationPayback({ mode: 'valor', value: 12_500 }, 0).paybackMonths).toBeNull();
    expect(calculateImplantationPayback({ mode: 'a_combinar' }, -500).paybackMonths).toBeNull();
  });

  it('isento continua zero mesmo no prejuízo — não há investimento a recuperar', () => {
    // Deliberado, e diferente dos outros modos: `value: 0` é o que distingue
    // "nada a pagar" de "payback indefinido".
    const impl = calculateImplantationPayback({ mode: 'isento' }, -500);
    expect(impl.value).toBe(0);
    expect(impl.paybackMonths).toEqual({ min: 0, max: 0 });
  });

  it('a implantação NÃO altera a DRE mensal — é investimento único', () => {
    // Mesmo racional do /proposta: consolidateProposal carrega a implantação,
    // mas calculateDRE a ignora.
    const semImplantacao = calculateAcademiaDRE({ result, taxPercent: 6, expenses: NO_EXPENSES });
    calculateImplantationPayback({ mode: 'valor', value: 15_000 }, semImplantacao.resultadoLiquido);
    expect(semImplantacao.resultadoLiquido).toBeCloseTo(2672.0833, 4);
  });
});

describe('priceExtras', () => {
  it('usa a margem de consulta do padrão oficial (30%)', () => {
    // custo 75 → ceil5(75/0,7) = 110 ; custo 130 → ceil5(130/0,7) = 190
    const { lines, total } = priceExtras([
      { specialtyId: 'nutricao', quantity: 2 },
      { specialtyId: 'cardiologia-adulto', quantity: 1 },
    ]);
    expect(lines).toHaveLength(2);
    expect(lines[0].unitSellPrice).toBe(110);
    expect(lines[1].unitSellPrice).toBe(190);
    expect(total).toBe(410); // 110×2 + 190
  });

  it('a extra custa o mesmo que o atendimento dentro do pacote', () => {
    // A planilha oficial tem UMA margem de parceiro (30%), então o desconto do
    // pacote fechado vem do preço do programa, não de um preço de avulsa inflado.
    const dentroDoPacote = getBuilderModules('performance', 6).find(
      (m) => m.specialtyId === 'cardiologia-adulto',
    );
    const avulsa = priceExtras([{ specialtyId: 'cardiologia-adulto', quantity: 1 }]);
    expect(dentroDoPacote?.unitSellPrice).toBe(190);
    expect(avulsa.lines[0].unitSellPrice).toBe(190);
  });

  it('descarta quantidades zeradas', () => {
    const { lines, total } = priceExtras([{ specialtyId: 'nutricao', quantity: 0 }]);
    expect(lines).toHaveLength(0);
    expect(total).toBe(0);
  });

  it('os módulos do builder seguem a margem de PROGRAMA (30%)', () => {
    // Comparação maçã-com-maçã com o pacote fechado, que também usa 30%.
    const modules = getBuilderModules('performance', 6);
    expect(modules.map((m) => m.unitSellPrice)).toEqual([190, 190, 110, 110]);
  });

  it('expõe só especialidades presentes nos 4 programas', () => {
    expect(EXTRA_SPECIALTY_IDS).toEqual([
      'cardiologia-adulto',
      'endocrinologia',
      'geriatria',
      'medico-generalista',
      'neurologia-adulto',
      'nutricao',
      'psicologia-adulto',
    ]);
  });
});
