import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RollingCurrency } from './RollingCurrency';
import { useRollingNumber } from './useRollingNumber';

/** Controla matchMedia por teste (o setup global devolve matches: false). */
function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

/** rAF manual: cada `flush` roda um frame com o tempo que passarmos. */
function stubRaf() {
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  let now = 0;

  const requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
    const id = nextId++;
    callbacks.set(id, cb);
    return id;
  });
  const cancelAnimationFrame = vi.fn((id: number) => {
    callbacks.delete(id);
  });

  vi.stubGlobal('requestAnimationFrame', requestAnimationFrame);
  vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame);
  vi.stubGlobal('performance', { now: () => now });

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    get pending() {
      return callbacks.size;
    },
    advance(ms: number) {
      now += ms;
      const pending = [...callbacks.entries()];
      callbacks.clear();
      act(() => {
        for (const [, cb] of pending) cb(now);
      });
    },
  };
}

function Probe({ target }: { target: number }) {
  const { value, rolling } = useRollingNumber(target);
  return (
    <div>
      <output data-testid="value">{value}</output>
      <output data-testid="rolling">{String(rolling)}</output>
    </div>
  );
}

let raf: ReturnType<typeof stubRaf>;

beforeEach(() => {
  raf = stubRaf();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useRollingNumber — prefers-reduced-motion', () => {
  it('não agenda um único frame quando o usuário pede menos movimento', () => {
    mockReducedMotion(true);
    const { rerender } = render(<Probe target={100} />);
    rerender(<Probe target={5000} />);

    expect(raf.requestAnimationFrame).not.toHaveBeenCalled();
    expect(screen.getByTestId('value')).toHaveTextContent('5000');
    expect(screen.getByTestId('rolling')).toHaveTextContent('false');
  });
});

describe('useRollingNumber — animação', () => {
  it('a primeira renderização nunca anima (guarda de hidratação)', () => {
    mockReducedMotion(false);
    render(<Probe target={11250} />);

    expect(raf.requestAnimationFrame).not.toHaveBeenCalled();
    expect(screen.getByTestId('value')).toHaveTextContent('11250');
  });

  it('anima na troca de alvo e crava exatamente o valor final', () => {
    mockReducedMotion(false);
    const { rerender } = render(<Probe target={11250} />);
    rerender(<Probe target={22500} />);

    expect(raf.requestAnimationFrame).toHaveBeenCalled();
    expect(screen.getByTestId('rolling')).toHaveTextContent('true');

    // Meio da animação: valor intermediário, ainda não chegou.
    raf.advance(400);
    expect(Number(screen.getByTestId('value').textContent)).not.toBe(22500);

    // Passa da duração máxima — tem de assentar exatamente no alvo.
    raf.advance(2000);
    expect(screen.getByTestId('value')).toHaveTextContent('22500');
    expect(screen.getByTestId('rolling')).toHaveTextContent('false');
    expect(raf.pending).toBe(0);
  });

  it('não anima quando o alvo praticamente não muda', () => {
    mockReducedMotion(false);
    const { rerender } = render(<Probe target={100} />);
    rerender(<Probe target={100.001} />);
    expect(raf.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('cancela o frame pendente ao desmontar no meio da animação', () => {
    mockReducedMotion(false);
    const { rerender, unmount } = render(<Probe target={100} />);
    rerender(<Probe target={9000} />);
    raf.advance(200);

    expect(raf.pending).toBe(1);
    unmount();
    expect(raf.cancelAnimationFrame).toHaveBeenCalled();
    expect(raf.pending).toBe(0);
  });

  it('uma nova troca de alvo supera a animação em andamento', () => {
    mockReducedMotion(false);
    const { rerender } = render(<Probe target={100} />);
    rerender(<Probe target={9000} />);
    raf.advance(200);
    rerender(<Probe target={500} />);

    expect(raf.cancelAnimationFrame).toHaveBeenCalled();
    raf.advance(2000);
    expect(screen.getByTestId('value')).toHaveTextContent('500');
  });
});

describe('RollingCurrency', () => {
  it('formata em BRL e mantém as casas do valor estável', () => {
    mockReducedMotion(true);
    const { rerender } = render(<RollingCurrency value={11250} />);
    expect(screen.getAllByText('R$ 11.250').length).toBeGreaterThan(0);

    rerender(<RollingCurrency value={3458.3333} />);
    expect(screen.getAllByText('R$ 3.458,33').length).toBeGreaterThan(0);
  });

  it('anuncia só o valor final para leitores de tela', () => {
    mockReducedMotion(false);
    const { container } = render(<RollingCurrency value={450} suffix="/mês" />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toHaveTextContent('R$ 450/mês');
    // O span animado fica escondido do leitor de tela.
    expect(container.querySelector('.roleta')).toHaveAttribute('aria-hidden', 'true');
  });
});
