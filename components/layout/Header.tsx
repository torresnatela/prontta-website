import Link from 'next/link'
import { Logo } from './Logo'
import { OpenSimulatorButton } from '@/components/simulator-gate'

// Âncoras absolutas (com "/") para que o menu funcione a partir de qualquer
// página — inclusive /blog e /faq, não só da home.
const navItems = [
  { name: 'Clínicas', href: '/#portas' },
  { name: 'Academias', href: '/#portas' },
  { name: 'Empresas', href: '/#portas' },
  { name: 'Programas', href: '/#programas' },
  { name: 'Como funciona', href: '/#como-funciona' },
  { name: 'Conformidade', href: '/#conformidade' },
]

/**
 * Cabeçalho fixo do site. Abaixo de 1024px o menu some e ficam só a logo e o
 * botão de simular — como no layout aprovado.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-custom flex min-h-[92px] items-center justify-between gap-4 lg:gap-6">
        <Link href="/" aria-label="Prontta Saúde" className="shrink-0">
          <Logo size="nav" variant="white" priority />
        </Link>

        <nav className="hidden items-center gap-[26px] text-[15px] font-medium text-ink-2 lg:flex">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-ink-2 hover:text-ink">
              {item.name}
            </Link>
          ))}
        </nav>

        <OpenSimulatorButton size="sm">Simular proposta</OpenSimulatorButton>
      </div>
    </header>
  )
}
