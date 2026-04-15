import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedIcon from '@/components/AnimatedIcon';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, React.ElementType> = { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap };

export default function Services() {
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<any[]>('/api/services', 'GET', undefined, false);
        setServices((data || []).filter((s: any) => s.is_active));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch services';
        toast({ variant: 'destructive', title: 'Error', description: message });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  if (loading) {
    return (
      <PageTransition>
        <section className="hero-gradient py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">What We Offer</p>
              <h1 className="font-[Outfit] text-4xl font-bold text-foreground sm:text-5xl">
                Our <span className="gradient-text">Services</span>
              </h1>
            </motion.div>
          </div>
        </section>
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <p className="text-sm text-muted-foreground">Loading services...</p>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="hero-gradient py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">What We Offer</p>
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground sm:text-5xl">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional cleaning for every type of garment and fabric, delivered with care.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28" ref={ref}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] || Sparkles;
                return (
                  <div
                    key={service.id}
                    data-reveal
                    className={`stagger-${(i % 6) + 1} group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5`}
                  >
                    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                      <AnimatedIcon animation="bounce" hoverAnimation="spin">
                        <Icon className="size-7" />
                      </AnimatedIcon>
                    </div>
                    <span className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{service.category || 'Service'}</span>
                    <h3 className="mb-2 font-[Outfit] text-xl font-semibold text-foreground">{service.name}</h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting from</span>
                  <p className="text-xl font-bold text-primary">${Number(service.price)?.toFixed(2) ?? '—'}</p>   </div>
                      <Button
                        size="sm"
                        onClick={() => navigate('/booking')}
                        className="rounded-full px-5"
                      >
                        Book <AnimatedIcon animation="none" hoverAnimation="bounce" className="ml-1"><ArrowRight className="size-3.5" /></AnimatedIcon>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
              <p>No services available at this time</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
