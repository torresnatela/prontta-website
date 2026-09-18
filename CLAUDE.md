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
- **Estilo**: site institucional em tema navy escuro. Tokens em
  `tailwind.config.ts` (cores `bg`/`surface`/`card`/`ink`/`line`/`cyan`/`band`/`foot`,
  fontes Inter (`font-sans`) e Manrope (`font-display`)) e utilitários em
  `app/globals.css` (`container-custom`, `section-padding`, `heading`).
  Reuse `components/ui` (Button/ButtonLink, Eyebrow, Note, Tag, SectionHead).
  `primary-*`/`accent-light`/`neutral-gray` são só da área logada (clara).
- **Botões "Simular"**: use `OpenSimulatorButton` (`components/simulator-gate`) —
  abre o modal que coleta os dados e leva a `/proposta/{clinicas,academias,empresa}`.

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
