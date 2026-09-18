import type { Metadata } from 'next';
import { PainelShell } from '@/components/painel/PainelShell';
import { requireAdmin } from '@/lib/auth/current-user';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Mesma casca do /painel; as pages continuam chamando requireAdmin() por conta própria. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <PainelShell user={user}>{children}</PainelShell>;
}
