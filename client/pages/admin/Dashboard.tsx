import { useOrderStore } from '@/stores/orderStore';
import { MOCK_USERS } from '@/constants/mockData';
import { MONTHLY_REVENUE } from '@/constants/mockData';
import StatsCard from '@/components/features/StatsCard';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, DollarSign, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const orders = useOrderStore((s) => s.orders);

  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const revenue = orders.reduce((sum, o) => sum + o.price, 0);

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-blue-100 text-blue-600', prefix: '' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-amber-100 text-amber-600', prefix: '' },
    { label: 'Delivered', value: delivered, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600', prefix: '' },
    { label: 'Revenue', value: Math.round(revenue), icon: DollarSign, color: 'bg-purple-100 text-purple-600', prefix: '$' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-[Outfit] text-2xl font-bold text-foreground">
                  <StatsCard end={s.value} prefix={s.prefix} />
                </p>
              </div>
              <div className={`flex size-11 items-center justify-center rounded-xl ${s.color} transition-transform group-hover:scale-110`}>
                <s.icon className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="size-3" /> +12% from last month
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-7"
        >
          <h3 className="mb-4 font-[Outfit] text-base font-semibold">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" strokeWidth={2.5} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-5"
        >
          <h3 className="mb-4 font-[Outfit] text-base font-semibold">Orders by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="orders" fill="hsl(24, 95%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border bg-white shadow-sm"
      >
        <div className="border-b px-5 py-4">
          <h3 className="font-[Outfit] text-base font-semibold flex items-center gap-2">
            <Users className="size-4 text-primary" /> Recent Customers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80">
                <th className="px-5 py-2.5 text-left font-semibold text-muted-foreground">Customer</th>
                <th className="px-5 py-2.5 text-left font-semibold text-muted-foreground">Email</th>
                <th className="px-5 py-2.5 text-left font-semibold text-muted-foreground">Phone</th>
                <th className="px-5 py-2.5 text-left font-semibold text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.slice(0, 5).map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <img src={u.avatar} alt="" className="size-8 rounded-full object-cover" />
                    <span className="font-medium">{u.name}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.phone}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
