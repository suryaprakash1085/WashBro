import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';

export default function CTASection() {
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8" ref={ref}>
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 px-6 py-16 text-center text-white sm:px-12 lg:py-20"
        >
          <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative">
            <h2 className="mb-4 font-[Outfit] text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready for Fresh, Clean Clothes?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base text-blue-100 sm:text-lg">
              Schedule your first pickup today and get 20% off. Free pickup & delivery on all orders.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/booking')}
                className="group rounded-full bg-white px-8 text-base font-semibold text-primary hover:bg-white/90"
              >
                Book Now <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10"
              >
                <Phone className="mr-2 size-4" /> {APP_CONFIG.phone}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
