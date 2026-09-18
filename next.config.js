const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite importar arquivos .mdx como módulos (compilados pelo bundler, com
  // a versão de React correta — diferente de compilar MDX em runtime).
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // Capas locais (em /public) não precisam de config. Estes padrões liberam
    // capas hospedadas remotamente (coverImage com URL https), caso sejam usadas.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    return [
      // A proposta "sem sufixo" virou /proposta/clinicas quando cada canal ganhou
      // a sua URL. Permanente: é a URL que circulou em material impresso e
      // links antigos, e o Google deve consolidar o sinal na nova.
      { source: '/proposta', destination: '/proposta/clinicas', permanent: true },
      // O layout aprovado do site cita /proposta/empresas (plural); a rota
      // real é no singular.
      { source: '/proposta/empresas', destination: '/proposta/empresa', permanent: true },
    ]
  },
}

// Plugins passados como STRINGS por exigência do Turbopack (precisam ser
// serializáveis). remark-frontmatter remove o YAML do conteúdo renderizado.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-frontmatter'], ['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      ['rehype-autolink-headings', { behavior: 'wrap' }],
    ],
  },
})

module.exports = withMDX(nextConfig)
