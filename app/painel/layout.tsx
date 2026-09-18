import type { Metadata } from 'next';
import { PainelShell } from '@/components/painel/PainelShell';
import { requireUser } from '@/lib/auth/current-user';

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PainelShell user={user}>{children}</PainelShell>;
}
