import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProgramsSection } from './sections/ProgramsSection';
import { SummarySection } from './sections/SummarySection';
import { ProposalProvider } from './state/ProposalProvider';

const renderSections = () =>
  render(
    <ProposalProvider>
      <ProgramsSection />
      <SummarySection />
    </ProposalProvider>,
  );

describe('SummarySection', () => {
  it('consolida consultas + programas no total do contrato (golden 14.600)', () => {
    renderSections();
    expect(screen.getByTestId('total-consultas').textContent).toMatch(/5\.600/);
    expect(screen.getByTestId('total-programas').textContent).toMatch(/9\.000/);
    expect(screen.getByTestId('total-contrato').textContent).toMatch(/14\.600/);
  });

  it('adicionar um programa pelo card atualiza o total', async () => {
    const user = userEvent.setup();
    renderSections();
    await user.click(screen.getByRole('button', { name: /Adicionar Prontta Performance/ }));
    // Performance ciclo 3m = 1.350 → total 14.600 + 1.350 = 15.950
    expect(screen.getByTestId('total-contrato').textContent).toMatch(/15\.950/);
  });

  it('modo Valor da implantação exibe campo e reflete o valor informado', () => {
    renderSections();
    fireEvent.change(screen.getByLabelText(/Taxa de implantação/), { target: { value: 'valor' } });
    fireEvent.change(screen.getByLabelText(/Valor da implantação/), { target: { value: '12000' } });
    expect(screen.getByTestId('implantacao').textContent).toMatch(/12\.000/);
  });
});
