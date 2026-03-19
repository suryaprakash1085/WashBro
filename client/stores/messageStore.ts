import { create } from 'zustand';
import type { ContactMessage } from '@/types';
import { MOCK_MESSAGES } from '@/constants/mockData';

interface MessageState {
  messages: ContactMessage[];
  addMessage: (msg: ContactMessage) => void;
  deleteMessage: (id: string) => void;
  markReplied: (id: string) => void;
}

const saved = localStorage.getItem('fp_messages');
const initial: ContactMessage[] = saved ? JSON.parse(saved) : MOCK_MESSAGES;

export const useMessageStore = create<MessageState>((set) => ({
  messages: initial,
  addMessage: (msg) => set((state) => {
    const next = [msg, ...state.messages];
    localStorage.setItem('fp_messages', JSON.stringify(next));
    return { messages: next };
  }),
  deleteMessage: (id) => set((state) => {
    const next = state.messages.filter(m => m.id !== id);
    localStorage.setItem('fp_messages', JSON.stringify(next));
    return { messages: next };
  }),
  markReplied: (id) => set((state) => {
    const next = state.messages.map(m => m.id === id ? { ...m, replied: true } : m);
    localStorage.setItem('fp_messages', JSON.stringify(next));
    return { messages: next };
  }),
}));
