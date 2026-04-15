import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, DollarSign, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatsCard from '@/components/features/StatsCard';
import { apiFetch } from '@/hooks/useApi';
import type { User, Order } from '@/types';

interface Stats {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prefix: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<{ month: string; revenue: number; orders: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, usersData] = await Promise.all([
          apiFetch<Order[]>('/api/orders'),
          apiFetch<User[]>('/api/users'),
        ]);

        setOrders(ordersData || []);
        setUsers(usersData || []);

        // Generate monthly data from orders
        if (ordersData && ordersData.length > 0) {
          const monthlyMap: Record<string, { revenue: number; count: number }> = {};
          ordersData.forEach((order: any) => {
            const date = new Date(order.created_at || new Date());
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthlyMap[month]) {
              monthlyMap[month] = { revenue: 0, count: 0 };
            }
            monthlyMap[month].revenue += order.total_amount || order.price || 0;
            monthlyMap[month].count += 1;
          });

          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const data = months.map((month) => ({
            month,
            revenue: monthlyMap[month]?.revenue || 0,
            orders: monthlyMap[month]?.count || 0,
          }));
          setMonthlyData(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(message);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalOrders = orders.length;
  const pending = orders.filter((o: any) => o.status === 'pending' || o.status === 'Pending').length;
  const delivered = orders.filter((o: any) => o.status === 'completed' || o.status === 'Delivered').length;
  const revenue = orders.reduce((sum, o: any) => sum + (o.total_amount || o.price || 0), 0);

  const stats: Stats[] = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-blue-100 text-blue-600', prefix: '' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-amber-100 text-amber-600', prefix: '' },
    { label: 'Delivered', value: delivered, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600', prefix: '' },
    { label: 'Revenue', value: Math.round(revenue), icon: DollarSign, color: 'bg-purple-100 text-purple-600', prefix: '$' },
  ];

  const chartData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jan', revenue: 0, orders: 0 },
    { month: 'Feb', revenue: 0, orders: 0 },
    { month: 'Mar', revenue: 0, orders: 0 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

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
              <TrendingUp className="size-3" /> Real-time data
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
            <AreaChart data={chartData}>
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
            <BarChart data={chartData}>
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
          <h3 className="flex items-center gap-2 font-[Outfit] text-base font-semibold">
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
                <th className="px-5 py-2.5 text-left font-semibold text-muted-foreground">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.filter((u: any) => u.role === 'customer').slice(0, 5).map((u: any) => (
                <tr key={u.id} className="border-b last:border-0 transition-colors hover:bg-slate-50/50">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium">{u.name || 'N/A'}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email || 'N/A'}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.phone || 'N/A'}</td>
                  <td className="px-5 py-3">
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {u.role || 'customer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
