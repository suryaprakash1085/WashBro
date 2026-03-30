import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Shield, Clock, Leaf, Heart, Award, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from '@/components/AnimatedIcon';

const features = [
  { icon: Shield, title: 'Fabric Safe', description: 'We use gentle, premium detergents that are safe for all fabric types.' },
  { icon: Clock, title: '24h Turnaround', description: 'Get your clothes back within 24 hours with our standard service.' },
  { icon: Leaf, title: 'Eco-Friendly', description: 'Biodegradable detergents and energy-efficient machines for a greener clean.' },
  { icon: Heart, title: 'Handled with Care', description: 'Each garment is inspected, sorted, and treated individually.' },
  { icon: Award, title: 'Quality Guaranteed', description: 'Not satisfied? We re-clean for free. Your satisfaction is our promise.' },
  { icon: Headphones, title: '24/7 Support', description: 'Friendly customer support available anytime you need assistance.' },
];

export default function WhyChooseUs() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
        <div className="mb-12 text-center" data-reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Why Choose Us</p>
          <h2 className="font-[Outfit] text-3xl font-bold text-foreground sm:text-4xl">
            The FreshPress Difference
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              data-reveal
              className={`stagger-${i + 1} flex gap-4 rounded-2xl border bg-white p-6 cursor-pointer group`}
              whileHover={{
                boxShadow: '0 12px 24px rgba(20, 184, 166, 0.1)',
                y: -4,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <AnimatedIcon animation="bounce" hoverAnimation="spin">
                  <f.icon className="size-5" />
                </AnimatedIcon>
              </motion.div>
              <div>
                <h3 className="mb-1 font-[Outfit] text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
