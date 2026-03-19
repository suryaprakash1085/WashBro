import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';
import { MOCK_ORDERS } from '@/constants/mockData';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  getOrdersByUser: (userId: string) => Order[];
}

const saved = localStorage.getItem('fp_orders');
const initial: Order[] = saved ? JSON.parse(saved) : MOCK_ORDERS;

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: initial,
  addOrder: (order) => set((state) => {
    const next = [order, ...state.orders];
    localStorage.setItem('fp_orders', JSON.stringify(next));
    return { orders: next };
  }),
  updateStatus: (id, status) => set((state) => {
    const next = state.orders.map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem('fp_orders', JSON.stringify(next));
    return { orders: next };
  }),
  deleteOrder: (id) => set((state) => {
    const next = state.orders.filter(o => o.id !== id);
    localStorage.setItem('fp_orders', JSON.stringify(next));
    return { orders: next };
  }),
  getOrdersByUser: (userId) => get().orders.filter(o => o.userId === userId),
}));
