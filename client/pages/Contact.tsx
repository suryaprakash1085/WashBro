import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMessageStore } from '@/stores/messageStore';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { APP_CONFIG } from '@/constants/config';
import AnimatedIcon from '@/components/AnimatedIcon';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  const addMessage = useMessageStore((s) => s.addMessage);
  const { toast } = useToast();
  const ref = useScrollReveal<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addMessage({ id: `m_${Date.now()}`, ...form, replied: false, createdAt: new Date().toISOString() });
    toast({ title: 'Message sent!', description: 'We will get back to you soon.' });
    setForm({ name: '', email: '', phone: '', message: '' });
    setSent(true);
  };

  const update = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const info = [
    { icon: MapPin, label: 'Address', value: APP_CONFIG.address },
    { icon: Phone, label: 'Phone', value: APP_CONFIG.phone },
    { icon: Mail, label: 'Email', value: APP_CONFIG.email },
    { icon: Clock, label: 'Hours', value: APP_CONFIG.hours },
  ];

  return (
    <PageTransition>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground sm:text-5xl">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">We would love to hear from you. Send us a message or visit our location.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6" data-reveal>
              <div>
                <h2 className="mb-4 font-[Outfit] text-2xl font-bold">Contact Information</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Have a question or need help? Reach out to us through any of the channels below.</p>
              </div>
              <div className="space-y-4">
                {info.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-xl border bg-white p-4 transition-all hover:shadow-sm">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <AnimatedIcon animation="bounce" hoverAnimation="spin">
                        <item.icon className="size-5" />
                      </AnimatedIcon>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0196!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="FreshPress Location"
                />
              </div>
            </div>

            <div className="lg:col-span-7" data-reveal>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center shadow-sm">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <AnimatedIcon animation="bounce" hoverAnimation="scale" className="text-emerald-600">
                      <Send className="size-7" />
                    </AnimatedIcon>
                  </div>
                  <h3 className="mb-2 font-[Outfit] text-xl font-bold">Message Sent!</h3>
                  <p className="mb-6 text-muted-foreground">Thank you for reaching out. We'll respond within 24 hours.</p>
                  <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="font-[Outfit] text-xl font-bold">Send Us a Message</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="c-name">Name</Label>
                      <Input id="c-name" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} className={errors.name ? 'border-destructive' : ''} />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="c-email">Email</Label>
                      <Input id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="c-phone">Phone (Optional)</Label>
                    <Input id="c-phone" placeholder="(555) 123-4567" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="c-msg">Message</Label>
                    <Textarea id="c-msg" placeholder="Tell us how we can help..." value={form.message} onChange={e => update('message', e.target.value)} rows={5} className={errors.message ? 'border-destructive' : ''} />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-xl text-base font-semibold">
                    <AnimatedIcon animation="none" hoverAnimation="bounce" className="mr-2"><Send className="size-4" /></AnimatedIcon> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
