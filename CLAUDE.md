# Prontta Saúde — site

Site institucional da Prontta Saúde (terceirização médica + telesaúde híbrida).
Next.js 16 (App Router) · React 18 · TypeScript · Tailwind CSS · deploy na Vercel.

## Comandos

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — lint

## Convenções

- **Config do site**: tudo que descreve a empresa (URL, contato, redes) vive em
  `lib/site-config.ts`. Não duplique esses valores — importe de lá.
- **Estilo**: tokens em `tailwind.config.ts`/`app/globals.css` (cores
  `primary-cyan`/`primary-navy`, fontes Outfit/Space Grotesk, utilitários
  `container-custom`, `section-padding`, `gradient-text`). Reuse `components/ui`.

## SEO — manter sempre atualizado ⚠️

Detalhes completos em [`docs/SEO.md`](docs/SEO.md). Regras essenciais:

- **Nova página estática** (ex.: `/sobre`): adicione a rota em `STATIC_ROUTES`
  no topo de `app/sitemap.ts` e confira `app/robots.ts`.
- **Blog é automático**: criar um `.mdx` em `content/blog/` já entra na listagem,
  no `sitemap.xml` e no `llms.txt` — não há lista manual de posts.
  Guia de publicação: `content/blog/README.md`.
- **Dados estruturados (JSON-LD)**: use os helpers de `lib/structured-data.ts`.
- **Metadata por página**: use `generateMetadata` de `lib/seo.ts`.

## Blog (MDX)

- Posts: `content/blog/*.mdx` (frontmatter validado por Zod em `lib/blog.ts`).
- Autores: `lib/authors.ts` (preencha credenciais — conteúdo de saúde é YMYL/E-E-A-T).
- Componentes: `components/blog/`.
