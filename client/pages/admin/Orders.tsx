import { useState, useEffect } from 'react';
import OrderStatusBadge from '@/components/features/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/hooks/useApi';
import type { Order } from '@/types';

const ORDER_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const res = await apiFetch<any>('/api/orders', 'GET', undefined, false);
    const orders = res?.data || res || [];  // handle both wrapped and unwrapped
    setOrders(
      orders.map((o: any) => ({
        ...o,
        total_amount: Number(o.total_amount),
        price: Number(o.price),
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    toast({ variant: 'destructive', title: 'Error', description: message });
  } finally {
    setLoading(false);
  }
};

  const filtered = orders
    .filter((o) => filterStatus === 'all' || o.status === filterStatus)
    .filter(
      (o) =>
        !search ||
        o.id.toString().includes(search) ||
        (o.customer_id?.toString().includes(search) ?? false) ||
        (o.service_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiFetch(`/api/orders/${id}/status`, 'PUT', { status });
      toast({ title: 'Status updated', description: `Order #${id} is now "${status}".` });
      await fetchOrders();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await apiFetch(`/api/orders/${id}`, 'DELETE');
      toast({ variant: 'destructive', title: 'Order deleted' });
      await fetchOrders();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete order';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => {
            setFilterStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">#{order.id}</td>
                  <td className="px-4 py-3">{order.service_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.scheduled_date ? formatDate(order.scheduled_date) : 'Not set'}
                  </td>
                  <td className="px-4 py-3">
                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                      <SelectTrigger className="h-8 w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  {/* <td className="px-4 py-3 text-right font-semibold">${order.total_amount?.toFixed(2) || order.price?.toFixed(2) || '0.00'}</td> */}
                 
                 
                 <td className="px-4 py-3 text-right font-semibold">
  ${Number(order.total_amount || order.price || 0).toFixed(2)}
</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
                      className="size-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No orders found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
