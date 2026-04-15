import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import AnimatedIcon from '@/components/AnimatedIcon';
import { CheckCircle2, CalendarDays } from 'lucide-react';
import { apiFetch } from '@/hooks/useApi';

export default function Booking() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    service_id: '',
    scheduled_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<any[]>('/api/services', 'GET', undefined, false);
        const activeServices = (data || [])
  .filter((s: any) => s.is_active)
  .map((s: any) => ({ ...s, price: Number(s.price) })); // ← normalize here
        setServices(activeServices);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch services';
        toast({ variant: 'destructive', title: 'Error', description: message });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.service_id) e.service_id = 'Select a service';
    if (!form.scheduled_date) e.scheduled_date = 'Scheduled date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const selectedService = services.find((s) => s.id === parseInt(form.service_id));
      if (!selectedService) {
        throw new Error('Service not found');
      }

    const orderData = {
  customer_id: user?.id || null,
  service_id: selectedService.id,
  service_name: selectedService.name,
  price: Number(selectedService.price),           // ← coerce
  scheduled_date: form.scheduled_date,
  notes: form.notes,
  total_amount: Number(selectedService.price),    // ← coerce
};

      const result = await apiFetch('/api/orders', 'POST', orderData);
      
      setOrderId(result?.id || 'N/A');
      setShowSuccess(true);
      toast({ title: 'Booking confirmed!', description: `Order has been placed successfully.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create order';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <PageTransition>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <AnimatedIcon animation="float" hoverAnimation="scale" className="mx-auto mb-3 text-primary">
              <CalendarDays className="size-10" />
            </AnimatedIcon>
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground">
              Book a <span className="gradient-text">Pickup</span>
            </h1>
            <p className="mt-3 text-muted-foreground">Fill out the form below and we will schedule your laundry pickup.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border bg-white p-10 text-center shadow-lg"
              >
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                  <AnimatedIcon animation="bounce" hoverAnimation="scale" className="text-emerald-600">
                    <CheckCircle2 className="size-8" />
                  </AnimatedIcon>
                </div>
                <h2 className="mb-2 font-[Outfit] text-2xl font-bold">Booking Confirmed!</h2>
                <p className="mb-1 text-muted-foreground">Your order has been placed successfully.</p>
                <p className="mb-6 text-lg font-semibold text-primary">Order ID: #{orderId}</p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => navigate('/my-orders')}>View My Orders</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSuccess(false);
                      setForm({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        email: user?.email || '',
                        address: user?.address || '',
                        service_id: '',
                        scheduled_date: '',
                        notes: '',
                      });
                    }}
                  >
                    Book Another
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
              >
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
                      <p className="text-sm text-muted-foreground">Loading services...</p>
                    </div>
                  </div>
                )}

                {!loading && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="service_id">Service Type</Label>
                        <Select value={form.service_id} onValueChange={(v) => update('service_id', v)}>
                          <SelectTrigger className={errors.service_id ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name} — ${Number(s.price).toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.service_id && <p className="mt-1 text-xs text-destructive">{errors.service_id}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Pickup Address</Label>
                      <Input
                        id="address"
                        placeholder="142 Oak Avenue, San Francisco"
                        value={form.address}
                        onChange={(e) => update('address', e.target.value)}
                        className={errors.address ? 'border-destructive' : ''}
                      />
                      {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                    </div>

                    <div>
                      <Label htmlFor="scheduled_date">Scheduled Date</Label>
                      <Input
                        id="scheduled_date"
                        type="date"
                        value={form.scheduled_date}
                        onChange={(e) => update('scheduled_date', e.target.value)}
                        className={errors.scheduled_date ? 'border-destructive' : ''}
                      />
                      {errors.scheduled_date && <p className="mt-1 text-xs text-destructive">{errors.scheduled_date}</p>}
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special care instructions for your garments..."
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full rounded-xl text-base font-semibold" disabled={submitting}>
                      {submitting ? 'Creating Order...' : 'Confirm Booking'}
                    </Button>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
