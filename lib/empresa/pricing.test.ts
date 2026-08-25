import { describe, expect, it } from 'vitest';
import {
  getConsultationCost,
  getProgramRepasse,
  getProgramSellPrice,
  PROGRAMS,
  type Cycle,
  type ProgramSelection,
} from '@/lib/pricing';
import {
  calculateBenefitCost,
  employeeSharePercent,
  estimateReturn,
  getEmpresaConsultationPrice,
  getEmpresaProgramCyclePrice,
  summarizeProgramsMonthly,
  EMPRESA_MARGIN,
  MONTHS_PER_YEAR,
  RETURN_DEFAULTS,
  WORKING_DAYS_PER_MONTH,
  type Funding,
} from './pricing';

const selection = (
  id: string,
  programId: string,
  cycle: 3 | 6 | 12,
  quantity: number,
): ProgramSelection => ({ id, programId, cycle, quantity });

describe('paridade com o engine oficial', () => {
  it('é zero — a empresa não revende, então não há margem', () => {
    expect(EMPRESA_MARGIN).toBe(0);
  });

  it('o preço da consulta à empresa é o custo do engine, sem desvio', () => {
    expect(getEmpresaConsultationPrice('cardiologia-adulto', 'popular')).toBe(
      getConsultationCost('cardiologia-adulto', 'popular'),
    );
    // Valor travado por lib/pricing/data.test.ts — a empresa paga os mesmos R$ 130.
    expect(getEmpresaConsultationPrice('cardiologia-adulto', 'popular')).toBe(130);
  });

  it('o preço do ciclo à empresa é o repasse EXATO, nas 36 combinações', () => {
    const cycles: Cycle[] = [3, 6, 12];
    for (const program of PROGRAMS) {
      for (const cycle of cycles) {
        expect(getEmpresaProgramCyclePrice(program.id, cycle)).toBe(
          getProgramRepasse(program.id, cycle),
        );
      }
    }
  });

  /**
   * O contraexemplo que justifica não reaproveitar `getProgramSellPrice(id, c, 0)`:
   * ele passa pelo ceilToStep e infla o repasse em até R$ 4. A página promete
   * que a empresa paga o repasse — este teste impede a "simplificação".
   */
  it('NÃO passa pelo preço de venda com margem 0 — o ceilToStep inflaria o repasse', () => {
    expect(getProgramRepasse('mente-em-equilibrio', 6)).toBe(1386);
    expect(getProgramSellPrice('mente-em-equilibrio', 6, 0)).toBe(1390);
    expect(getEmpresaProgramCyclePrice('mente-em-equilibrio', 6)).toBe(1386);

    const inflados = PROGRAMS.flatMap((program) =>
      ([3, 6, 12] as Cycle[]).filter(
        (cycle) =>
          getProgramSellPrice(program.id, cycle, 0) !== getProgramRepasse(program.id, cycle),
      ),
    );
    expect(inflados.length).toBe(25);
  });
});

describe('employeeSharePercent', () => {
  it('mapeia os três modos de custeio para um percentual só', () => {
    expect(employeeSharePercent({ mode: 'integral' })).toBe(0);
    expect(employeeSharePercent({ mode: 'colaborador' })).toBe(100);
    expect(employeeSharePercent({ mode: 'coparticipacao', employeePercent: 30 })).toBe(30);
  });

  it('trava a coparticipação em [0, 100] e neutraliza valor inválido', () => {
    expect(employeeSharePercent({ mode: 'coparticipacao', employeePercent: -10 })).toBe(0);
    expect(employeeSharePercent({ mode: 'coparticipacao', employeePercent: 140 })).toBe(100);
    expect(employeeSharePercent({ mode: 'coparticipacao', employeePercent: NaN })).toBe(0);
  });
});

describe('summarizeProgramsMonthly', () => {
  it('amortiza o ciclo no mês e preserva o compromisso cheio', () => {
    // performance 6m: custo 1485 + fee 250 = 1735, já múltiplo de R$ 5.
    const summary = summarizeProgramsMonthly([selection('a', 'performance', 6, 4)]);

    expect(summary.items[0].cyclePrice).toBe(1735);
    expect(summary.items[0].cycleTotal).toBe(6940);
    expect(summary.items[0].monthlyEquivalent).toBeCloseTo(6940 / 6, 6);
    expect(summary.cycleCommitment).toBe(6940);
    expect(summary.monthlyTotal).toBeCloseTo(1156.6667, 3);
  });

  it('cobra o repasse cheio, sem arredondar', () => {
    // mente-em-equilibrio 6m: 1136 + fee 250 = 1386. Nem um real a mais.
    const summary = summarizeProgramsMonthly([selection('a', 'mente-em-equilibrio', 6, 1)]);
    expect(summary.items[0].cyclePrice).toBe(1386);
    expect(summary.items[0].monthlyEquivalent).toBeCloseTo(1386 / 6, 6);
  });

  it('soma ciclos diferentes sem misturar as bases', () => {
    const summary = summarizeProgramsMonthly([
      selection('a', 'performance', 6, 1), // 1735 -> 289,1667/mês
      selection('b', 'respirar-livre', 3, 2), // 877+100=977; 1954 -> 651,3333/mês
    ]);

    expect(summary.cycleCommitment).toBe(1735 + 1954);
    expect(summary.monthlyTotal).toBeCloseTo(1735 / 6 + 1954 / 3, 6);
  });

  it('devolve zeros com lista vazia', () => {
    const summary = summarizeProgramsMonthly([]);
    expect(summary.items).toEqual([]);
    expect(summary.monthlyTotal).toBe(0);
    expect(summary.cycleCommitment).toBe(0);
  });
});

describe('calculateBenefitCost', () => {
  const base = {
    consultationsMonthly: 10_000,
    programSelections: [selection('a', 'performance', 6, 4)] as ProgramSelection[],
    softwareMonthlyFee: 0,
    headcount: 320,
    adhesionPercent: 45,
    funding: { mode: 'integral' } as Funding,
  };

  it('a adesão DIVIDE o custo, não multiplica', () => {
    const half = calculateBenefitCost({ ...base, adhesionPercent: 90 });
    const full = calculateBenefitCost({ ...base, adhesionPercent: 45 });

    // Mesmo investimento nos dois: o mix é o volume contratado, não um pacote por cabeça.
    expect(half.monthlyTotal).toBeCloseTo(full.monthlyTotal, 6);
    // O que muda é por quantas pessoas ele se reparte.
    expect(half.adherents).toBe(288);
    expect(full.adherents).toBe(144);
    expect(half.costPerAdherent).toBeCloseTo(full.costPerAdherent / 2, 6);
  });

  it('compõe o mensal e projeta o anual e o compromisso do ciclo', () => {
    const cost = calculateBenefitCost(base);

    expect(cost.programsMonthly).toBeCloseTo(6940 / 6, 6);
    expect(cost.monthlyTotal).toBeCloseTo(10_000 + 6940 / 6, 6);
    expect(cost.annualTotal).toBeCloseTo(cost.monthlyTotal * MONTHS_PER_YEAR, 6);
    expect(cost.cycleCommitment).toBe(6940);
  });

  it('divide o per capita por elegíveis e por aderentes', () => {
    const cost = calculateBenefitCost(base);

    expect(cost.eligible).toBe(320);
    expect(cost.adherents).toBe(144);
    expect(cost.costPerEligible).toBeCloseTo(cost.monthlyTotal / 320, 6);
    expect(cost.costPerAdherent).toBeCloseTo(cost.monthlyTotal / 144, 6);
  });

  it('rateia entre empresa e colaborador, e as duas partes fecham o total', () => {
    const cost = calculateBenefitCost({
      ...base,
      funding: { mode: 'coparticipacao', employeePercent: 30 },
    });

    expect(cost.employeeSharePercent).toBe(30);
    expect(cost.employeeMonthly).toBeCloseTo(cost.monthlyTotal * 0.3, 6);
    expect(cost.companyMonthly + cost.employeeMonthly).toBeCloseTo(cost.monthlyTotal, 6);
    expect(cost.employeeOutOfPocket).toBeCloseTo(cost.employeeMonthly / 144, 6);
  });

  it('custeio integral não cobra nada do colaborador; colaborador não cobra nada da empresa', () => {
    const integral = calculateBenefitCost({ ...base, funding: { mode: 'integral' } });
    expect(integral.employeeMonthly).toBe(0);
    expect(integral.companyMonthly).toBeCloseTo(integral.monthlyTotal, 6);

    const colaborador = calculateBenefitCost({ ...base, funding: { mode: 'colaborador' } });
    expect(colaborador.companyMonthly).toBe(0);
    expect(colaborador.employeeMonthly).toBeCloseTo(colaborador.monthlyTotal, 6);
  });

  it('soma o software mensal quando o engine o cobra', () => {
    const cost = calculateBenefitCost({ ...base, softwareMonthlyFee: 1499 });
    expect(cost.monthlyTotal).toBeCloseTo(10_000 + 6940 / 6 + 1499, 6);
  });

  it('não produz NaN nem Infinity sem população ou sem adesão', () => {
    const semGente = calculateBenefitCost({ ...base, headcount: 0 });
    expect(semGente.costPerEligible).toBe(0);
    expect(semGente.costPerAdherent).toBe(0);
    expect(semGente.employeeOutOfPocket).toBe(0);

    const semAdesao = calculateBenefitCost({ ...base, adhesionPercent: 0 });
    expect(semAdesao.adherents).toBe(0);
    expect(semAdesao.costPerAdherent).toBe(0);
    expect(Number.isFinite(semAdesao.costPerEligible)).toBe(true);
  });

  it('trava entradas absurdas', () => {
    const cost = calculateBenefitCost({
      ...base,
      headcount: -50,
      adhesionPercent: 180,
      consultationsMonthly: -1,
    });
    expect(cost.eligible).toBe(0);
    expect(cost.consultationsMonthly).toBe(0);
    expect(cost.adherents).toBe(0);
  });
});

describe('estimateReturn', () => {
  const base = {
    ...RETURN_DEFAULTS,
    eligible: 320,
    adherents: 144,
    companyMonthly: 11_157,
  };

  it('sem premissas, não apresenta estimativa', () => {
    const result = estimateReturn(base);
    expect(result.hasAbsenceEstimate).toBe(false);
    expect(result.hasHealthPlanComparison).toBe(false);
    expect(result.absenceSavedMonthly).toBe(0);
  });

  it('deriva o custo do dia parado do salário médio', () => {
    const result = estimateReturn({ ...base, avgSalary: 3300 });
    expect(result.dailyCost).toBeCloseTo(3300 / WORKING_DAYS_PER_MONTH, 6);
  });

  it('calcula o absenteísmo evitado a partir das premissas informadas', () => {
    const result = estimateReturn({
      ...base,
      avgSalary: 3300,
      absenceDaysPerYear: 6,
      absenceReductionPercent: 20,
    });

    const dailyCost = 3300 / WORKING_DAYS_PER_MONTH;
    const custoMensal = 144 * (6 / 12) * dailyCost;

    expect(result.hasAbsenceEstimate).toBe(true);
    expect(result.absenceCostMonthly).toBeCloseTo(custoMensal, 6);
    expect(result.absenceSavedMonthly).toBeCloseTo(custoMensal * 0.2, 6);
    expect(result.netMonthly).toBeCloseTo(custoMensal * 0.2 - 11_157, 6);
    expect(result.returnRatio).toBeCloseTo((custoMensal * 0.2) / 11_157, 6);
  });

  it('compara com o plano de saúde como PROPORÇÃO, nunca como economia', () => {
    const result = estimateReturn({ ...base, healthPlanPerCapita: 400 });

    expect(result.hasHealthPlanComparison).toBe(true);
    expect(result.healthPlanMonthly).toBe(320 * 400);
    // O benefício custa esta fração do que já se gasta com plano — não substitui.
    expect(result.benefitShareOfHealthPlanPercent).toBeCloseTo((11_157 / 128_000) * 100, 6);
  });

  it('não divide por zero quando não há desembolso nem plano', () => {
    const result = estimateReturn({ ...base, companyMonthly: 0 });
    expect(result.returnRatio).toBe(0);
    expect(result.benefitShareOfHealthPlanPercent).toBe(0);
    expect(Number.isFinite(result.netMonthly)).toBe(true);
  });
});

describe('honestidade do modelo de retorno', () => {
  const base = {
    ...RETURN_DEFAULTS,
    avgSalary: 3300,
    absenceDaysPerYear: 6,
    absenceReductionPercent: 20,
    eligible: 320,
    adherents: 144,
    companyMonthly: 11_157,
  };

  /**
   * O ganho é atribuído a quem ADERIU, nunca à população elegível inteira.
   * Contar quem nunca entrou no programa é o jeito mais fácil de transformar o
   * painel numa afirmação indefensável.
   */
  it('atribui o ganho aos aderentes, não aos elegíveis', () => {
    const poucosElegiveis = estimateReturn({ ...base, eligible: 200 });
    const muitosElegiveis = estimateReturn({ ...base, eligible: 5000 });

    expect(poucosElegiveis.absenceSavedMonthly).toBeCloseTo(
      muitosElegiveis.absenceSavedMonthly,
      6,
    );

    // Já os aderentes movem o ganho, proporcionalmente.
    const dobroDeAderentes = estimateReturn({ ...base, adherents: 288 });
    expect(dobroDeAderentes.absenceSavedMonthly).toBeCloseTo(
      estimateReturn(base).absenceSavedMonthly * 2,
      6,
    );
  });

  it('calcula a redução necessária para o benefício se pagar', () => {
    const result = estimateReturn(base);
    expect(result.breakEvenReductionPercent).toBeCloseTo(
      (11_157 / result.absenceCostMonthly) * 100,
      6,
    );
  });

  it('não inventa break-even sem custo de absenteísmo informado', () => {
    const semPremissas = estimateReturn({
      ...RETURN_DEFAULTS,
      eligible: 320,
      adherents: 144,
      companyMonthly: 11_157,
    });
    expect(semPremissas.breakEvenReductionPercent).toBeNull();
  });

  it('encargos sobre a folha encarecem o dia parado', () => {
    const semEncargos = estimateReturn(base);
    const comEncargos = estimateReturn({ ...base, payrollChargesPercent: 40 });
    expect(comEncargos.dailyCost).toBeCloseTo(semEncargos.dailyCost * 1.4, 6);
  });

  /**
   * `economia por substituir o plano de saúde` seria a conta mais vendedora da
   * página e é a que não pode existir: pressupõe largar o plano e ficar com o
   * benefício — comercialmente falso (sem internação, urgência, exames) e
   * juridicamente perigoso, porque sugere que isto substitui plano de saúde.
   */
  it('não expõe nenhuma economia por substituição de plano de saúde', () => {
    const result = estimateReturn({ ...base, healthPlanPerCapita: 400 });
    const campos = Object.keys(result).join(' ');
    expect(campos).not.toMatch(/substitu/i);
    expect(campos).not.toMatch(/economiaPlano|planSaving/i);
    // A comparação existente é de proporção, e nunca passa de "quanto representa".
    expect(result.benefitShareOfHealthPlanPercent).toBeGreaterThan(0);
  });

  it('mostra prejuízo quando o retorno não fecha, em vez de esconder', () => {
    const result = estimateReturn({ ...base, absenceReductionPercent: 1 });
    expect(result.netMonthly).toBeLessThan(0);
    expect(result.returnRatio).toBeLessThan(1);
  });
});
