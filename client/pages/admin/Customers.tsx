import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/hooks/useApi';
import type { User } from '@/types';

export default function AdminCustomers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData] = await Promise.all([
        apiFetch<any[]>('/api/users', 'GET', undefined, false),
        apiFetch<any[]>('/api/orders', 'GET', undefined, false),
      ]);

      // Filter only customer users
      const customerUsers = (usersData || []).filter((u: any) => u.role !== 'admin');
      setCustomers(customerUsers);
      setOrders(ordersData || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch data';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = selected ? customers.find((c) => c.id === selected) : null;
  const selectedOrders = selected ? orders.filter((o: any) => o.customer_id === selected) : [];

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await apiFetch(`/api/users/${id}`, 'DELETE');
      toast({ title: 'Customer deleted' });
      await fetchData();
      setSelected(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">City</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b last:border-0 cursor-pointer transition-colors ${selected === u.id ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setSelected(u.id)}
                  >
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{u.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{u.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.city || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(u.id);
                        }}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u.id);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No customers found</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          {selectedCustomer ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-[Outfit] text-base font-semibold">Customer Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Name</p>
                  <p className="mt-1">{selectedCustomer.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                  <p className="mt-1 break-all">{selectedCustomer.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Phone</p>
                  <p className="mt-1">{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Address</p>
                  <p className="mt-1">{selectedCustomer.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">City</p>
                  <p className="mt-1">{selectedCustomer.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Zipcode</p>
                  <p className="mt-1">{selectedCustomer.zipcode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Status</p>
                  <p className="mt-1">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${selectedCustomer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedCustomer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              {selectedOrders.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="mb-3 font-[Outfit] text-sm font-semibold">Recent Orders ({selectedOrders.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="rounded-lg bg-slate-50 p-3 text-xs">
                        <p className="font-semibold text-primary">#{order.id}</p>
                        <p className="text-muted-foreground">{order.service_name}</p>
                        <p className="text-muted-foreground">${order.total_amount?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="rounded-2xl border bg-white p-5 shadow-sm text-center text-muted-foreground">
              <p>Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
