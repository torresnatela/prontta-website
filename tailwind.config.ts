import type { Config } from 'tailwindcss'

/**
 * Tokens do site institucional (tema navy escuro).
 *
 * Os nomes seguem o modelo de referência 1:1 (bg, surface, card, ink, line,
 * cyan, band, foot…) para que qualquer comparação com o layout aprovado seja
 * direta. `primary`, `accent` e `neutral` ficam só para a área logada
 * (/login, /painel, /admin), que continua clara.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#001632',
        surface: { DEFAULT: '#00204D', 2: '#062B57' },
        card: '#0A2E5C',
        ink: { DEFAULT: '#EDF4FA', 2: '#B7CBE0', 3: '#93AECB' },
        line: { DEFAULT: '#17406F', 2: '#12335A' },
        cyan: {
          DEFAULT: '#01B4F7',
          ink: '#6FD3F8',
          soft: '#0C3B63',
          'soft-ink': '#9BDFFA',
          /* traço dos ícones/checks, um tom abaixo do botão */
          stroke: '#00B3F0',
        },
        amber: { DEFAULT: '#FFC64D', soft: '#3E2F0D', 'soft-ink': '#FFD07A' },
        btn: { fg: '#00182F', line: '#2B5B8F' },
        band: { DEFAULT: '#062B57', card: '#0E3A6E', ink: '#FFFFFF', 'ink-2': '#B7CBE0' },
        foot: {
          DEFAULT: '#000E1F',
          ink: '#D7E4F0',
          'ink-2': '#9DB6D0',
          line: '#143257',
          label: '#7E9CBC',
        },

        // Área logada (tema claro).
        primary: {
          cyan: '#01B4F7',
          navy: '#001632',
        },
        accent: {
          light: '#E6F9FF',
        },
        neutral: {
          gray: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Segoe UI', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      maxWidth: {
        wrap: '1200px',
      },
    },
  },
  plugins: [],
}
export default config
