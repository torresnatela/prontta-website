import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { VideoFacade } from './VideoFacade';

const props = {
  video: { kind: 'youtube', youtubeId: 'aqz-KE-bpKQ' },
  title: 'O que é o ciclo',
  poster: '/academias/capitulos/ciclo.svg',
  durationLabel: '2 min',
} as const;

const arquivo = {
  video: { kind: 'file', src: 'https://blob.example/proposta/simulacao.mp4' },
  title: 'Como fazer uma simulação',
  poster: '/proposta-midia/capitulos/visao-geral.jpg',
  durationLabel: '3 min',
} as const;

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

  describe('vídeo em arquivo (auto-hospedado)', () => {
    it('antes do clique é a mesma capa — nada é baixado', () => {
      const { container } = render(<VideoFacade {...arquivo} />);

      expect(container.querySelector('video')).toBeNull();
      expect(container.querySelector('iframe')).toBeNull();
      expect(
        screen.getByRole('button', {
          name: 'Assistir: Como fazer uma simulação',
        }),
      ).toBeInTheDocument();
      expect(screen.getByText('3 min')).toBeInTheDocument();
    });

    it('depois do clique toca num <video> nativo, sem YouTube', async () => {
      const user = userEvent.setup();
      const { container } = render(<VideoFacade {...arquivo} />);

      await user.click(
        screen.getByRole('button', {
          name: 'Assistir: Como fazer uma simulação',
        }),
      );

      const video = container.querySelector('video');
      expect(video).not.toBeNull();
      expect(video?.getAttribute('src')).toBe('https://blob.example/proposta/simulacao.mp4');
      // Controles nativos: o facade só substitui o primeiro play.
      expect(video).toHaveAttribute('controls');
      expect(video).toHaveAttribute('autoplay');
      // iOS abre fullscreen à força sem playsinline.
      expect(video).toHaveAttribute('playsinline');
      expect(video?.getAttribute('poster')).toBe('/proposta-midia/capitulos/visao-geral.jpg');
      expect(container.querySelector('iframe')).toBeNull();
    });
  });
});
