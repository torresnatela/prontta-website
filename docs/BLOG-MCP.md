# MCP do blog: publicar artigos com IA

Este MCP (Model Context Protocol) deixa uma IA, como o Claude, **escrever e enviar
artigos para o blog** já com os metadados de SEO (Google) e GEO (ChatGPT, Gemini,
Perplexity etc.) preenchidos e validados. Nenhum artigo vai ao ar sozinho: **cada
envio vira um Pull Request** no GitHub. Você revisa o preview da Vercel e faz o merge.

```
IA (claude.ai, Claude Desktop, Claude Code, ChatGPT, Cursor…)
 │  MCP · Streamable HTTP
 ▼
https://pronttasaude.com.br/api/blog/mcp      ← token (BLOG_MCP_TOKEN)
 │  1. valida: schema, MDX (compila como no build), checklist SEO/GEO
 │  2. envia capa e imagens → public/blog/images/<slug>/
 │  3. commita content/blog/<slug>.mdx na branch blog/<slug>
 ▼
Pull Request (rótulo "blog") → preview da Vercel → você revisa → merge → no ar
```

Código: `app/api/blog/mcp/route.ts` e `lib/blog-mcp/`.

---

## 1. Configuração inicial (uma vez só)

### 1.1 Gere o token do MCP

É a "senha" que a IA usa para se conectar. Guarde-a num gerenciador de senhas.

```bash
openssl rand -hex 32
```

### 1.2 Crie um token do GitHub (para abrir os PRs)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** *Only select repositories* → `torresnatela/prontta-website`.
3. **Permissions → Repository permissions:**
   - **Contents:** Read and write
   - **Pull requests:** Read and write
4. Defina uma validade (ex.: 1 ano) e copie o token (`github_pat_...`).

### 1.3 Configure as variáveis na Vercel

Em **Vercel → projeto → Settings → Environment Variables** (ambiente **Production**),
ou pelo terminal:

```bash
vercel env add BLOG_MCP_TOKEN production      # cole o token do passo 1.1
vercel env add BLOG_GITHUB_TOKEN production   # cole o token do passo 1.2
```

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `BLOG_MCP_TOKEN` | Sim | Token de acesso ao MCP (mín. 24 caracteres). Sem ele, o MCP fica **desligado** (503). |
| `BLOG_GITHUB_TOKEN` | Sim, para publicar | Abrir branch, commit e PR. Sem ele, dá para validar, mas não publicar. |
| `BLOG_GITHUB_REPO` | Não | Padrão: `torresnatela/prontta-website`. |
| `BLOG_GITHUB_BASE` | Não | Branch base dos PRs. Padrão: `main`. |

Depois de salvar, **faça um redeploy de produção** para as variáveis valerem.

> Para testar localmente, coloque as mesmas variáveis no `.env.local`, rode `npm run dev`
> e use a URL `http://localhost:3000/api/blog/mcp`.

---

## 2. Conectar a IA

A URL do servidor é:

```
https://pronttasaude.com.br/api/blog/mcp
```

O token vai de um destes dois jeitos:

- **Header** `Authorization: Bearer SEU_TOKEN`: use sempre que o cliente permitir;
- **Na URL** `?key=SEU_TOKEN`: para clientes que só aceitam uma URL (claude.ai, ChatGPT).

### claude.ai (web e app) e Claude Desktop

Os conectores são da sua conta: configurando no claude.ai, eles aparecem também no
Claude Desktop e no app do celular.

1. **Configurações → Conectores → Adicionar conector personalizado**.
   (Em planos Team/Enterprise, quem adiciona é um admin, em *Configurações da organização → Conectores*.)
2. **Nome:** `Blog Prontta`
3. **URL:** `https://pronttasaude.com.br/api/blog/mcp?key=SEU_TOKEN`
4. Deixe as opções de OAuth em branco e salve.
5. Numa conversa, abra o menu de ferramentas (ícone de controles) e ative o conector **Blog Prontta**.

> Dica: crie um **Projeto** no claude.ai (ex.: "Blog Prontta") e cole as instruções da
> seção 4 nas instruções do projeto. Assim toda conversa ali já sabe o que fazer.

### Claude Code

```bash
claude mcp add --transport http prontta-blog https://pronttasaude.com.br/api/blog/mcp \
  --header "Authorization: Bearer SEU_TOKEN"
```

Confira com `claude mcp list` (deve aparecer `prontta-blog … ✓ Connected`).
Use `--scope user` para ter o conector em qualquer pasta.

### Claude Desktop via arquivo de configuração (alternativa)

Se preferir não usar o conector da conta, edite o `claude_desktop_config.json`
(*Configurações → Desenvolvedor → Editar configuração*):

```json
{
  "mcpServers": {
    "prontta-blog": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote", "https://pronttasaude.com.br/api/blog/mcp",
        "--header", "Authorization: Bearer ${BLOG_MCP_TOKEN}"
      ],
      "env": { "BLOG_MCP_TOKEN": "SEU_TOKEN" }
    }
  }
}
```

Reinicie o Claude Desktop. Requer Node.js instalado.

### Cursor

`~/.cursor/mcp.json` (ou `.cursor/mcp.json` no projeto; **não commite o token**):

```json
{
  "mcpServers": {
    "prontta-blog": {
      "url": "https://pronttasaude.com.br/api/blog/mcp",
      "headers": { "Authorization": "Bearer SEU_TOKEN" }
    }
  }
}
```

### ChatGPT e outros clientes MCP

No ChatGPT (com o **modo desenvolvedor** ativado em *Configurações → Apps e conectores → Avançado*),
crie um conector com a URL `https://pronttasaude.com.br/api/blog/mcp?key=SEU_TOKEN` e
autenticação **Nenhuma**. Qualquer outro cliente com suporte a MCP via HTTP (Streamable HTTP)
funciona com a URL + header ou `?key=`.

### Testar a conexão sem IA

```bash
npx @modelcontextprotocol/inspector
```

Na tela do Inspector: *Transport* = **Streamable HTTP**, URL do servidor, e em
*Authentication* informe o header `Authorization: Bearer SEU_TOKEN`. Clique em
**Connect → Tools → List Tools** e rode `get_blog_guidelines`.

---

## 3. Usar

### Pedido típico

> Escreva um artigo para o blog da Prontta sobre **como reduzir o absenteísmo com
> telessaúde nas empresas**, palavra-chave **"telessaúde corporativa"**, para gestores de RH.
> Valide e publique.

Nos clientes que mostram prompts de MCP (ex.: menu **+** do claude.ai, `/` no Claude Code),
também dá para usar o prompt pronto **`escrever_artigo`**, informando tema e palavra-chave.

### O que a IA faz

1. `get_blog_guidelines`: lê o guia editorial (fatos da marca, regras YMYL, estrutura,
   metadados, autores, categorias, tags, páginas para linkar).
2. `list_posts`: vê os posts publicados e os PRs em revisão, escolhe links internos e
   evita disputar a mesma palavra-chave com outro post (canibalização).
3. Escreve o artigo com TL;DR, H2 em forma de pergunta, dados com fonte, FAQ e CTA.
4. `validate_post`: corrige os **erros** e o máximo de **avisos** (meta: score ≥ 85).
5. `publish_post`: abre o PR e te devolve o link.

### Revisar e publicar

1. Abra o link do PR. A descrição traz a tabela de metadados, o score, os avisos que
   sobraram e um checklist de revisão.
2. Com o projeto da Vercel ligado ao GitHub, a Vercel comenta no PR com a **URL de preview**.
   Abra `/blog/<slug>` nela.
3. Confira fatos, números, fontes e tom.
4. Quer mudanças? Peça à IA na mesma conversa ("encurte a introdução e troque a capa").
   Ela chama `publish_post` de novo **com o mesmo slug**, e o PR é atualizado.
   Ou edite direto no GitHub.
5. **Merge** → a Vercel publica em produção. O post entra sozinho em `/blog`, no
   `sitemap.xml` e no `llms.txt`.

Para descartar: feche o PR (a branch `blog/<slug>` pode ser apagada).

### Atualizar um post antigo

> Atualize o post `telesaude-hibrida-o-que-e`: adicione uma seção sobre a regulamentação
> do CFM e defina a palavra-chave foco.

A IA usa `get_post` para ler a versão atual e `update_post` enviando só o que muda.
O `updatedAt` vira a data de hoje, o que sinaliza conteúdo atualizado para o Google e para as IAs.
Também abre PR.

### Ferramentas disponíveis

| Ferramenta | O que faz | Grava algo? |
| --- | --- | --- |
| `get_blog_guidelines` | Guia editorial SEO/GEO completo | Não |
| `list_posts` | Posts publicados + PRs de blog abertos | Não |
| `get_post` | MDX completo de um post | Não |
| `validate_post` | Valida um artigo novo e dá score, erros e avisos | Não |
| `publish_post` | Artigo novo → PR | Branch + PR |
| `update_post` | Edita um post publicado → PR (`dryRun: true` só valida) | Branch + PR |

### Campos que a IA preenche

| Campo | Uso |
| --- | --- |
| `title` | H1 da página. |
| `seoTitle` | Meta title (≤ ~48 caracteres; o site acrescenta " \| Prontta Saúde"). |
| `description` | Meta description, 120–160 caracteres. |
| `slug` | URL `/blog/<slug>` (gerado do título se omitido). |
| `focusKeyword` | Palavra-chave principal. Entra em `<meta keywords>` e no JSON-LD (`about`, `keywords`). |
| `keywords` | 3–8 secundárias/long-tail. Entram em `<meta keywords>` e no JSON-LD. |
| `category`, `tags` | Organização; a categoria vira `articleSection` no JSON-LD. |
| `author` | Id de `lib/authors.ts` (E-E-A-T). |
| `content` | Corpo em MDX. |
| `faq` | 3–6 perguntas, que viram JSON-LD `FAQPage`. |
| `coverImage` | Capa (URL https ou base64) + `alt`, salva em `public/blog/images/<slug>/cover.*`. |
| `images` | Imagens do corpo, com `filename`. |
| `draft` | `true` = não aparece em produção. |

---

## 4. Instruções sugeridas para um Projeto no claude.ai

Cole nas **instruções do projeto**:

```text
Você é redator(a) do blog da Prontta Saúde (telessaúde assistida B2B para clínicas,
academias e empresas). Use SEMPRE o conector "Blog Prontta":
1. Chame get_blog_guidelines e list_posts antes de escrever.
2. Siga o guia à risca: TL;DR no início, H2 em forma de pergunta, dados com fonte oficial,
   FAQ com 3–6 perguntas, 2+ links internos e CTA para /proposta/...
3. Rode validate_post e só publique sem erros e com score ≥ 85.
4. Publique com publish_post e me responda com o link do PR e um resumo dos metadados.
Nunca afirme que a Prontta é plano de saúde nem que a IA de triagem faz diagnóstico.
Se eu não disser a palavra-chave, proponha 3 opções e me pergunte antes de escrever.
```

---

## 5. O que o validador checa

**Erros (bloqueiam o envio):**
- frontmatter inválido, autor inexistente, slug inválido ou já usado (em post novo);
- `# H1` no corpo (o título já é o H1);
- componente MDX que não existe (só `<Callout>` está disponível), `import`/`export`;
- MDX que não compila (mesmos plugins do build), o que evita quebrar o deploy;
- imagem sem texto alternativo, ou imagem do corpo que não foi enviada;
- arquivo de imagem que não é PNG/JPG/WebP/AVIF ou tem mais de 3 MB.

**Avisos (reduzem o score em 5 pontos cada):**
- *SEO:* meta title longo; description fora de 120–160; palavra-chave foco ausente
  no título, description, slug, TL;DR ou H2; poucas ocorrências ou excesso (> 3%);
  menos de 3 H2; menos de 800 palavras; menos de 3 keywords; sem tags; sem capa;
  menos de 2 links internos; link interno quebrado; canibalização com outro post.
- *GEO/AEO:* não abre com TL;DR; menos da metade dos H2 em forma de pergunta; FAQ
  fora de 3–6 itens, pergunta sem "?" ou resposta longa; nenhuma fonte externa;
  parágrafos com mais de 120 palavras; sem listas nem tabelas.

O site gera sozinho: meta tags, Open Graph, imagem OG, JSON-LD (`Article`,
`FAQPage`, `BreadcrumbList`), `sitemap.xml` e `llms.txt`.

---

## 6. Segurança

- O `BLOG_MCP_TOKEN` dá acesso para **abrir PRs**, não para publicar direto: nada vai ao ar sem o seu merge.
- Não compartilhe a URL com `?key=`: ela contém o token.
- **Trocar o token:** gere um novo, atualize na Vercel, faça redeploy e atualize os conectores.
  O token antigo para de funcionar na hora.
- O token do GitHub tem acesso só a este repositório, com o mínimo de permissões. Renove-o antes de expirar.
- A rota fica fora do `robots.txt` (`/api/` bloqueado) e exige o token em toda requisição.

## 7. Problemas comuns

| Sintoma | Causa / solução |
| --- | --- |
| `401 Token inválido ou ausente` | Token errado ou sem `Bearer`/`?key=`. Confira a URL/header do conector. |
| `503 MCP do blog desativado` | `BLOG_MCP_TOKEN` não configurado em produção (ou com menos de 24 caracteres). Configure e faça redeploy. |
| `BLOG_GITHUB_TOKEN não configurado` | Falta o token do GitHub: valida, mas não publica. |
| `GitHub … → 403/404` | Token do GitHub sem permissão *Contents*/*Pull requests* de escrita, expirado, ou repositório errado em `BLOG_GITHUB_REPO`. |
| Conector não aparece / sem ferramentas | Reative o conector na conversa. No claude.ai, remova e adicione de novo. |
| "Já existe um post com o slug" | Use `update_post` ou outro slug. |
| Imagem recusada | Use URL https pública de PNG/JPG/WebP/AVIF com até 3 MB. Prefira URL a base64 (o limite de requisição da Vercel é 4,5 MB). |
| Preview do PR falhou no build | Abra o log na Vercel. O validador compila o MDX, então o erro costuma estar em imagem ou link. Peça à IA para corrigir e reenviar. |
