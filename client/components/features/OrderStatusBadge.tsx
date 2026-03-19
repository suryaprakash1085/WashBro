import { cn, getStatusColor } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface Props {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all',
        getStatusColor(status),
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}
