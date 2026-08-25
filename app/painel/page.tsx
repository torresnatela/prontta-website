import Link from 'next/link';
import { ArrowRight, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/proposta/StatusBadge';
import { requireUser } from '@/lib/auth/current-user';
import {
  listAllProposals,
  listProposalsByUser,
  type ProposalListItem,
} from '@/lib/db/queries/proposals';
import { CLIENT_TYPE_LABELS } from '@/lib/proposals/schemas';
import { formatCurrency } from '@/lib/utils';
import { formatCnpj } from '@/lib/proposals/cnpj';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export default async function PainelPage() {
  const user = await requireUser();
  const isAdmin = user.role === 'admin';
  const proposals: ProposalListItem[] = isAdmin
    ? await listAllProposals()
    : await listProposalsByUser(user.id);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-navy">
            {isAdmin ? 'Todas as propostas' : 'Minhas propostas'}
          </h1>
          <p className="mt-1 text-lg text-neutral-gray">
            {proposals.length} {proposals.length === 1 ? 'proposta' : 'propostas'}
          </p>
        </div>
        <Link href="/proposta">
          <Button variant="primary" size="md">
            <FilePlus2 className="mr-2 h-5 w-5" />
            Nova proposta
          </Button>
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-accent-light bg-white p-12 text-center">
          <p className="text-lg text-neutral-gray">
            Você ainda não salvou nenhuma proposta.
          </p>
          <Link href="/proposta" className="mt-4 inline-block">
            <Button variant="secondary" size="md">
              Montar a primeira
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-accent-light bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-accent-light text-sm uppercase tracking-wide text-neutral-gray">
                <th className="px-5 py-4 font-medium">Empresa</th>
                <th className="px-5 py-4 font-medium">Tipo</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Total/paciente</th>
                <th className="px-5 py-4 text-right font-medium">Resultado/mês</th>
                {isAdmin && <th className="px-5 py-4 font-medium">Consultor</th>}
                <th className="px-5 py-4 font-medium">Data</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-accent-light/60 transition-colors last:border-0 hover:bg-accent-light/30"
                >
                  <td className="px-5 py-4">
                    <Link href={`/painel/${p.id}`} className="font-medium text-primary-navy hover:text-primary-cyan">
                      {p.razaoSocial}
                    </Link>
                    <div className="text-sm text-neutral-gray">{formatCnpj(p.cnpj)}</div>
                  </td>
                  <td className="px-5 py-4 text-primary-navy">
                    {CLIENT_TYPE_LABELS[p.clientType] ?? p.clientType}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-4 text-right text-primary-navy">
                    {formatCurrency(Number(p.totalContractValue))}
                  </td>
                  <td className="px-5 py-4 text-right text-primary-navy">
                    {formatCurrency(Number(p.resultadoLiquido))}
                  </td>
                  {isAdmin && <td className="px-5 py-4 text-neutral-gray">{p.ownerName}</td>}
                  <td className="px-5 py-4 text-neutral-gray">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/painel/${p.id}`}
                      className="inline-flex items-center gap-1 text-base font-medium text-primary-cyan hover:underline"
                    >
                      Ver <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
