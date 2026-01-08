# Prontta Saúde - Landing Page

Landing page moderna para a Prontta Saúde, empresa de terceirização de serviços médicos especializados.

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
│   ├── ui/                 # Componentes base (Button, Input, Card)
│   ├── layout/             # Header, Footer, Logo
│   ├── sections/           # Hero, Services, Benefits, HowItWorks, CTA
│   └── calculator/         # Formulário e lógica da calculadora
├── lib/
│   ├── pricing.ts          # Regras de precificação
│   ├── seo.ts              # Configurações SEO
│   └── utils.ts            # Funções utilitárias
└── public/                 # Assets estáticos
```

## 🎨 Paleta de Cores

```css
--primary-cyan: #00B4E6;    /* Azul principal */
--primary-navy: #0D2137;    /* Azul escuro */
--accent-light: #E6F9FF;    /* Fundo claro */
--neutral-gray: #6B7280;    /* Textos secundários */
```

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

### Calculadora de Propostas (`/proposta`)
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

