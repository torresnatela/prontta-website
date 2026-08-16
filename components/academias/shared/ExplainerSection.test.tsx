import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRAMAS_CHAPTERS, SIMULADOR_CHAPTERS } from '@/lib/academias/videos';
import { ChapterCue } from './ChapterCue';
import { ExplainerProvider } from './ExplainerProvider';
import { ExplainerSection } from './ExplainerSection';

const head = {
  kicker: 'Entenda antes de simular',
  title: 'Quatro vídeos curtos',
  lead: 'Do programa à DRE.',
};

function renderHub(chapters = SIMULADOR_CHAPTERS, cue?: string) {
  return render(
    <ExplainerProvider chapters={chapters}>
      {cue ? <ChapterCue chapterId={cue} /> : null}
      <ExplainerSection {...head} />
    </ExplainerProvider>,
  );
}

/** Variante /sem-video: mesma explicação, capa ilustrada no lugar do player. */
function renderHubSemVideo(cue?: string) {
  return render(
    <ExplainerProvider chapters={SIMULADOR_CHAPTERS} media="imagem">
      {cue ? <ChapterCue chapterId={cue} /> : null}
      <ExplainerSection {...head} variantHref="/academias/simulador" />
    </ExplainerProvider>,
  );
}

beforeEach(() => {
  // jsdom não implementa scrollIntoView — sem o stub, openChapter quebra.
  Element.prototype.scrollIntoView = vi.fn();
});

describe('ExplainerSection', () => {
  it('lista um tab por capítulo e abre no primeiro', () => {
    renderHub();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(SIMULADOR_CHAPTERS.length);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[3]).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('troca vídeo e texto ao escolher outro capítulo', async () => {
    const user = userEvent.setup();
    const { container } = renderHub();
    const dre = SIMULADOR_CHAPTERS[3];

    await user.click(screen.getByRole('tab', { name: new RegExp(dre.title) }));

    expect(screen.getByRole('heading', { level: 3, name: dre.title })).toBeInTheDocument();
    expect(screen.getByText(dre.summary)).toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toContain('dre.svg');
  });

  it('mostra a galeria de programas no lugar dos bullets', async () => {
    const user = userEvent.setup();
    renderHub();
    const programas = SIMULADOR_CHAPTERS[1];

    await user.click(screen.getByRole('tab', { name: new RegExp(programas.title) }));

    // As capas existem porque o popover do catálogo some no celular.
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Sono e Energia')).toBeInTheDocument();
    expect(screen.queryByText(programas.bullets[0])).not.toBeInTheDocument();
  });
});

describe('variante sem vídeo', () => {
  it('mostra a capa do capítulo sem nenhum player', () => {
    const { container } = renderHubSemVideo();

    expect(container.querySelector('.chapter-illustration')).not.toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
    // O botão "Assistir" do facade não existe aqui.
    expect(screen.queryByRole('button', { name: /Assistir/ })).not.toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toContain('visao-geral.svg');
  });

  it('mantém a navegação por capítulos', async () => {
    const user = userEvent.setup();
    const { container } = renderHubSemVideo();
    const ciclo = SIMULADOR_CHAPTERS[2];

    await user.click(screen.getByRole('tab', { name: new RegExp(ciclo.title) }));

    expect(screen.getByRole('heading', { level: 3, name: ciclo.title })).toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toContain('ciclo.svg');
  });

  it('troca o rótulo do atalho — nada de "ver vídeo" numa página sem vídeo', () => {
    renderHubSemVideo('dre');

    expect(screen.queryByText(/Ver vídeo/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Ler a explicação:/ })).toBeInTheDocument();
  });

  it('não anuncia duração — não há nada para assistir', () => {
    renderHubSemVideo();

    for (const chapter of SIMULADOR_CHAPTERS) {
      expect(screen.queryByText(chapter.durationLabel)).not.toBeInTheDocument();
    }
  });

  it('oferece o link de volta para a versão com vídeo', () => {
    renderHubSemVideo();

    const link = screen.getByRole('link', { name: /com vídeo/ });
    expect(link).toHaveAttribute('href', '/academias/simulador');
  });
});

describe('ChapterCue', () => {
  it('ativa o capítulo alvo e rola até o hub', async () => {
    const user = userEvent.setup();
    renderHub(SIMULADOR_CHAPTERS, 'dre');
    const dre = SIMULADOR_CHAPTERS[3];

    await user.click(screen.getByRole('button', { name: `Ver o vídeo: ${dre.title}` }));

    expect(screen.getByRole('heading', { level: 3, name: dre.title })).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('some quando o capítulo não existe para aquele público', () => {
    // O atalho da DRE mora no DREPanel; na página do associado ele não deve
    // renderizar nada, nem vazar o vocabulário de custo.
    renderHub(PROGRAMAS_CHAPTERS, 'dre');

    expect(screen.queryByRole('button', { name: /Ver o vídeo/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(PROGRAMAS_CHAPTERS.length);
  });
});
