'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { OpenSimulatorButton } from '@/components/simulator-gate'
import type { NavItem } from './nav-items'

/**
 * Menu do cabeçalho abaixo de 1024px: botão hambúrguer que abre um painel
 * colado à base do header (sticky, logo o bloco de posicionamento do painel)
 * com os mesmos links do desktop.
 * Fecha ao escolher um link, com Esc e ao mudar de rota.
 */
export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-btn-line bg-transparent text-ink hover:border-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      >
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-b border-line bg-surface shadow-[0_24px_40px_rgba(0,8,20,0.5)]"
        >
          <nav className="container-custom flex flex-col py-3" aria-label="Menu principal">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-2 py-3.5 text-[16px] font-medium text-ink-2 last:border-b-0 hover:text-ink"
              >
                {item.name}
              </Link>
            ))}
            <OpenSimulatorButton className="mt-4 w-full" onClick={() => setOpen(false)}>
              Simular proposta
            </OpenSimulatorButton>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
