import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import StatsCard from '@/components/features/StatsCard';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
}

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  color,
  prefix = '',
  suffix = '',
  trend,
  trendLabel = 'from last month',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-[Outfit] text-2xl font-bold text-foreground">
            {prefix}
            <StatsCard end={value} prefix="" />
            {suffix}
          </p>
        </div>
        <div className={`flex size-11 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="size-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
          <TrendingUp className="size-3" /> +{trend}% {trendLabel}
        </div>
      )}
    </motion.div>
  );
}
