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
