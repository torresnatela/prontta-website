import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesso à área de parceiros da Prontta Saúde.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent-light via-white to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Início">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-primary-navy/10 md:p-10">
          <h1 className="font-display text-3xl font-bold text-primary-navy">Área de parceiros</h1>
          <p className="mt-2 mb-8 text-lg text-neutral-gray">
            Entre para montar e gerir suas propostas.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-base text-neutral-gray">
          Não tem acesso?{' '}
          <a
            href="mailto:contato@pronttasaude.com.br"
            className="font-medium text-primary-cyan hover:underline"
          >
            Fale com a Prontta
          </a>
        </p>
      </div>
    </main>
  );
}
