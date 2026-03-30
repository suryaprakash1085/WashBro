import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CalendarCheck, Truck, WashingMachine, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from '@/components/AnimatedIcon';

const steps = [
  { icon: CalendarCheck, title: 'Schedule Pickup', description: 'Book online and choose a convenient time for us to collect your laundry.' },
  { icon: Truck, title: 'We Pick Up', description: 'Our driver arrives at your door. Just hand over the bag and relax.' },
  { icon: WashingMachine, title: 'Expert Cleaning', description: 'Your clothes are washed, dried, and pressed by laundry professionals.' },
  { icon: PackageCheck, title: 'Delivered Fresh', description: 'Clean, folded, and delivered back to your doorstep — good as new.' },
];

export default function HowItWorks() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
        <div className="mb-14 text-center" data-reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">How It Works</p>
          <h2 className="font-[Outfit] text-3xl font-bold text-foreground sm:text-4xl">
            Laundry Made Effortless
          </h2>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              data-reveal
              className={`stagger-${i + 1} relative text-center cursor-pointer`}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="relative mx-auto mb-5 flex size-24 items-center justify-center rounded-full bg-white shadow-lg shadow-primary/5"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <AnimatedIcon animation="bounce" hoverAnimation="spin">
                    <step.icon className="size-7" />
                  </AnimatedIcon>
                </motion.div>
                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="mb-2 font-[Outfit] text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
