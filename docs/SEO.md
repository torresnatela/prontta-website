# SEO & Posicionamento em IA — Prontta Saúde

Referência viva de como o SEO do site funciona e como mantê-lo atualizado.
O objetivo é ranqueamento no Google **e** ser citado por mecanismos de IA
(ChatGPT, Gemini, Perplexity) — conteúdo de saúde é YMYL, então priorizamos
clareza, autoria com credenciais (E-E-A-T) e dados estruturados.

## Onde está cada peça

| Peça | Arquivo |
| --- | --- |
| Config única do site (URL, contato, redes) | `lib/site-config.ts` |
| Metadata global (title/OG/Twitter, metadataBase, verificação GSC) | `app/layout.tsx` |
| Helper de metadata por página | `lib/seo.ts` |
| Dados estruturados (JSON-LD) | `lib/structured-data.ts` + `components/JsonLd.tsx` |
| Sitemap (dinâmico, auto-atualizável) | `app/sitemap.ts` |
| robots.txt (libera crawlers de IA) | `app/robots.ts` |
| Índice para IA (llms.txt) | `app/llms.txt/route.ts` |
| Analytics (GA4 + consentimento LGPD) | `components/CookieConsent.tsx` |
| Blog (dados/MDX) | `lib/blog.ts`, `content/blog/` |
| Imagem OG por artigo (gerada) | `app/blog/[slug]/opengraph-image.tsx` |
| FAQ (rich result) | `app/faq/page.tsx` |

## O que se atualiza sozinho ✅

- **Sitemap** (`/sitemap.xml`): inclui automaticamente todo `.mdx` de `content/blog/`.
- **llms.txt** (`/llms.txt`): lista os artigos publicados automaticamente.
- **Imagem OG dos artigos**: gerada a partir do título — nada manual.

Ou seja: **publicar um artigo é só adicionar um arquivo** em `content/blog/`
(veja `content/blog/README.md`).

## Checklist de manutenção 🔧

- **Criou uma página estática nova** (ex.: `/sobre`)? Adicione a rota em
  `STATIC_ROUTES` no topo de `app/sitemap.ts`. (Posts de blog NÃO precisam disso.)
- **Mudou telefone/endereço/redes/URL?** Altere apenas `lib/site-config.ts`.
- **Novo autor de blog?** Cadastre em `lib/authors.ts` com `credentials` e `sameAs`.
- **Bloqueou/liberou rota para busca?** Revise `app/robots.ts`.

## Variáveis de ambiente (configurar na Vercel)

| Variável | Para quê | Obrigatória |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canônica (default: `https://pronttasaude.com.br`) | Não |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics 4 (ex.: `G-XXXXXXX`) | Para ativar GA |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Código de verificação do Search Console | Para verificar via meta tag |

Sem `NEXT_PUBLIC_GA_ID`, o banner de cookies e o GA não são renderizados.

## Passos manuais (uma vez, fora do código)

1. **Google Search Console**: adicionar a propriedade `pronttasaude.com.br`,
   verificar (TXT no DNS ou meta tag → `NEXT_PUBLIC_GSC_VERIFICATION`) e
   **enviar o sitemap** (`/sitemap.xml`).
2. **Google Analytics 4**: criar a propriedade → `NEXT_PUBLIC_GA_ID`.
3. **Assets de marca**: adicionar em `/public`:
   - `og-image.png` (1200×630) — OG padrão do site (home e páginas estáticas);
   - `logo.png` — usado no JSON-LD da organização;
   - `favicon.ico`.
   *(A imagem OG dos artigos de blog já é gerada automaticamente.)*

## Como validar

- **Build**: `npm run build` — gera `/blog`, posts e `/faq` estaticamente.
- **Dados estruturados**: validar no [Rich Results Test](https://search.google.com/test/rich-results) (numa URL de preview).
- **Metadata/JSON-LD no servidor**: "View Source" das páginas.
- **Performance/SEO**: Lighthouse (aba SEO) ≥ 95.
