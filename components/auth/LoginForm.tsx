'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login } from '@/lib/auth/actions';

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? undefined;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Em caso de sucesso, o server action faz redirect() e o cliente navega —
    // o await não retorna um valor de erro. Em caso de falha, volta { error }.
    const result = await login({ email, password, next });
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@pronttasaude.com.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={submitting}
      >
        {submitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
