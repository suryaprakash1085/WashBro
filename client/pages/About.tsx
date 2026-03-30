import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MOCK_TEAM } from '@/constants/mockData';
import { Target, Eye, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedIcon from '@/components/AnimatedIcon';
import aboutImg from '@/assets/about-process.jpg';
import vanImg from '@/assets/delivery-van.jpg';

const timeline = [
  { year: '2018', title: 'Founded', text: 'FreshPress launched from a single laundromat in downtown San Francisco.' },
  { year: '2019', title: 'Expansion', text: 'Opened 3 new locations and introduced our pickup & delivery service.' },
  { year: '2021', title: '10K Customers', text: 'Reached 10,000 active customers and launched our mobile booking platform.' },
  { year: '2023', title: 'Award Winning', text: 'Named Best Laundry Service in the Bay Area by SF Weekly Magazine.' },
  { year: '2025', title: 'Going Green', text: 'Transitioned to 100% eco-friendly detergents and carbon-neutral delivery.' },
];

const values = [
  { icon: Target, title: 'Our Mission', text: 'To make laundry day the easiest part of your week by delivering premium cleaning services right to your doorstep.' },
  { icon: Eye, title: 'Our Vision', text: 'A world where nobody wastes their precious time on laundry — we handle it so you can focus on what matters.' },
  { icon: Heart, title: 'Our Values', text: 'Quality, convenience, sustainability. Every garment treated with the same care you would give it yourself.' },
];

export default function About() {
  const ref1 = useScrollReveal<HTMLDivElement>();
  const ref2 = useScrollReveal<HTMLDivElement>();
  const ref3 = useScrollReveal<HTMLDivElement>();
  const ref4 = useScrollReveal<HTMLDivElement>();

  return (
    <PageTransition>
      <section className="hero-gradient py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">About FreshPress</p>
            <h1 className="font-[Outfit] text-4xl font-bold text-foreground sm:text-5xl">
              Redefining the Way You Do <span className="gradient-text">Laundry</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Since 2018, we have been dedicated to making laundry effortless for busy people across the Bay Area.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28" ref={ref1}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5" data-reveal>
            <img src={aboutImg} alt="Our laundry process" className="rounded-2xl shadow-lg" />
          </div>
          <div className="space-y-6 lg:col-span-7" data-reveal>
            <h2 className="font-[Outfit] text-3xl font-bold text-foreground">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              FreshPress was born when our founder, Catherine Moore, realized that the average person spends over 5 hours per week doing laundry. She knew there had to be a better way. What started as a single drop-off location has grown into a full-service laundry platform serving thousands of customers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we combine state-of-the-art equipment with eco-friendly practices and the convenience of doorstep pickup and delivery. Our team of laundry professionals treats every garment with care, ensuring you always look and feel your best.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/50 py-20 lg:py-28" ref={ref2}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={i} data-reveal className={`stagger-${i + 1} rounded-2xl border bg-white p-8 transition-all hover:shadow-md`}>
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AnimatedIcon animation="bounce" hoverAnimation="spin">
                    <v.icon className="size-6" />
                  </AnimatedIcon>
                </div>
                <h3 className="mb-2 font-[Outfit] text-xl font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28" ref={ref3}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center" data-reveal>
            <h2 className="font-[Outfit] text-3xl font-bold text-foreground">Our Journey</h2>
          </div>
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute left-5 top-0 h-full w-px bg-primary/20 md:left-1/2" />
            {timeline.map((item, i) => (
              <div key={i} data-reveal className={`stagger-${i + 1} relative mb-10 flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`hidden flex-1 md:block ${i % 2 === 0 ? 'pr-10 text-right' : 'pl-10 text-left'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.year}</span>
                  <h4 className="font-[Outfit] text-lg font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
                <div className="absolute left-5 flex size-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-primary md:static md:translate-x-0 md:mx-0 md:mt-1.5">
                  <div className="size-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                </div>
                <div className="ml-8 flex-1 md:hidden">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.year}</span>
                  <h4 className="font-[Outfit] text-lg font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/50 py-20 lg:py-28" ref={ref4}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center" data-reveal>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Our Team</p>
            <h2 className="font-[Outfit] text-3xl font-bold">Meet the People Behind FreshPress</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_TEAM.map((member, i) => (
              <div key={member.id} data-reveal className={`stagger-${i + 1} group overflow-hidden rounded-2xl border bg-white text-center transition-all hover:shadow-md`}>
                <div className="overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h4 className="font-[Outfit] text-base font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
