import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from '@/components/AnimatedIcon';
import heroImg from '@/assets/hero-laundry.jpg';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-background">
      
      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-12 lg:px-8">
        
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-6 space-y-6">

          {/* 🔥 BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur"
          >
            <AnimatedIcon animation="pulse">
              <Sparkles className="size-3" />
            </AnimatedIcon>
            #1 Laundry Service in Your City
          </motion.div>

          {/* 💥 HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Laundry Made{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Effortless
            </span>{' '}
            & Delivered Fast
          </motion.h1>

          {/* 📝 DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Schedule a pickup in seconds. We clean, fold, and deliver your clothes
            fresh and ready — so you can focus on what truly matters.
          </motion.p>

          {/* 🚀 CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/booking')}
              className="group rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/services')}
              className="rounded-full px-8 text-base font-semibold hover:scale-105 transition"
            >
              Explore Services
            </Button>
          </motion.div>

          {/* ⭐ SOCIAL PROOF */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-2">
              {[
                'photo-1494790108377-be9c29b29330',
                'photo-1507003211169-0a1dd7228f2d',
                'photo-1438761681033-6461ffad8d80',
              ].map((id, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop`}
                  className="size-10 rounded-full border-2 border-white"
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4.9/5</span> from 2,400+ reviews
            </p>
          </motion.div>
        </div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative lg:col-span-6"
        >
          {/* IMAGE */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={heroImg}
              alt="Laundry service"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>

          {/* 🧊 FLOATING CARD 1 */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-[-20px] left-[-10px] rounded-2xl bg-white/80 backdrop-blur-xl p-4 shadow-xl"
          >
            <p className="text-sm font-bold">🚚 Free Pickup</p>
            <p className="text-xs text-muted-foreground">At your doorstep</p>
          </motion.div>

          {/* 🧊 FLOATING CARD 2 */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute top-[-20px] right-[-10px] rounded-2xl bg-white/80 backdrop-blur-xl p-4 shadow-xl"
          >
            <p className="text-sm font-bold">⚡ 24h Delivery</p>
            <p className="text-xs text-muted-foreground">Fast & reliable</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}