import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  setToken: (token: string | null) => void;
}

// Retrieve saved token from localStorage
const savedToken = localStorage.getItem('fp_token');
const savedUser = localStorage.getItem('fp_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
  isAdmin: savedUser ? JSON.parse(savedUser).role === 'admin' : false,
  token: savedToken,
  loading: false,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('fp_token', token);
    } else {
      localStorage.removeItem('fp_token');
    }
    set({ token });
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Login failed');
      }

      const data = await response.json();
      const { token, user } = data.data;

      // Store token and user
      localStorage.setItem('fp_token', token);
      localStorage.setItem('fp_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  loginAsAdmin: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Login failed');
      }

      const data = await response.json();
      const { token, user } = data.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      // Store token and user
      localStorage.setItem('fp_token', token);
      localStorage.setItem('fp_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Admin login failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Registration failed');
      }

      const data = await response.json();
      const { token, user } = data.data;

      // Store token and user
      localStorage.setItem('fp_token', token);
      localStorage.setItem('fp_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('fp_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('fp_token');
      localStorage.removeItem('fp_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('fp_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Profile update failed');
      }

      const result = await response.json();
      const updatedUser = result.data;

      localStorage.setItem('fp_user', JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('fp_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      const user = result.data;

      localStorage.setItem('fp_user', JSON.stringify(user));

      set({
        user,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message, loading: false });
      throw error;
    }
  },
}));
