import { describe, expect, it } from 'vitest';
import {
  buildAssociadoWhatsAppMessage,
  buildOfferAbsoluteUrl,
  buildOfferPath,
  hasOfferParams,
  minMonthlyPrice,
  parseOfferParams,
} from './params';

describe('parseOfferParams — defaults', () => {
  it('sem parâmetros, abre em performance / 6 meses / preço sugerido', () => {
    expect(parseOfferParams({})).toEqual({ programa: 'performance', ciclo: 6, preco: null });
  });
});

describe('parseOfferParams — programa', () => {
  it('aceita os 4 do catálogo', () => {
    expect(parseOfferParams({ programa: 'longevidade-ativa' }).programa).toBe('longevidade-ativa');
    expect(parseOfferParams({ programa: 'sono-e-energia' }).programa).toBe('sono-e-energia');
  });

  it('NÃO lança com id inexistente — cairia em 500 numa URL pública', () => {
    expect(() => parseOfferParams({ programa: 'inexistente' })).not.toThrow();
    expect(parseOfferParams({ programa: 'inexistente' }).programa).toBe('performance');
  });

  it('rejeita programa que existe no engine mas está fora do nicho academia', () => {
    expect(parseOfferParams({ programa: 'mente-em-equilibrio' }).programa).toBe('performance');
  });

  it('usa o primeiro valor quando o param vem repetido (array)', () => {
    expect(parseOfferParams({ programa: ['sono-e-energia', 'performance'] }).programa).toBe(
      'sono-e-energia',
    );
  });
});

describe('parseOfferParams — ciclo', () => {
  it('aceita 3, 6 e 12', () => {
    expect(parseOfferParams({ ciclo: '3' }).ciclo).toBe(3);
    expect(parseOfferParams({ ciclo: '12' }).ciclo).toBe(12);
  });

  it('cai no default para ciclo inválido — evita PLATFORM_FEE undefined → R$ NaN', () => {
    for (const ciclo of ['9', 'abc', '', '0', '-6', '6.5', 'Infinity']) {
      expect(parseOfferParams({ ciclo }).ciclo).toBe(6);
    }
  });

  it('usa o primeiro valor de um array', () => {
    expect(parseOfferParams({ ciclo: ['12', '3'] }).ciclo).toBe(12);
  });
});

describe('parseOfferParams — preço', () => {
  it('aceita um preço válido', () => {
    expect(parseOfferParams({ preco: '450' }).preco).toBe(450);
    expect(parseOfferParams({ preco: '416.67' }).preco).toBe(416.67);
  });

  it('devolve null para lixo, nunca NaN', () => {
    for (const preco of ['abc', '', '  ', '-10', '0']) {
      const result = parseOfferParams({ preco });
      expect(result.preco).toBeNull();
    }
  });

  it('nunca deixa passar Infinity', () => {
    expect(parseOfferParams({ preco: '1e999' }).preco).toBeNull();
    expect(parseOfferParams({ preco: 'Infinity' }).preco).toBeNull();
  });

  it('sobe o preço até o repasse — a página nunca anuncia abaixo do custo Prontta', () => {
    // performance/6: repasse 1735 → mínimo 289,1666…/mês
    const minimo = minMonthlyPrice('performance', 6);
    expect(minimo).toBeCloseTo(289.1667, 4);
    expect(parseOfferParams({ preco: '1' }).preco).toBeCloseTo(289.17, 2);
  });

  it('limita o teto para não explodir o layout', () => {
    expect(parseOfferParams({ preco: '99999999' }).preco).toBe(20_000);
  });

  it('clampa contra o repasse do programa/ciclo que vieram na MESMA URL', () => {
    // longevidade/12: repasse 3355 → mínimo 279,58/mês
    const result = parseOfferParams({ programa: 'longevidade-ativa', ciclo: '12', preco: '10' });
    expect(result.preco).toBeCloseTo(279.58, 2);
  });

  it('sobrevive a uma URL inteiramente hostil', () => {
    const result = parseOfferParams({ programa: 'lixo', ciclo: '99', preco: '-5' });
    expect(result).toEqual({ programa: 'performance', ciclo: 6, preco: null });
  });
});

describe('hasOfferParams', () => {
  it('detecta se a URL trouxe algum parâmetro nosso', () => {
    expect(hasOfferParams({})).toBe(false);
    expect(hasOfferParams({ utm_source: 'instagram' })).toBe(false);
    expect(hasOfferParams({ programa: 'performance' })).toBe(true);
    expect(hasOfferParams({ preco: '450' })).toBe(true);
  });
});

describe('buildOfferPath', () => {
  it('monta o link com preço', () => {
    expect(buildOfferPath({ programa: 'performance', ciclo: 6, preco: 450 })).toBe(
      '/academias/programas?programa=performance&ciclo=6&preco=450',
    );
  });

  it('omite o preço quando não há override', () => {
    expect(buildOfferPath({ programa: 'sono-e-energia', ciclo: 12, preco: null })).toBe(
      '/academias/programas?programa=sono-e-energia&ciclo=12',
    );
  });

  it('faz round-trip por parseOfferParams', () => {
    const params = { programa: 'longevidade-ativa', ciclo: 12, preco: 400 } as const;
    const query = Object.fromEntries(
      new URL(`https://x.test${buildOfferPath(params)}`).searchParams.entries(),
    );
    expect(parseOfferParams(query)).toEqual(params);
  });
});

describe('buildOfferAbsoluteUrl', () => {
  it('prefere o origin passado (preview da Vercel ≠ produção)', () => {
    const url = buildOfferAbsoluteUrl(
      { programa: 'performance', ciclo: 6, preco: 450 },
      'https://preview.vercel.app',
    );
    expect(url).toBe(
      'https://preview.vercel.app/academias/programas?programa=performance&ciclo=6&preco=450',
    );
  });

  it('cai no siteConfig quando não há origin', () => {
    const url = buildOfferAbsoluteUrl({ programa: 'performance', ciclo: 6, preco: null });
    expect(url).toMatch(/^https?:\/\/.+\/academias\/programas\?/);
  });
});

describe('buildAssociadoWhatsAppMessage', () => {
  it('usa o nome oficial do programa e o preço formatado', () => {
    const message = buildAssociadoWhatsAppMessage(
      { programa: 'performance', ciclo: 6, preco: 450 },
      450,
    );
    expect(message).toContain('Prontta Performance');
    expect(message).toContain('6 meses');
    expect(message).toContain('450,00');
  });
});
