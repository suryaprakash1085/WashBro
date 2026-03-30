import { create } from 'zustand';

export interface HomepageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  offerBanner: string;
  servicesTitle: string;
  servicesSubtitle: string;
  ctaText: string;
}

interface HomepageStore {
  content: HomepageContent;
  updateContent: (content: Partial<HomepageContent>) => void;
}

const initialContent: HomepageContent = {
  id: 'homepage',
  heroTitle: 'Quality Laundry Service Delivered to Your Doorstep',
  heroSubtitle: 'From wash & fold to dry cleaning — we pick up, clean, and deliver your clothes with meticulous care.',
  offerBanner: '🎉 New customers get 20% off their first order!',
  servicesTitle: 'Our Services',
  servicesSubtitle: 'Professional cleaning for every need',
  ctaText: 'Ready to experience fresh, clean clothes without the hassle?',
};

export const useHomepageStore = create<HomepageStore>((set) => ({
  content: initialContent,
  updateContent: (newContent) =>
    set((state) => ({
      content: { ...state.content, ...newContent },
    })),
}));
