# Prontta Saúde - Landing Page

Site institucional da Prontta Saúde, infraestrutura B2B de telessaúde assistida para clínicas, academias e empresas.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 📁 Estrutura do Projeto

```
prontta-website/
├── app/
│   ├── layout.tsx          # Layout raiz com metadata SEO
│   ├── page.tsx            # Landing page principal
│   ├── proposta/
│   │   └── page.tsx        # Calculadora de propostas
│   ├── globals.css         # Estilos globais + Tailwind
│   ├── sitemap.ts          # Sitemap dinâmico
│   └── robots.ts           # robots.txt
├── components/
│   ├── ui/                 # Componentes base (Button, Input, Eyebrow, Note, Tag)
│   ├── layout/             # Header, Footer, Logo
│   ├── sections/           # Seções da home (Hero, Doors, Programs, FinalCTA…)
│   ├── simulator-gate/     # Modal que antecede os simuladores
│   └── calculator/         # Formulário e lógica da calculadora
├── lib/
│   ├── pricing.ts          # Regras de precificação
│   ├── seo.ts              # Configurações SEO
│   └── utils.ts            # Funções utilitárias
└── public/                 # Assets estáticos
```

## 🎨 Paleta de Cores

Tema navy escuro, tokens em `tailwind.config.ts`:

```css
bg:      #001632   /* fundo da página */
surface: #00204D   /* seções alternadas */
card:    #0A2E5C   /* cards */
ink:     #EDF4FA   /* texto (ink-2 #B7CBE0, ink-3 #93AECB) */
line:    #17406F   /* bordas */
cyan:    #01B4F7   /* marca e botões (cyan-ink #6FD3F8) */
```

Fontes: Inter (corpo) e Manrope (títulos). A área logada (`/login`, `/painel`,
`/admin`) continua clara, com `primary-*`, `accent-light` e `neutral-gray`.

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 📄 Páginas

### Landing Page (`/`)
- Hero com estatísticas e CTAs
- Seção de serviços oferecidos
- Como funciona (4 passos)
- Benefícios para clínicas
- Formulário de contato rápido
- Footer com informações de contato

### Proposta e Simulador (`/proposta/clinicas`, `/proposta/academias`, `/proposta/empresa`)
- Formulário em 3 etapas
- Seleção de tipo de serviço
- Configuração de pacientes/mês
- Cálculo automático de valores
- Geração de proposta visual

## 🔧 Serviços Disponíveis

1. **Retorno Implante Capilar**: Terceirização de retorno de pacientes
2. **Acompanhamento Pós-Operatório**: Psicólogo + Nutricionista + Endocrinologista
3. **Pré-Operatório Cardiológico**: Análise cardiológica para liberação cirúrgica

## 📱 Responsividade

O site é totalmente responsivo, otimizado para:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1280px+)

## 🔍 SEO

- Meta tags otimizadas
- Open Graph e Twitter Cards
- JSON-LD Schema (MedicalOrganization)
- Sitemap XML dinâmico
- robots.txt configurado

## 📦 Dependências Principais

```json
{
  "next": "14.2.5",
  "react": "^18.3.1",
  "framer-motion": "^11.3.8",
  "react-hook-form": "^7.52.1",
  "zod": "^3.23.8",
  "lucide-react": "^0.427.0",
  "tailwindcss": "^3.4.7"
}
```

## 📝 Licença

Todos os direitos reservados © Prontta Saúde

