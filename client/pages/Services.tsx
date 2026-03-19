import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/stores/serviceStore';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap };

export default function Services() {
  const services = useServiceStore((s) => s.services);
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.filter(s => s.active).map((svc, i) => {
              const Icon = iconMap[svc.icon] || Sparkles;
              return (
                <div
                  key={svc.id}
                  data-reveal
                  className={`stagger-${(i % 6) + 1} group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5`}
                >
                  <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <Icon className="size-7" />
                  </div>
                  <span className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{svc.category}</span>
                  <h3 className="mb-2 font-[Outfit] text-xl font-semibold text-foreground">{svc.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-xl font-bold text-primary">{formatCurrency(svc.price)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate('/booking')}
                      className="rounded-full px-5"
                    >
                      Book <ArrowRight className="ml-1 size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
