import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-laundry.jpg';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="space-y-6 lg:col-span-6 xl:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3" /> Trusted by 10,000+ Customers
            </div>
            <h1 className="font-[Outfit] text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Quality Laundry{' '}
              <span className="gradient-text">Service Delivered</span>{' '}
              to Your Doorstep
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            From wash & fold to dry cleaning — we pick up, clean, and deliver your clothes with meticulous care. Save time for what truly matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate('/booking')}
              className="group rounded-full px-7 text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
            >
              Book Now
              <ArrowRight className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/services')}
              className="rounded-full px-7 text-base font-semibold"
            >
              View Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex -space-x-2">
              {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80', 'photo-1500648767791-00dcc994a43e'].map((id, i) => (
                <img key={i} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop`} alt="" className="size-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                4.9 <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="text-xs text-muted-foreground">2,400+ happy reviews</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative lg:col-span-6 xl:col-span-7"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
            <img
              src={heroImg}
              alt="Premium laundry service"
              className="aspect-[4/3] w-full object-cover lg:aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-card absolute -bottom-4 -left-4 rounded-2xl p-4 shadow-xl sm:-left-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Free Pickup</p>
                <p className="text-xs text-muted-foreground">At your doorstep</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass-card absolute -right-4 -top-4 rounded-2xl p-4 shadow-xl sm:-right-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-base font-bold">24h</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Next day return</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
