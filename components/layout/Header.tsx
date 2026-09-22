import Link from 'next/link'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { navItems } from './nav-items'
import { OpenSimulatorButton } from '@/components/simulator-gate'

/**
 * Cabeçalho fixo do site. No desktop (≥1024px) o menu fica inline; abaixo
 * disso vira o hambúrguer do MobileMenu, e o botão de simular encurta para
 * "Simular" em telas menores que 640px para caber ao lado da logo.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-custom flex min-h-[72px] items-center justify-between gap-3 lg:min-h-[92px] lg:gap-6">
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

        <div className="flex shrink-0 items-center gap-2">
          <OpenSimulatorButton size="sm">
            <span className="sm:hidden">Simular</span>
            <span className="hidden sm:inline">Simular proposta</span>
          </OpenSimulatorButton>
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  )
}
