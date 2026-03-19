import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  variant?: 'card' | 'table-row' | 'text' | 'circle';
  count?: number;
}

export default function SkeletonLoader({ className, variant = 'card', count = 1 }: Props) {
  const items = Array.from({ length: count });

  if (variant === 'table-row') {
    return (
      <div className={cn('space-y-3', className)}>
        {items.map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border p-4">
            <div className="skeleton size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl border p-6">
            <div className="skeleton mb-4 size-12 rounded-xl" />
            <div className="skeleton mb-2 h-5 w-2/3 rounded" />
            <div className="skeleton mb-4 h-3 w-full rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((_, i) => (
        <div key={i} className="skeleton h-4 w-full rounded" />
      ))}
    </div>
  );
}
