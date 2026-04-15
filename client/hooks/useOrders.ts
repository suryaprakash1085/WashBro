import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Order {
  id: number;
  customer_id: number;
  service_id: number;
  service_name: string;
  price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  notes?: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export function useOrders() {
  const { data, loading, error, execute } = useApi<any>();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(
    async (page = 1, limit = 10, search = '') => {
      try {
        const url = `/api/orders?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const result = await execute(url, { method: 'GET' });
        if (result?.data) {
          setOrders(result.data);
        }
        return result;
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        return null;
      }
    },
    [execute]
  );

  const getOrder = useCallback(
    async (id: number) => {
      try {
        const result = await execute(`/api/orders/${id}`, { method: 'GET' });
        return result?.data;
      } catch (err) {
        console.error('Failed to fetch order:', err);
        return null;
      }
    },
    [execute]
  );

  const getPendingOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/pending');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch pending orders:', err);
      return [];
    }
  }, []);

  const getOrdersByCustomer = useCallback(async (customerId: number) => {
    try {
      const response = await fetch(`/api/orders/customer/${customerId}`);
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
      return [];
    }
  }, []);

  const getOrderStats = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/stats');
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Failed to fetch order stats:', err);
      return null;
    }
  }, []);

  const createOrder = useCallback(
    async (orderData: Partial<Order>) => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create order');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to create order:', err);
        throw err;
      }
    },
    []
  );

  const updateOrder = useCallback(
    async (id: number, orderData: Partial<Order>) => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update order');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to update order:', err);
        throw err;
      }
    },
    []
  );

  const updateOrderStatus = useCallback(
    async (id: number, status: string) => {
      try {
        const response = await fetch(`/api/orders/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update order status');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to update order status:', err);
        throw err;
      }
    },
    []
  );

  const deleteOrder = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to delete order');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        console.error('Failed to delete order:', err);
        throw err;
      }
    },
    []
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    getPendingOrders,
    getOrdersByCustomer,
    getOrderStats,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  };
}
