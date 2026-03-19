import { useState } from 'react';
import { useServiceStore } from '@/stores/serviceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap };
const iconNames = Object.keys(iconMap);

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useServiceStore();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', icon: 'Sparkles', category: '', active: true });

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', price: '', icon: 'Sparkles', category: '', active: true }); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ title: s.title, description: s.description, price: s.price.toString(), icon: s.icon, category: s.category, active: s.active }); setShowModal(true); };

  const handleSave = () => {
    if (!form.title || !form.price) { toast({ variant: 'destructive', title: 'Fill required fields' }); return; }
    if (editing) {
      updateService(editing.id, { ...form, price: parseFloat(form.price) });
      toast({ title: 'Service updated' });
    } else {
      addService({ id: `s_${Date.now()}`, ...form, price: parseFloat(form.price) });
      toast({ title: 'Service added' });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">Manage Services</h2>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="size-4" /> Add Service</Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((svc, i) => {
          const Icon = iconMap[svc.icon] || Sparkles;
          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(svc)}><Edit2 className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => { deleteService(svc.id); toast({ title: 'Service deleted' }); }}><Trash2 className="size-3.5" /></Button>
                </div>
              </div>
              <h3 className="mb-1 font-[Outfit] text-base font-semibold">{svc.title}</h3>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{svc.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{formatCurrency(svc.price)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${svc.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {svc.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" aria-label="Close"><X className="size-5" /></button>
              <h2 className="mb-5 font-[Outfit] text-xl font-bold">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><Label>Price ($)</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Icon</Label>
                    <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{iconNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={handleSave}>{editing ? 'Update' : 'Add Service'}</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
