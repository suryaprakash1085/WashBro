import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, CalendarDays, Edit2, Save } from 'lucide-react';
import OrderStatusBadge from '@/components/features/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Navigate } from 'react-router-dom';

export default function MyProfile() {
  const { user, updateProfile, isAuthenticated } = useAuthStore();
  const orders = useOrderStore((s) => s.orders);
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const userOrders = orders.filter(o => o.userId === user.id || o.userEmail === user.email).slice(0, 5);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast({ title: 'Profile updated', description: 'Your information has been saved.' });
  };

  return (
    <>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center font-[Outfit] text-4xl font-bold">
            My <span className="gradient-text">Profile</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-7" />
                </div>
                <div>
                  <h2 className="font-[Outfit] text-lg font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" /> {user.phone || 'Not set'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> {user.address || 'Not set'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" /> Joined {formatDate(user.joinedDate)}</div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-[Outfit] text-lg font-semibold">Edit Profile</h3>
                <Button variant={editing ? 'default' : 'outline'} size="sm" onClick={() => editing ? handleSave() : setEditing(true)}>
                  {editing ? <><Save className="mr-1.5 size-3.5" /> Save</> : <><Edit2 className="mr-1.5 size-3.5" /> Edit</>}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!editing} /></div>
                <div><Label>Email</Label><Input value={user.email} disabled className="bg-muted/50" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!editing} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} disabled={!editing} /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="border-b px-6 py-4">
                <h3 className="font-[Outfit] text-lg font-semibold">Recent Orders</h3>
              </div>
              {userOrders.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-slate-50/80">
                      <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Order</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Service</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Price</th>
                    </tr></thead>
                    <tbody>
                      {userOrders.map(o => (
                        <tr key={o.id} className="border-b last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{o.id}</td>
                          <td className="px-4 py-3">{o.service}</td>
                          <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(o.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
