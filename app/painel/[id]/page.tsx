import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/proposta/StatusBadge';
import { StatusEditor } from '@/components/proposta/StatusEditor';
import { DownloadProposalButton } from '@/components/proposta/DownloadProposalButton';
import { requireUser } from '@/lib/auth/current-user';
import { getProposalById } from '@/lib/db/queries/proposals';
import { CLIENT_TYPE_LABELS, type ProposalStatus } from '@/lib/proposals/schemas';
import { formatCnpj } from '@/lib/proposals/cnpj';
import { PRICING_MODEL_VERSION } from '@/lib/pricing';
import { formatCurrency } from '@/lib/utils';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
}

function implantationLabel(impl: { mode: string; value?: number }): string {
  if (impl.mode === 'valor' && typeof impl.value === 'number') return formatCurrency(impl.value);
  if (impl.mode === 'isento') return 'Isenta';
  return 'A combinar';
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-accent-light/60 py-3 last:border-0">
      <span className="text-neutral-gray">{label}</span>
      <span className="text-right font-medium text-primary-navy">{value}</span>
    </div>
  );
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const proposal = await getProposalById(id);

  if (!proposal) notFound();
  // Ownership: parceiro só acessa as próprias; admin acessa qualquer uma.
  if (user.role !== 'admin' && proposal.userId !== user.id) notFound();

  const { snapshot } = proposal;
  const { totals, dre } = snapshot;
  const isStale = proposal.pricingModelVersion !== PRICING_MODEL_VERSION;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/painel"
        className="mb-6 inline-flex items-center gap-2 text-base font-medium text-neutral-gray hover:text-primary-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar às propostas
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-primary-navy">
              {proposal.razaoSocial}
            </h1>
            <StatusBadge status={proposal.status as ProposalStatus} />
          </div>
          <p className="text-lg text-neutral-gray">
            {formatCnpj(proposal.cnpj)} ·{' '}
            {CLIENT_TYPE_LABELS[proposal.clientType] ?? proposal.clientType}
          </p>
        </div>
        <DownloadProposalButton payload={snapshot} />
      </div>

      {isStale && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-base">
            Esta proposta foi salva no modelo de preços <strong>{proposal.pricingModelVersion}</strong>{' '}
            (atual: {PRICING_MODEL_VERSION}). Os valores abaixo e o PDF refletem o snapshot da época.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resumo financeiro (do snapshot) */}
        <section className="rounded-3xl border border-accent-light bg-white p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-primary-navy">
            Resumo financeiro
          </h2>
          <InfoRow label="Total ao paciente" value={formatCurrency(totals.totalContractValue)} />
          <InfoRow label="Repasse à Prontta" value={formatCurrency(totals.repasse)} />
          <InfoRow label="Implantação" value={implantationLabel(totals.implantation)} />
          <InfoRow label="Software/mês" value={formatCurrency(totals.softwareMonthlyFee)} />
        </section>

        {/* DRE (do snapshot) */}
        <section className="rounded-3xl border border-accent-light bg-white p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-primary-navy">
            Resultado (DRE)
          </h2>
          <InfoRow label="Receita bruta" value={formatCurrency(dre.receitaBruta)} />
          <InfoRow label="Repasse" value={formatCurrency(dre.repasse)} />
          <InfoRow label="Margem bruta" value={formatCurrency(dre.margemBruta)} />
          <InfoRow label="Impostos + despesas + software" value={formatCurrency(dre.totalDespesas)} />
          <InfoRow
            label="Resultado líquido/mês"
            value={
              <span className="text-primary-cyan">
                {formatCurrency(dre.resultadoLiquido)} ({dre.margemLiquidaPct.toFixed(1)}%)
              </span>
            }
          />
        </section>

        {/* Dados do lead */}
        <section className="rounded-3xl border border-accent-light bg-white p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-primary-navy">Empresa (lead)</h2>
          <InfoRow label="Razão social" value={proposal.razaoSocial} />
          <InfoRow label="CNPJ" value={formatCnpj(proposal.cnpj)} />
          <InfoRow label="Contato" value={proposal.contatoNome || '—'} />
          <InfoRow label="E-mail" value={proposal.contatoEmail || '—'} />
          <InfoRow label="Telefone" value={proposal.contatoTelefone || '—'} />
          {proposal.observacoes && (
            <div className="pt-3 text-sm text-neutral-gray">
              <span className="mb-1 block font-medium text-primary-navy">Observações</span>
              {proposal.observacoes}
            </div>
          )}
        </section>

        {/* Gestão */}
        <section className="rounded-3xl border border-accent-light bg-white p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-primary-navy">Gestão</h2>
          <div className="mb-5">
            <StatusEditor id={proposal.id} initialStatus={proposal.status as ProposalStatus} />
          </div>
          <InfoRow label="Consultor" value={proposal.ownerName} />
          <InfoRow label="Criada em" value={formatDate(proposal.createdAt)} />
          <InfoRow label="Modelo de preços" value={proposal.pricingModelVersion} />
        </section>
      </div>
    </div>
  );
}
