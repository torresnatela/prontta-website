import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PROGRAMA_MARGIN,
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

  it('o preço sugerido bate com os valores oficiais da tabela comercial', () => {
    expect([3, 6, 12].map((c) => getProgramSellPrice('performance', c as Cycle, 0.3))).toEqual([
      1350, 2500, 4200,
    ]);
    expect(getProgramSellPrice('emagrecimento-inteligente', 6, 0.3)).toBe(2300);
    expect(getProgramSellPrice('longevidade-ativa', 6, 0.3)).toBe(2850);
  });
});

// ---------------------------------------------------------------------------

describe('simulateAcademiaOwner — cenário padrão', () => {
  const result = simulateAcademiaOwner(baseInput);

  it('deriva o preço pela regra oficial: ceil R$ 50 sobre o TOTAL do ciclo', () => {
    // 1735 / (1 − 0,35) = 2669,23 → ceil50 → 2700 → 450/mês
    expect(result.repasseCycle).toBe(1735);
    expect(result.cycleSellTotal).toBe(2700);
    expect(result.monthlyPrice).toBe(450);
    expect(result.priceIsManual).toBe(false);
  });

  it('projeta receita e custo Prontta', () => {
    expect(result.pronttaMonthly).toBeCloseTo(289.1667, 4);
    expect(result.monthlyRevenue).toBe(11_250);
    expect(result.cycleRevenue).toBe(67_500);
    expect(result.pronttaMonthlyTotal).toBeCloseTo(7229.1667, 4);
    expect(result.pronttaCycleTotal).toBeCloseTo(43_375, 4);
  });

  it('calcula a comissão dos personais', () => {
    expect(result.personalPerSale).toBe(22.5);
    expect(result.personalCommissionMonthly).toBe(562.5);
    expect(result.personalCommissionCycle).toBe(3375);
  });

  it('fecha o lucro e a margem efetiva da academia', () => {
    expect(result.academyProfitMonthly).toBeCloseTo(3458.3333, 4);
    expect(result.academyProfitCycle).toBeCloseTo(20_750, 4);
    expect(result.effectiveMarginPercent).toBeCloseTo(30.7407, 4);
  });

  it('divide cada mensalidade entre os três lados', () => {
    expect(result.split.associadoPays).toBe(450);
    expect(result.split.prontta).toBeCloseTo(289.1667, 4);
    expect(result.split.personal).toBe(22.5);
    expect(result.split.academia).toBeCloseTo(138.3333, 4);
  });

  it('invariante: o split soma exatamente a mensalidade', () => {
    const { prontta, personal, academia, associadoPays } = result.split;
    expect(prontta + personal + academia).toBeCloseTo(associadoPays, 9);
  });

  it('invariante: o mix soma 100%', () => {
    const { pronttaPercent, personalPercent, academiaPercent } = result.mix;
    expect(pronttaPercent).toBeCloseTo(64.2593, 4);
    expect(personalPercent).toBeCloseTo(5, 9);
    expect(academiaPercent).toBeCloseTo(30.7407, 4);
    expect(pronttaPercent + personalPercent + academiaPercent).toBeCloseTo(100, 9);
  });
});

describe('simulateAcademiaOwner — outros ciclos', () => {
  it('ciclo de 3 meses', () => {
    const result = simulateAcademiaOwner({ ...baseInput, cycle: 3 });
    // 944 / 0,65 = 1452,3 → ceil50 → 1500 → 500/mês
    expect(result.cycleSellTotal).toBe(1500);
    expect(result.monthlyPrice).toBe(500);
    expect(result.academyProfitCycle).toBeCloseTo(12_025, 4);
    expect(result.effectiveMarginPercent).toBeCloseTo(32.0667, 4);
  });

  it('ciclo de 12 meses produz mensalidade quebrada — e isso é intencional', () => {
    // O ceil de R$ 50 é aplicado ao TOTAL do ciclo (regra oficial), não à
    // mensalidade. Se alguém "consertar" isso arredondando o mês, este teste cai.
    const result = simulateAcademiaOwner({ ...baseInput, cycle: 12 });
    expect(result.cycleSellTotal).toBe(4550); // ceil50(2932 / 0,65 = 4510,77)
    expect(result.monthlyPrice).toBeCloseTo(379.1667, 4);
    expect(result.monthlyPrice).not.toBe(380);
  });
});

describe('simulateAcademiaOwner — preço manual', () => {
  it('não é identidade: o ceil de R$ 50 devolve margem a mais que a nominal', () => {
    const result = simulateAcademiaOwner({ ...baseInput, manualMonthlyPrice: 450 });
    expect(result.priceIsManual).toBe(true);
    expect(result.cycleSellTotal).toBe(2700);
    // Pedimos 30%, mas o arredondamento de 2669,23 → 2700 entregou 30,74%.
    expect(result.resolvedOwnerMarginPercent).toBeCloseTo(30.7407, 4);
    expect(result.resolvedOwnerMarginPercent).not.toBeCloseTo(30, 2);
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
      expect(result.monthlyPrice).toBe(450);
    }
  });
});

describe('simulateAcademiaOwner — margem efetiva vs margem por venda', () => {
  it('divergem quando nem toda adesão vem de um personal', () => {
    const result = simulateAcademiaOwner({ ...baseInput, personalSales: 10 });
    expect(result.personalCommissionMonthly).toBe(225);
    expect(result.academyProfitMonthly).toBeCloseTo(3795.8333, 4);
    // Margem efetiva sobe (menos comissão paga); a margem por venda não muda.
    expect(result.effectiveMarginPercent).toBeCloseTo(33.7407, 4);
    expect(result.resolvedOwnerMarginPercent).toBeCloseTo(30.7407, 4);
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
    expect(result.cycleSellTotal).toBe(900); // ceil50(890)
    expect(result.cycleSellTotal).toBeGreaterThanOrEqual(result.repasseCycle);
    expect(result.effectiveMarginPercent).toBeCloseTo(1.1111, 4);
  });

  it('clampa margem e comissão nos limites do produto', () => {
    const result = simulateAcademiaOwner({
      ...baseInput,
      ownerMarginPercent: 999,
      personalCommissionPercent: 999,
    });
    // 70 + 20 = 90 → divisor 0,10
    expect(result.cycleSellTotal).toBe(ceil50(1735 / 0.1));
  });
});

function ceil50(value: number): number {
  return Math.ceil(value / 50) * 50;
}

// ---------------------------------------------------------------------------

describe('buildConversionScenarios', () => {
  it('projeta 1% / 3% / 5% de uma base de 800 alunos', () => {
    const result = simulateAcademiaOwner(baseInput);
    const scenarios = buildConversionScenarios(result, 6, 800);
    expect(scenarios.map((s) => s.students)).toEqual([8, 24, 40]);
    expect(scenarios[0].academyMonthlyProfit).toBeCloseTo(1106.6667, 4);
    expect(scenarios[1].academyMonthlyProfit).toBeCloseTo(3320, 4);
    expect(scenarios[2].academyMonthlyProfit).toBeCloseTo(5533.3333, 4);
    expect(scenarios[2].academyCycleProfit).toBeCloseTo(33_200, 4);
  });
});

// ---------------------------------------------------------------------------

describe('calculateAcademiaDRE', () => {
  const result = simulateAcademiaOwner(baseInput);
  const dre = calculateAcademiaDRE({ result, taxPercent: 6, expenses: NO_EXPENSES });

  it('reaproveita o calculateDRE do engine com o software zerado', () => {
    expect(dre.receitaBruta).toBe(11_250);
    expect(dre.impostos).toBe(675);
    // Programas nunca pagam software mensal.
    expect(dre.software).toBe(0);
    expect(dre.totalDespesas).toBeCloseTo(1237.5, 4);
    expect(dre.resultadoLiquido).toBeCloseTo(2783.3333, 4);
    expect(dre.margemLiquidaPct).toBeCloseTo(24.7407, 4);
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
    expect(modules.map((m) => m.unitSellPrice)).toEqual([250, 250, 150, 150]);
    expect(modules.map((m) => m.lineTotal)).toEqual([250, 500, 450, 1800]);
  });

  it('o módulo base é o fee de plataforma com a margem padrão', () => {
    expect(getBaseModulePrice(3)).toBe(150); // ceil50(100 / 0,7 = 142,86)
    expect(getBaseModulePrice(6)).toBe(400); // ceil50(250 / 0,7 = 357,14)
    expect(getBaseModulePrice(12)).toBe(600); // ceil50(400 / 0,7 = 571,43)
  });

  it('soma o pacote personalizado completo do Performance', () => {
    const all = getBuilderModules('performance', 6).map((m) => m.moduleId);
    const custom = priceCustomPackage('performance', 6, all);
    expect(custom.baseModulePrice).toBe(400);
    expect(custom.cycleTotal).toBe(3400); // 400 + 250 + 500 + 450 + 1800
    expect(custom.monthlyPrice).toBeCloseTo(566.6667, 4);
  });

  it('cobre os demais ciclos e programas', () => {
    const total = (programId: Parameters<typeof priceCustomPackage>[0], cycle: Cycle) => {
      const all = getBuilderModules(programId, cycle).map((m) => m.moduleId);
      return priceCustomPackage(programId, cycle, all).cycleTotal;
    };
    expect(total('performance', 3)).toBe(1850);
    expect(total('performance', 12)).toBe(5700);
    expect(total('emagrecimento-inteligente', 6)).toBe(3150);
    expect(total('longevidade-ativa', 12)).toBe(6450);
    expect(total('sono-e-energia', 6)).toBe(3450);
  });

  it('sem nenhum módulo selecionado, resta só a base', () => {
    const custom = priceCustomPackage('performance', 6, []);
    expect(custom.cycleTotal).toBe(400);
    expect(custom.lines).toHaveLength(0);
  });

  it('ignora ids que não existem no programa/ciclo', () => {
    const custom = priceCustomPackage('performance', 6, ['geriatria', 'inexistente']);
    expect(custom.cycleTotal).toBe(400);
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
    expect(bundle.cycleTotal).toBe(2500);
    expect(bundle.monthlyPrice).toBeCloseTo(416.6667, 4);
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
    // margem do dono = 1 − 1735/2700 = 0,357407 → 2932 / 0,642593 = 4562,4 → ceil50 4600
    const bundle = getAssociadoBundle({ programa: 'performance', ciclo: 6, preco: 450 }, 12);
    expect(bundle.cycleTotal).toBe(4600);
    expect(bundle.monthlyPrice).toBeCloseTo(383.3333, 4);
    expect(bundle.fromOwnerPrice).toBe(true);
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

    expect(comparison.bundleCycleTotal).toBe(2500);
    expect(comparison.customCycleTotal).toBe(3400);
    expect(comparison.savings).toBe(900);
    expect(comparison.bundleDiscountPercent).toBeCloseTo(26.4706, 4);
    expect(comparison.customPremiumPercent).toBeCloseTo(36, 4);
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
    // resultado 2.783,33/mês → 10.000/2.783,33 = 3,59 ; 15.000/2.783,33 = 5,39
    const impl = calculateImplantationPayback({ mode: 'a_combinar' }, dre.resultadoLiquido);
    expect(impl.value).toBeNull();
    expect(impl.paybackMonths?.min).toBeCloseTo(3.5928, 3);
    expect(impl.paybackMonths?.max).toBeCloseTo(5.3892, 3);
  });

  it('valor definido dá um payback único', () => {
    const impl = calculateImplantationPayback({ mode: 'valor', value: 12_500 }, dre.resultadoLiquido);
    expect(impl.value).toBe(12_500);
    expect(impl.paybackMonths?.min).toBeCloseTo(4.491, 3);
    expect(impl.paybackMonths?.min).toBe(impl.paybackMonths?.max);
  });

  it('sem lucro não existe payback (nunca Infinity na tela)', () => {
    expect(calculateImplantationPayback({ mode: 'valor', value: 12_500 }, 0).paybackMonths).toBeNull();
    expect(calculateImplantationPayback({ mode: 'a_combinar' }, -500).paybackMonths).toBeNull();
  });

  it('a implantação NÃO altera a DRE mensal — é investimento único', () => {
    // Mesmo racional do /proposta: consolidateProposal carrega a implantação,
    // mas calculateDRE a ignora.
    const semImplantacao = calculateAcademiaDRE({ result, taxPercent: 6, expenses: NO_EXPENSES });
    calculateImplantationPayback({ mode: 'valor', value: 15_000 }, semImplantacao.resultadoLiquido);
    expect(semImplantacao.resultadoLiquido).toBeCloseTo(2783.3333, 4);
  });
});

describe('priceExtras', () => {
  it('usa a margem de CONSULTA (60%), não a de programa — é venda avulsa', () => {
    // custo 100 → ceil50(100/0,4) = 250 ; custo 150 → ceil50(150/0,4) = 400
    const { lines, total } = priceExtras([
      { specialtyId: 'nutricao', quantity: 2 },
      { specialtyId: 'cardiologia-adulto', quantity: 1 },
    ]);
    expect(lines).toHaveLength(2);
    expect(lines[0].unitSellPrice).toBe(250);
    expect(lines[1].unitSellPrice).toBe(400);
    expect(total).toBe(900); // 250×2 + 400
  });

  it('a extra sai mais cara que o mesmo atendimento dentro do pacote', () => {
    // Módulo (componente de programa, 30%) vs consulta avulsa (60%).
    const dentroDoPacote = getBuilderModules('performance', 6).find(
      (m) => m.specialtyId === 'cardiologia-adulto',
    );
    const avulsa = priceExtras([{ specialtyId: 'cardiologia-adulto', quantity: 1 }]);
    expect(dentroDoPacote?.unitSellPrice).toBe(250);
    expect(avulsa.lines[0].unitSellPrice).toBe(400);
  });

  it('descarta quantidades zeradas', () => {
    const { lines, total } = priceExtras([{ specialtyId: 'nutricao', quantity: 0 }]);
    expect(lines).toHaveLength(0);
    expect(total).toBe(0);
  });

  it('os módulos do builder seguem a margem de PROGRAMA (30%)', () => {
    // Comparação maçã-com-maçã com o pacote fechado, que também usa 30%.
    const modules = getBuilderModules('performance', 6);
    expect(modules.map((m) => m.unitSellPrice)).toEqual([250, 250, 150, 150]);
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
