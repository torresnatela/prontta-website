import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import type { User } from '@/lib/db/schema';
import { logout } from '@/lib/auth/actions';

/**
 * Casca da área logada — cabeçalho com navegação e o container do conteúdo.
 * Compartilhada por /painel e /admin (cada layout resolve o usuário e passa
 * aqui). Tema claro por cima da base navy do site.
 */
export function PainelShell({ user, children }: { user: User; children: React.ReactNode }) {
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-accent-light/20 text-primary-navy">
      <header className="border-b border-accent-light bg-white">
        <div className="container-custom mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/painel" aria-label="Painel">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-6 text-base font-medium">
              <Link href="/painel" className="text-primary-navy hover:text-primary-cyan">
                Propostas
              </Link>
              <Link href="/proposta/clinicas" className="text-primary-navy hover:text-primary-cyan">
                Nova proposta
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin/leads" className="text-primary-navy hover:text-primary-cyan">
                    Leads
                  </Link>
                  <Link href="/admin/users" className="text-primary-navy hover:text-primary-cyan">
                    Usuários
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-base text-neutral-gray sm:inline">
              {user.name}
              {isAdmin && (
                <span className="ml-2 rounded-full bg-primary-navy/10 px-2 py-0.5 text-xs font-medium text-primary-navy">
                  admin
                </span>
              )}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-medium text-neutral-gray transition-colors hover:bg-accent-light hover:text-primary-navy"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-custom mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
