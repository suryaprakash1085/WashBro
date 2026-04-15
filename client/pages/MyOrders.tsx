import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import OrderStatusBadge from '@/components/features/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import emptyImg from '@/assets/empty-orders.jpg';

export default function MyOrders() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          setOrders([]);
          return;
        }

        // Fetch orders for the current user
        const data = await apiFetch<any[]>(`/api/orders/customer/${user.id}`, 'GET', undefined, true);
        setOrders(data || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch orders';
        toast({ variant: 'destructive', title: 'Error', description: message });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, toast]);

  const filteredOrders = orders.filter(
    (o) => !search || o.id.toString().includes(search) || (o.service_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  if (!user?.id) {
    return (
      <>
        <section className="hero-gradient py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
              <Package className="mx-auto mb-3 size-10 text-primary" />
              <h1 className="font-[Outfit] text-4xl font-bold text-foreground">
                My <span className="gradient-text">Orders</span>
              </h1>
              <p className="mt-3 text-muted-foreground">Please log in to view your orders.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-white p-12 text-center">
              <Button onClick={() => navigate('/login')} className="rounded-full px-6">
                Sign In to View Orders
              </Button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <section className="hero-gradient py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
              <Package className="mx-auto mb-3 size-10 text-primary" />
              <h1 className="font-[Outfit] text-4xl font-bold text-foreground">
                My <span className="gradient-text">Orders</span>
              </h1>
              <p className="mt-3 text-muted-foreground">Track and manage all your laundry orders in one place.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <p className="text-sm text-muted-foreground">Loading your orders...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <Package className="mx-auto mb-3 size-10 text-primary" />
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground">
              My <span className="gradient-text">Orders</span>
            </h1>
            <p className="mt-3 text-muted-foreground">Track and manage all your laundry orders in one place.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-white p-12 text-center">
              <img src={emptyImg} alt="No orders" className="mx-auto mb-6 size-40 rounded-2xl object-cover opacity-80" />
              <h3 className="mb-2 font-[Outfit] text-xl font-semibold">No Orders Yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">Looks like you haven't placed any orders. Let's get your clothes fresh!</p>
              <Button onClick={() => navigate('/booking')} className="rounded-full px-6">
                Book Your First Pickup
              </Button>
            </motion.div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50/80">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Service</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Scheduled</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b last:border-0 transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">#{order.id}</td>
                        <td className="px-4 py-3.5 font-medium">{order.service_name || 'N/A'}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {order.scheduled_date ? formatDate(order.scheduled_date) : 'Not set'}
                        </td>
                        <td className="px-4 py-3.5">
                          <OrderStatusBadge status={order.status || 'pending'} />
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold">${order.total_amount?.toFixed(2) || order.price?.toFixed(2) || '0.00'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
