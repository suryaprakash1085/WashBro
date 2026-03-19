import { useState } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import OrderStatusBadge from '@/components/features/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import emptyImg from '@/assets/empty-orders.jpg';

export default function MyOrders() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const userOrders = orders
    .filter(o => o.userId === user?.id || o.userEmail === user?.email)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.service.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <Package className="mx-auto mb-3 size-10 text-primary" />
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground">My <span className="gradient-text">Orders</span></h1>
            <p className="mt-3 text-muted-foreground">Track and manage all your laundry orders in one place.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by Order ID or service..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>

          {userOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-white p-12 text-center">
              <img src={emptyImg} alt="No orders" className="mx-auto mb-6 size-40 rounded-2xl object-cover opacity-80" />
              <h3 className="mb-2 font-[Outfit] text-xl font-semibold">No Orders Yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">Looks like you haven't placed any orders. Let's get your clothes fresh!</p>
              <Button onClick={() => navigate('/booking')} className="rounded-full px-6">Book Your First Pickup</Button>
            </motion.div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50/80">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Service</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pickup</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Delivery</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b last:border-0 transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">{order.id}</td>
                        <td className="px-4 py-3.5 font-medium">{order.service}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">{formatDate(order.pickupDate)}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">{formatDate(order.deliveryDate)}</td>
                        <td className="px-4 py-3.5"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-4 py-3.5 text-right font-semibold">{formatCurrency(order.price)}</td>
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
