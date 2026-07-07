import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DRESection } from './sections/DRESection';
import { ProposalProvider } from './state/ProposalProvider';

const renderSection = () =>
  render(
    <ProposalProvider>
      <DRESection />
    </ProposalProvider>,
  );

describe('DRESection', () => {
  it('abre com a DRE golden: resultado 23.133/mês e margem 19,8%', () => {
    renderSection();
    expect(screen.getByTestId('resultado-liquido').textContent).toMatch(/23\.133/);
    expect(screen.getByTestId('margem-liquida').textContent).toMatch(/19,8/);
  });

  it('usa o rótulo neutro na linha de repasse', () => {
    renderSection();
    expect(screen.getByText(/Custo Prontta \(serviços médicos e plataforma\)/)).toBeInTheDocument();
  });

  it('editar despesa recalcula o resultado', () => {
    renderSection();
    fireEvent.change(screen.getByLabelText(/Aluguel/), { target: { value: '10800' } });
    expect(screen.getByTestId('resultado-liquido').textContent).toMatch(/13\.133/);
  });

  it('editar propostas/mês recalcula receita e resultado', () => {
    renderSection();
    fireEvent.change(screen.getByLabelText(/Propostas vendidas por mês/), {
      target: { value: '10' },
    });
    expect(screen.getByTestId('resultado-liquido').textContent).toMatch(/30\.141/);
  });
});
