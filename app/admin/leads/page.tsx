import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/current-user';
import { listLeads } from '@/lib/db/queries/leads';
import { LEAD_SEGMENT_LABELS, type LeadSegment } from '@/lib/leads/schemas';
import { formatCnpj } from '@/lib/proposals/cnpj';

export const metadata: Metadata = {
  title: 'Leads',
  robots: { index: false, follow: false },
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

/** (31) 99999-0000 a partir dos dígitos; devolve como está se não bater o padrão. */
function formatPhone(digits: string): string {
  const m = /^(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await listLeads();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary-navy">Leads do site</h1>
        <p className="mt-1 text-lg text-neutral-gray">
          Quem preencheu o gate do simulador — {leads.length}{' '}
          {leads.length === 1 ? 'registro' : 'registros'} mais recentes.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-accent-light bg-white p-12 text-center">
          <p className="text-lg text-neutral-gray">Nenhum lead ainda.</p>
        </div>
      ) : (
        <section className="overflow-x-auto rounded-3xl border border-accent-light bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-accent-light text-sm uppercase tracking-wide text-neutral-gray">
                <th className="px-5 py-4 font-medium">Quando</th>
                <th className="px-5 py-4 font-medium">Nome</th>
                <th className="px-5 py-4 font-medium">WhatsApp</th>
                <th className="px-5 py-4 font-medium">CNPJ</th>
                <th className="px-5 py-4 font-medium">Segmento</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-accent-light/60 last:border-0">
                  <td className="px-5 py-4 text-neutral-gray">{formatDateTime(lead.createdAt)}</td>
                  <td className="px-5 py-4 font-medium text-primary-navy">{lead.name}</td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://wa.me/55${lead.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary-cyan hover:underline"
                    >
                      {formatPhone(lead.phone)}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-neutral-gray">
                    {lead.cnpj ? formatCnpj(lead.cnpj) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary-cyan/10 px-3 py-1 text-sm font-medium text-primary-cyan">
                      {LEAD_SEGMENT_LABELS[lead.segment as LeadSegment] ?? lead.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
