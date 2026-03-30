import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServiceStore } from '@/stores/serviceStore';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { generateOrderId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AnimatedIcon from '@/components/AnimatedIcon';
import { CheckCircle2, CalendarDays, ArrowLeft } from 'lucide-react';

export default function Booking() {
  const services = useServiceStore((s) => s.services);
  const addOrder = useOrderStore((s) => s.addOrder);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    service: '',
    pickupDate: '',
    deliveryDate: '',
    instructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.service) e.service = 'Select a service';
    if (!form.pickupDate) e.pickupDate = 'Pickup date is required';
    if (!form.deliveryDate) e.deliveryDate = 'Delivery date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const svc = services.find(s => s.id === form.service);
    const id = generateOrderId();
    addOrder({
      id,
      userId: user?.id || 'guest',
      userName: form.name,
      userPhone: form.phone,
      userEmail: form.email,
      address: form.address,
      service: svc?.title || '',
      pickupDate: form.pickupDate,
      deliveryDate: form.deliveryDate,
      status: 'Pending',
      price: svc?.price || 0,
      instructions: form.instructions,
      createdAt: new Date().toISOString(),
    });

    setOrderId(id);
    setShowSuccess(true);
    toast({ title: 'Booking confirmed!', description: `Order ${id} has been placed.` });
  };

  const update = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <PageTransition>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <AnimatedIcon animation="float" hoverAnimation="scale" className="mx-auto mb-3 text-primary">
              <CalendarDays className="size-10" />
            </AnimatedIcon>
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground">Book a <span className="gradient-text">Pickup</span></h1>
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
                <p className="mb-6 text-lg font-semibold text-primary">Order ID: {orderId}</p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => navigate('/my-orders')}>View My Orders</Button>
                  <Button variant="outline" onClick={() => { setShowSuccess(false); setForm({ name: '', phone: '', email: '', address: '', service: '', pickupDate: '', deliveryDate: '', instructions: '' }); }}>
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} className={errors.name ? 'border-destructive' : ''} />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="(555) 123-4567" value={form.phone} onChange={e => update('phone', e.target.value)} className={errors.phone ? 'border-destructive' : ''} />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={e => update('email', e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="service">Service Type</Label>
                    <Select value={form.service} onValueChange={v => update('service', v)}>
                      <SelectTrigger className={errors.service ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.filter(s => s.active).map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.title} — ${s.price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Pickup Address</Label>
                  <Input id="address" placeholder="142 Oak Avenue, San Francisco" value={form.address} onChange={e => update('address', e.target.value)} className={errors.address ? 'border-destructive' : ''} />
                  {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input id="pickupDate" type="date" value={form.pickupDate} onChange={e => update('pickupDate', e.target.value)} className={errors.pickupDate ? 'border-destructive' : ''} />
                    {errors.pickupDate && <p className="mt-1 text-xs text-destructive">{errors.pickupDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input id="deliveryDate" type="date" value={form.deliveryDate} onChange={e => update('deliveryDate', e.target.value)} className={errors.deliveryDate ? 'border-destructive' : ''} />
                    {errors.deliveryDate && <p className="mt-1 text-xs text-destructive">{errors.deliveryDate}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea id="instructions" placeholder="Any special care instructions for your garments..." value={form.instructions} onChange={e => update('instructions', e.target.value)} rows={3} />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-xl text-base font-semibold">
                  Confirm Booking
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
