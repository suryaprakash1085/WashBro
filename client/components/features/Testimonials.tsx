import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MOCK_TESTIMONIALS } from '@/constants/mockData';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
        <div className="mb-12 text-center" data-reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="font-[Outfit] text-3xl font-bold text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TESTIMONIALS.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id}
              data-reveal
              className={`stagger-${i + 1} relative rounded-2xl border bg-white p-6 cursor-pointer`}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Quote className="absolute right-5 top-5 size-8 text-primary/10" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`size-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="flex items-center gap-3">
                <motion.img
                  src={t.avatar}
                  alt={t.name}
                  className="size-10 rounded-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
