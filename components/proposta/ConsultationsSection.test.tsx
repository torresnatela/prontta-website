import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ConsultationsSection } from './sections/ConsultationsSection';
import { ProposalProvider } from './state/ProposalProvider';

const renderSection = () =>
  render(
    <ProposalProvider>
      <ConsultationsSection />
    </ProposalProvider>,
  );

describe('ConsultationsSection', () => {
  it('abre com o mix golden: consultas ao paciente 5.600 e software 1.499', () => {
    renderSection();
    expect(screen.getByTestId('consultas-paciente').textContent).toMatch(/5\.600/);
    expect(screen.getByTestId('software-mensal').textContent).toMatch(/1\.499/);
  });

  it('sinaliza AJUSTAR quando a quantidade dedicada foge do múltiplo do plantão', () => {
    renderSection();
    fireEvent.change(screen.getByLabelText('Quantidade — Cardiologia Adulto'), {
      target: { value: '15' },
    });
    expect(screen.getByText(/AJUSTAR: múltiplo de 10/)).toBeInTheDocument();
  });

  it('isenta o software ao cruzar 150 consultas/mês', () => {
    renderSection();
    fireEvent.change(screen.getByLabelText('Quantidade — Psicologia Adulto'), {
      target: { value: '900' },
    });
    expect(screen.getByTestId('software-mensal').textContent).toMatch(/isento/i);
  });

  it('remove linha de consulta', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: /Remover Nutrição/ }));
    expect(screen.queryByLabelText('Quantidade — Nutrição')).not.toBeInTheDocument();
  });

  it('adiciona nova linha de especialidade', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: /Adicionar especialidade/ }));
    expect(screen.getByLabelText('Quantidade — Médico Generalista')).toBeInTheDocument();
  });

  it('trocar o plano de referência re-precifica e re-valida os plantões', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: 'Premium' }));
    // Cardiologia qty 10 no premium (plantão 4) deixa de fechar plantão
    expect(screen.getAllByText(/AJUSTAR: múltiplo de 4/).length).toBeGreaterThan(0);
  });
});
