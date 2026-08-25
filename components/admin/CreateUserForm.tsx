'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { createUser } from '@/app/admin/actions';

const EMPTY = { name: '', email: '', password: '', role: 'partner' };

const roleOptions = [
  { value: 'partner', label: 'Parceiro' },
  { value: 'admin', label: 'Administrador' },
];

export function CreateUserForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await createUser(values);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'Não foi possível criar o usuário.');
      return;
    }
    setSuccess(
      `Usuário ${values.email} criado. Envie o e-mail e a senha ao parceiro (não há e-mail automático).`,
    );
    setValues(EMPTY);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Nome *"
        placeholder="Nome do parceiro"
        value={values.name}
        onChange={(e) => set('name', e.target.value)}
        required
      />
      <Input
        label="E-mail *"
        type="email"
        placeholder="parceiro@empresa.com.br"
        value={values.email}
        onChange={(e) => set('email', e.target.value)}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Senha * (mín. 10 caracteres)"
          type="text"
          placeholder="senha inicial"
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          required
        />
        <Select
          label="Papel"
          value={values.role}
          onChange={(e) => set('role', e.target.value)}
          options={roleOptions}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-base text-green-700" role="status">
          {success}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" isLoading={submitting}>
        {submitting ? 'Criando...' : 'Criar usuário'}
      </Button>
    </form>
  );
}
