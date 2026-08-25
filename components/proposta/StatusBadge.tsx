import { cn } from '@/lib/utils';
import { STATUS_LABELS, type ProposalStatus } from '@/lib/proposals/schemas';

const STYLES: Record<ProposalStatus, string> = {
  lead: 'bg-primary-cyan/10 text-primary-cyan',
  em_andamento: 'bg-amber-100 text-amber-700',
  fechado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-600',
};

/** Pill de status — componente puro (usável em Server Components). */
export function StatusBadge({
  status,
  className,
}: {
  status: ProposalStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium',
        STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
