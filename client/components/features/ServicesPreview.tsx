import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '@/stores/serviceStore';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import AnimatedIcon from '@/components/AnimatedIcon';

const iconMap: Record<string, React.ElementType> = { WashingMachine, Flame, Sparkles, Wind, Footprints, Bed, Droplets, Zap };

export default function ServicesPreview() {
  const services = useServiceStore((s) => s.services).slice(0, 4);
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
        <div className="mb-12 text-center" data-reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Our Services</p>
          <h2 className="font-[Outfit] text-3xl font-bold text-foreground sm:text-4xl">
            Everything Your Wardrobe Needs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            From everyday essentials to special garments, we handle it all with precision and care.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => {
            const Icon = iconMap[svc.icon] || Sparkles;
            return (
              <motion.div
                key={svc.id}
                data-reveal
                className={`stagger-${i + 1} group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm cursor-pointer`}
                whileHover={{
                  y: -8,
                  boxShadow: '0 12px 24px rgba(20, 184, 166, 0.15)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <motion.div
                  className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedIcon animation="bounce" hoverAnimation="spin">
                    <Icon className="size-6" />
                  </AnimatedIcon>
                </motion.div>
                <h3 className="mb-1.5 font-[Outfit] text-lg font-semibold text-foreground">{svc.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{svc.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatCurrency(svc.price)}</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary"
                      onClick={() => navigate('/booking')}
                    >
                      Book <AnimatedIcon animation="none" hoverAnimation="bounce" className="ml-1"><ArrowRight className="size-3" /></AnimatedIcon>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center" data-reveal>
          <Button variant="outline" size="lg" onClick={() => navigate('/services')} className="rounded-full px-8">
            View All Services <AnimatedIcon animation="none" hoverAnimation="bounce" className="ml-2"><ArrowRight className="size-4" /></AnimatedIcon>
          </Button>
        </div>
      </div>
    </section>
  );
}
