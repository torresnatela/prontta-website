import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VideoFacade } from './VideoFacade';

const props = {
  youtubeId: 'aqz-KE-bpKQ',
  title: 'O que é o ciclo',
  poster: '/academias/capitulos/ciclo.svg',
  durationLabel: '2 min',
};

describe('VideoFacade', () => {
  it('não carrega nada do YouTube antes do clique', () => {
    const { container } = render(<VideoFacade {...props} />);

    // O ponto do facade: sem iframe, o navegador não fala com o YouTube nem
    // grava cookie — o mesmo cuidado que CookieConsent toma com o GA.
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('button', { name: 'Assistir: O que é o ciclo' })).toBeInTheDocument();
  });

  it('mostra a capa e a duração enquanto não tocou', () => {
    render(<VideoFacade {...props} />);

    const poster = document.querySelector('img');
    expect(poster).not.toBeNull();
    expect(poster?.getAttribute('src')).toContain('ciclo.svg');
    // Decorativa: quem nomeia o vídeo é o aria-label do botão.
    expect(poster?.getAttribute('alt')).toBe('');
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });

  it('troca para o embed sem cookie depois do clique', async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoFacade {...props} />);

    await user.click(screen.getByRole('button', { name: 'Assistir: O que é o ciclo' }));

    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain('youtube-nocookie.com/embed/aqz-KE-bpKQ');
    expect(iframe?.getAttribute('src')).toContain('autoplay=1');
    expect(iframe?.getAttribute('title')).toBe('O que é o ciclo');
    // O domínio com cookie nunca deve aparecer.
    expect(iframe?.getAttribute('src')).not.toContain('//www.youtube.com');
  });
});
