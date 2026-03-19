import HeroSection from '@/components/features/HeroSection';
import ServicesPreview from '@/components/features/ServicesPreview';
import HowItWorks from '@/components/features/HowItWorks';
import WhyChooseUs from '@/components/features/WhyChooseUs';
import Testimonials from '@/components/features/Testimonials';
import CTASection from '@/components/features/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
}
