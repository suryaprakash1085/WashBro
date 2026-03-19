import { create } from 'zustand';
import type { Service } from '@/types';
import { MOCK_SERVICES } from '@/constants/mockData';

interface ServiceState {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
}

const saved = localStorage.getItem('fp_services');
const initial: Service[] = saved ? JSON.parse(saved) : MOCK_SERVICES;

export const useServiceStore = create<ServiceState>((set) => ({
  services: initial,
  addService: (service) => set((state) => {
    const next = [...state.services, service];
    localStorage.setItem('fp_services', JSON.stringify(next));
    return { services: next };
  }),
  updateService: (id, data) => set((state) => {
    const next = state.services.map(s => s.id === id ? { ...s, ...data } : s);
    localStorage.setItem('fp_services', JSON.stringify(next));
    return { services: next };
  }),
  deleteService: (id) => set((state) => {
    const next = state.services.filter(s => s.id !== id);
    localStorage.setItem('fp_services', JSON.stringify(next));
    return { services: next };
  }),
}));
