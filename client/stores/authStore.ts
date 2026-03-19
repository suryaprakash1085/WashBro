import { create } from 'zustand';
import type { User } from '@/types';
import { MOCK_USERS } from '@/constants/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  loginAsAdmin: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const saved = localStorage.getItem('fp_user');
const initial: User | null = saved ? JSON.parse(saved) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initial,
  isAuthenticated: !!initial,
  isAdmin: initial?.role === 'admin',
  login: (email: string, _password: string) => {
    const found = MOCK_USERS.find(u => u.email === email);
    const user: User = found || { id: 'u_new', name: email.split('@')[0], email, phone: '', address: '', role: 'user', joinedDate: new Date().toISOString().split('T')[0] };
    localStorage.setItem('fp_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isAdmin: false });
    return true;
  },
  loginAsAdmin: (email: string, _password: string) => {
    if (email === 'admin@freshpress.com') {
      const admin: User = { id: 'admin1', name: 'Admin', email, phone: '', address: '', role: 'admin', joinedDate: '2024-01-01' };
      localStorage.setItem('fp_user', JSON.stringify(admin));
      set({ user: admin, isAuthenticated: true, isAdmin: true });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('fp_user');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
  updateProfile: (data) => set((state) => {
    const updated = { ...state.user!, ...data };
    localStorage.setItem('fp_user', JSON.stringify(updated));
    return { user: updated };
  }),
}));
