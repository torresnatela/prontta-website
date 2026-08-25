import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ACADEMIA_PROGRAMS } from '@/lib/academias/catalog';
import { ProgramGallery } from './ProgramGallery';

describe('ProgramGallery', () => {
  it('mostra uma capa por programa do catálogo', () => {
    const { container } = render(<ProgramGallery />);

    // As capas existem porque o popover do catálogo some no celular: sem elas,
    // ninguém no toque veria os programas.
    expect(container.querySelectorAll('figure')).toHaveLength(ACADEMIA_PROGRAMS.length);
    for (const program of ACADEMIA_PROGRAMS) {
      expect(screen.getByText(program.shortName)).toBeInTheDocument();
    }
  });

  it('marca cada figura com o tema do programa, que pinta o card', () => {
    const { container } = render(<ProgramGallery />);

    const themes = [...container.querySelectorAll('figure')].map((f) => f.getAttribute('data-card'));
    expect(themes).toEqual(ACADEMIA_PROGRAMS.map((p) => p.theme));
  });
});
