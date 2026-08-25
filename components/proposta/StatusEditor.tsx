'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Input';
import { changeProposalStatus } from '@/app/proposta/actions';
import { PROPOSAL_STATUSES, STATUS_LABELS, type ProposalStatus } from '@/lib/proposals/schemas';

const statusOptions = PROPOSAL_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

export function StatusEditor({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: ProposalStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProposalStatus>(initialStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onChange(next: ProposalStatus) {
    const previous = status;
    setStatus(next);
    setError(null);
    setSaved(false);
    setPending(true);

    const result = await changeProposalStatus({ id, status: next });
    setPending(false);

    if (!result.ok) {
      setStatus(previous);
      setError(result.error ?? 'Não foi possível atualizar.');
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        label="Status"
        value={status}
        onChange={(e) => onChange(e.target.value as ProposalStatus)}
        options={statusOptions}
        disabled={pending}
      />
      {pending && <p className="mt-1 text-sm text-neutral-gray">Salvando…</p>}
      {saved && !pending && <p className="mt-1 text-sm text-green-600">Status atualizado.</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
