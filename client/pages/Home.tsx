import HeroSection from '@/components/features/HeroSection';
import ServicesPreview from '@/components/features/ServicesPreview';
import HowItWorks from '@/components/features/HowItWorks';
import WhyChooseUs from '@/components/features/WhyChooseUs';
import Testimonials from '@/components/features/Testimonials';
import CTASection from '@/components/features/CTASection';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </PageTransition>
  );
}
