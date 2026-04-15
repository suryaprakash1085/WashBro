import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { apiFetch } from '@/hooks/useApi';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap };
const iconNames = Object.keys(iconMap);

export default function AdminServices() {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<any[]>('/api/services', 'GET', undefined, false);
      setServices(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch services';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category: '', is_active: true });
    setShowModal(true);
  };

  const openEdit = (service: any) => {
    setEditing(service);
    setForm({
      name: service.name || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      category: service.category || '',
      is_active: service.is_active !== false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ variant: 'destructive', title: 'Fill required fields' });
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        is_active: form.is_active,
      };

      if (editing) {
        await apiFetch(`/api/services/${editing.id}`, 'PUT', body);
        toast({ title: 'Service updated successfully' });
      } else {
        await apiFetch('/api/services', 'POST', body);
        toast({ title: 'Service added successfully' });
      }

      setShowModal(false);
      await fetchServices();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save service';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await apiFetch(`/api/services/${id}`, 'DELETE');
      toast({ title: 'Service deleted successfully' });
      await fetchServices();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete service';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">Manage Services</h2>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" /> Add Service
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon] || Sparkles;
          return (
            <motion.div
              key={service.id}
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
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(service)}>
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <h3 className="mb-1 font-[Outfit] text-base font-semibold">{service.name}</h3>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">${service.price.toFixed(2)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${service.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
          <p>No services yet. Click "Add Service" to create one.</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="size-5" />
              </button>
              <h2 className="mb-5 font-[Outfit] text-xl font-bold">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Service Name</Label>
                    <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Wash & Fold" />
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe this service..." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Category</Label>
                    <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g., Laundry" />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={form.is_active ? 'active' : 'inactive'} onValueChange={(v) => setForm((f) => ({ ...f, is_active: v === 'active' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
