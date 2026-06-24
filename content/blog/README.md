# Blog da Prontta Saúde — como publicar

Os artigos do blog são arquivos **MDX** nesta pasta (`content/blog/`). Adicionar um
arquivo `.mdx` aqui é **tudo** o que você precisa fazer para publicar:

- o post passa a aparecer em `/blog`;
- entra **automaticamente** no `sitemap.xml` e no `/llms.txt` (sem edição manual);
- ganha uma imagem de compartilhamento (Open Graph) gerada automaticamente.

> O arquivo `telesaude-hibrida-o-que-e.mdx` é um **exemplo** funcional. Edite-o ou
> apague-o quando começar a publicar seu próprio conteúdo.

## 1. Crie o arquivo

O **nome do arquivo vira a URL** (slug). Use minúsculas, sem acentos, com hífens:

```
content/blog/ampliar-especialidades-clinica.mdx
→ https://pronttasaude.com.br/blog/ampliar-especialidades-clinica
```

## 2. Preencha o frontmatter

No topo do arquivo, entre `---`:

```yaml
---
title: "Título do artigo (aparece como H1 e no Google)"
description: "Resumo de 1–2 frases. É a meta description — escreva pensando no clique."
publishedAt: "2026-06-23"        # data ISO (AAAA-MM-DD)
updatedAt: "2026-07-01"          # opcional, quando revisar o conteúdo
author: "equipe-prontta"         # id de um autor em lib/authors.ts
category: "Telesaúde"            # categoria principal
tags: ["telesaúde", "gestão de clínicas"]
keywords: ["palavra-chave 1", "palavra-chave 2"]   # opcional
coverImage: "/blog/minha-capa.jpg"                 # opcional (em /public)
draft: false                     # true = não publica em produção
faq:                             # opcional, mas recomendado (vira rich result + ajuda IA)
  - question: "Pergunta frequente?"
    answer: "Resposta direta e factual."
---
```

Campos obrigatórios: `title`, `description`, `publishedAt`. O build **falha** se o
frontmatter estiver inválido (isso é proposital — protege contra erros).

## 3. Escreva pensando em SEO e em IA (AEO/GEO)

Conteúdo de saúde é YMYL: Google e IAs valorizam clareza, autoria e dados. Siga:

- **Comece com um resumo / TL;DR** em negrito (a IA costuma citar o primeiro parágrafo).
- **Use H2 (`##`) como perguntas** que as pessoas realmente buscam.
- **Responda direto** logo abaixo de cada H2, com dados e números concretos.
- **Preencha o bloco `faq`** com 3–5 perguntas — vira rich result no Google e resposta em IA.
- **Link internamente** para `/proposta` e outros artigos.
- Atribua o post a um **autor com credenciais** (ex.: CRM) em `lib/authors.ts`.

### Componentes disponíveis no MDX

Além de Markdown (títulos, listas, tabelas, citações), você pode usar:

```mdx
<Callout title="Opcional">Destaque importante para o leitor.</Callout>
```

## 4. Autores

Cadastre autores em [`lib/authors.ts`](../../lib/authors.ts). Preencha `credentials`
(ex.: `"CRM-MG 12345"`) e `sameAs` (LinkedIn/Lattes) sempre que possível — reforça
o E-E-A-T exigido para conteúdo médico.

## 5. Imagens

Coloque imagens em `public/blog/` e referencie por caminho absoluto, ex.:
`![Legenda](/blog/minha-imagem.jpg)`. A imagem de capa (`coverImage`) aparece no card
da listagem.

---

Mais sobre o SEO do projeto em [`docs/SEO.md`](../../docs/SEO.md).
