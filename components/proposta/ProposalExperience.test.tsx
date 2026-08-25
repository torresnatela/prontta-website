import { render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * O `next/image` do Logo recebe um import estático de PNG. Fora do build do
 * Next esse import vira uma string em vez do objeto com width/height que o
 * componente exige, e o render quebra. É artefato do ambiente de teste, não da
 * página — daí o stub.
 */
vi.mock('next/image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt ?? ''} />,
}));

import { ProposalExperience } from './ProposalExperience';

/**
 * Prova de que a parametrização por modo não vazou nos dois sentidos: o
 * benefício não pode mostrar vocabulário de revenda, e a revenda não pode ter
 * perdido a DRE quando os componentes viraram mode-aware.
 */

const renderBeneficio = () =>
  render(
    <ProposalExperience
      mode="beneficio"
      clientType="empresa"
      topBarSubtitle="Proposta de benefício · empresas"
    />,
  );

const renderRevenda = () =>
  render(<ProposalExperience clientType="clinica" topBarSubtitle="Proposta comercial" />);

describe('/proposta/empresa — modo benefício', () => {
  it('não mostra margem, repasse nem resultado líquido em lugar nenhum', () => {
    const { container } = renderBeneficio();
    const texto = container.textContent ?? '';

    expect(texto).not.toMatch(/sua margem/i);
    expect(texto).not.toMatch(/repasse à prontta/i);
    expect(texto).not.toMatch(/resultado líquido/i);
    expect(texto).not.toMatch(/receita bruta/i);
    expect(texto).not.toMatch(/margem líquida/i);
    expect(texto).not.toMatch(/\bDRE\b/);
  });

  it('abre com os passos do benefício, e sem os passos de revenda', () => {
    const { container } = renderBeneficio();

    expect(container.querySelector('#passo-perfil')).not.toBeNull();
    expect(container.querySelector('#passo-custeio')).not.toBeNull();
    expect(container.querySelector('#passo-retorno')).not.toBeNull();
    // Margens e DRE são exclusivos da revenda.
    expect(container.querySelector('#passo-margens')).toBeNull();
    expect(container.querySelector('#resultado')).toBeNull();
  });

  it('mostra o investimento mensal e o custo por colaborador no painel', () => {
    const { container } = renderBeneficio();
    const painel = container.querySelector('#painel-resultado');
    expect(painel).not.toBeNull();

    const texto = painel?.textContent ?? '';
    expect(texto).toMatch(/investimento mensal/i);
    expect(texto).toMatch(/custo por colaborador elegível/i);
    expect(texto).toMatch(/a empresa paga/i);
    expect(texto).toMatch(/os colaboradores pagam/i);
  });

  it('a tabela de consultas perde as colunas de custo e margem', () => {
    const { container } = renderBeneficio();
    const tabela = container.querySelector('#passo-consultas table.st');
    const cabecalhos = Array.from(tabela?.querySelectorAll('thead th') ?? []).map(
      (th) => th.textContent ?? '',
    );

    expect(cabecalhos).toContain('Preço unit. (empresa)');
    expect(cabecalhos).not.toContain('Custo unit. (Prontta)');
    expect(cabecalhos).not.toContain('Sua margem');
  });

  it('a tabela de programas separa o ciclo do equivalente mensal', () => {
    const { container } = renderBeneficio();
    const tabela = container.querySelector('#passo-programas table.st');
    const cabecalhos = Array.from(tabela?.querySelectorAll('thead th') ?? []).map(
      (th) => th.textContent ?? '',
    );

    expect(cabecalhos).toContain('Preço do ciclo');
    expect(cabecalhos).toContain('Equiv. mensal');
    expect(cabecalhos).not.toContain('Sua margem');
  });

  it('traz o compliance de benefício corporativo', () => {
    const { container } = renderBeneficio();
    const texto = container.textContent ?? '';

    expect(texto).toMatch(/não é plano de saúde|benefício de saúde, não plano de saúde/i);
    expect(texto).toMatch(/não acessa dados clínicos/i);
    expect(texto).toMatch(/adesão voluntária/i);
    expect(texto).toMatch(/ocupacional/i);
    // E não traz o que é do canal de revenda.
    expect(texto).not.toMatch(/dicotomia/i);
    expect(texto).not.toMatch(/parceiro leigo/i);
  });

  it('não projeta retorno enquanto as premissas estiverem zeradas', () => {
    const { container } = renderBeneficio();
    const passo = container.querySelector('#passo-retorno');
    expect(passo?.textContent).toMatch(/sem esses três números, nada é projetado/i);
  });
});

describe('/proposta — modo revenda segue intacto', () => {
  it('mantém margens, DRE e as colunas de custo', () => {
    const { container } = renderRevenda();

    expect(container.querySelector('#resultado')).not.toBeNull();
    expect(container.textContent).toMatch(/sua margem/i);
    expect(container.textContent).toMatch(/repasse à prontta/i);

    const tabela = container.querySelector('#passo-consultas table.st');
    const cabecalhos = Array.from(tabela?.querySelectorAll('thead th') ?? []).map(
      (th) => th.textContent ?? '',
    );
    expect(cabecalhos).toContain('Custo unit. (Prontta)');
    expect(cabecalhos).toContain('Sua margem');
    expect(cabecalhos).toHaveLength(11);
  });

  it('fala com o canal escolhido', () => {
    const { container } = renderRevenda();
    expect(within(container).getByRole('heading', { level: 1 }).textContent).toMatch(/sua clínica/i);
  });

  it('o benefício fala com a empresa', () => {
    const { container } = renderBeneficio();
    expect(within(container).getByRole('heading', { level: 1 }).textContent).toMatch(/sua empresa/i);
  });
});
