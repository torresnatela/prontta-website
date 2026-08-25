import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/current-user';
import { listUsers } from '@/lib/db/queries/users';
import { CreateUserForm } from '@/components/admin/CreateUserForm';

export const metadata: Metadata = {
  title: 'Usuários',
  robots: { index: false, follow: false },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await listUsers();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-primary-navy">Usuários</h1>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="overflow-x-auto rounded-3xl border border-accent-light bg-white">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead>
              <tr className="border-b border-accent-light text-sm uppercase tracking-wide text-neutral-gray">
                <th className="px-5 py-4 font-medium">Nome</th>
                <th className="px-5 py-4 font-medium">E-mail</th>
                <th className="px-5 py-4 font-medium">Papel</th>
                <th className="px-5 py-4 font-medium">Criado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-accent-light/60 last:border-0">
                  <td className="px-5 py-4 font-medium text-primary-navy">{u.name}</td>
                  <td className="px-5 py-4 text-neutral-gray">{u.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        u.role === 'admin'
                          ? 'rounded-full bg-primary-navy/10 px-3 py-1 text-sm font-medium text-primary-navy'
                          : 'rounded-full bg-primary-cyan/10 px-3 py-1 text-sm font-medium text-primary-cyan'
                      }
                    >
                      {u.role === 'admin' ? 'Administrador' : 'Parceiro'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-neutral-gray">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-3xl border border-accent-light bg-white p-6">
          <h2 className="mb-1 font-display text-xl font-bold text-primary-navy">Novo usuário</h2>
          <p className="mb-5 text-base text-neutral-gray">
            Contas são criadas aqui (não há cadastro público).
          </p>
          <CreateUserForm />
        </section>
      </div>
    </div>
  );
}
