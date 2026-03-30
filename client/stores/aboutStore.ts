import { create } from 'zustand';

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  valuesTitle: string;
  teamTitle: string;
  teamDescription: string;
}

interface AboutStore {
  content: AboutContent;
  updateContent: (content: Partial<AboutContent>) => void;
}

const initialContent: AboutContent = {
  id: 'about',
  title: 'About FreshPress',
  subtitle: 'Your trusted laundry partner for over a decade',
  missionTitle: 'Our Mission',
  missionDescription: 'To make laundry care accessible and convenient for busy individuals and families.',
  visionTitle: 'Our Vision',
  visionDescription: 'To revolutionize the laundry industry with eco-friendly practices and exceptional service.',
  valuesTitle: 'Our Values',
  teamTitle: 'Meet Our Team',
  teamDescription: 'Dedicated professionals committed to excellence in every wash.',
};

export const useAboutStore = create<AboutStore>((set) => ({
  content: initialContent,
  updateContent: (newContent) =>
    set((state) => ({
      content: { ...state.content, ...newContent },
    })),
}));
