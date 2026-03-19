import { useState } from 'react';
import { MOCK_USERS } from '@/constants/mockData';
import { useOrderStore } from '@/stores/orderStore';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminCustomers() {
  const orders = useOrderStore((s) => s.orders);
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const customers = MOCK_USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOrders = selected ? orders.filter(o => o.userId === selected || o.userEmail === MOCK_USERS.find(u => u.id === selected)?.email) : [];

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b last:border-0 transition-colors cursor-pointer ${selected === u.id ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setSelected(u.id)}
                  >
                    <td className="flex items-center gap-3 px-4 py-3">
                      <img src={u.avatar} alt="" className="size-8 rounded-full object-cover" />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(u.joinedDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); setSelected(u.id); }}>
                        <Eye className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); toast({ title: 'Customer removed' }); }}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5">
          {selected ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border bg-white p-5 shadow-sm">
              {(() => {
                const u = MOCK_USERS.find(c => c.id === selected);
                if (!u) return null;
                return (
                  <>
                    <div className="mb-5 flex items-center gap-4">
                      <img src={u.avatar} alt="" className="size-14 rounded-full object-cover" />
                      <div>
                        <h3 className="font-[Outfit] text-lg font-bold">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{u.phone}</p></div>
                      <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Orders</p><p className="font-medium">{selectedOrders.length}</p></div>
                    </div>
                    <h4 className="mb-2 text-sm font-semibold">Order History</h4>
                    {selectedOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No orders found.</p>
                    ) : (
                      <div className="max-h-64 space-y-2 overflow-y-auto">
                        {selectedOrders.slice(0, 10).map(o => (
                          <div key={o.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <div>
                              <p className="font-mono text-xs font-semibold text-primary">{o.id}</p>
                              <p className="text-xs text-muted-foreground">{o.service}</p>
                            </div>
                            <span className="text-xs font-medium">{o.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border bg-white text-sm text-muted-foreground">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
