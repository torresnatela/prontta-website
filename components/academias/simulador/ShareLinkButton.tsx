'use client';

import { useState } from 'react';
import { buildOfferAbsoluteUrl, buildOfferPath } from '@/lib/academias/params';
import { useSimulador, useSimulation } from './state/SimuladorProvider';

/**
 * Ponte entre as duas páginas: leva o programa, o ciclo e o preço que a academia
 * acabou de definir para a página pública do associado.
 */
export function ShareLinkButton() {
  const { state } = useSimulador();
  const simulation = useSimulation();
  const [feedback, setFeedback] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const params = {
    programa: state.programId,
    ciclo: state.cycle,
    preco: Math.round(simulation.monthlyPrice * 100) / 100,
  };

  // O origin real do navegador — siteConfig.url apontaria para produção mesmo
  // num preview da Vercel, entregando um link errado ao parceiro.
  const absoluteUrl = () =>
    buildOfferAbsoluteUrl(params, typeof window === 'undefined' ? undefined : window.location.origin);

  const copy = async () => {
    const url = absoluteUrl();
    try {
      if (!navigator.clipboard) throw new Error('clipboard indisponível');
      await navigator.clipboard.writeText(url);
      setFeedback('Link da oferta copiado.');
      setFallbackUrl(null);
    } catch {
      // Contexto inseguro ou navegador in-app: mostra o link para copiar à mão.
      setFallbackUrl(url);
      setFeedback('Copie o link abaixo:');
    }
    setTimeout(() => setFeedback(''), 3200);
  };

  return (
    <>
      <a className="cta" href={buildOfferPath(params)} target="_blank" rel="noopener noreferrer">
        Visualizar página dos associados
      </a>
      <button type="button" className="cta secondary" onClick={copy}>
        Copiar link para os associados
      </button>
      <div className="copy-feedback" aria-live="polite">
        {feedback}
      </div>
      {fallbackUrl ? (
        <input className="copy-fallback" readOnly value={fallbackUrl} onFocus={(e) => e.currentTarget.select()} />
      ) : null}
    </>
  );
}
