import { motion } from 'framer-motion';
import { useOrderStore } from '@/stores/orderStore';
import { MONTHLY_REVENUE, SERVICE_USAGE } from '@/constants/mockData';
import StatsCard from '@/components/features/StatsCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { CalendarDays, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminReports() {
  const orders = useOrderStore((s) => s.orders);

  const dailyOrders = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    return { day: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), orders: 5 + Math.floor(Math.random() * 20) };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Orders (Year)', value: 2641, icon: CalendarDays, color: 'bg-blue-100 text-blue-600' },
          { label: 'Annual Revenue', value: 225200, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600', prefix: '$' },
          { label: 'Avg. Order Value', value: 85, icon: TrendingUp, color: 'bg-purple-100 text-purple-600', prefix: '$' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-[Outfit] text-2xl font-bold">
                  <StatsCard end={s.value} prefix={s.prefix || ''} />
                </p>
              </div>
              <div className={`flex size-11 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="size-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-8">
          <h3 className="mb-4 font-[Outfit] text-base font-semibold">Daily Orders (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="orders" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-4">
          <h3 className="mb-4 font-[Outfit] text-base font-semibold">Service Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={SERVICE_USAGE} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="count">
                {SERVICE_USAGE.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-[Outfit] text-base font-semibold">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={MONTHLY_REVENUE}>
            <defs>
              <linearGradient id="colorRevR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(160, 60%, 45%)" strokeWidth={2.5} fill="url(#colorRevR)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
