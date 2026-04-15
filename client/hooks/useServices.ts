import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Service {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useServices() {
  const { data, loading, error, execute } = useApi<any>();
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = useCallback(
    async (page = 1, limit = 10, search = '') => {
      try {
        const url = `/api/services?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const result = await execute(url, { method: 'GET' });
        if (result?.data) {
          setServices(result.data);
        }
        return result;
      } catch (err) {
        console.error('Failed to fetch services:', err);
        return null;
      }
    },
    [execute]
  );

  const getService = useCallback(
    async (id: number) => {
      try {
        const result = await execute(`/api/services/${id}`, { method: 'GET' });
        return result?.data;
      } catch (err) {
        console.error('Failed to fetch service:', err);
        return null;
      }
    },
    [execute]
  );

  const getActiveServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services/active');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch active services:', err);
      return [];
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/services/categories');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  }, []);

  const createService = useCallback(
    async (serviceData: Partial<Service>) => {
      try {
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create service');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to create service:', err);
        throw err;
      }
    },
    []
  );

  const updateService = useCallback(
    async (id: number, serviceData: Partial<Service>) => {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update service');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to update service:', err);
        throw err;
      }
    },
    []
  );

  const deleteService = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to delete service');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        console.error('Failed to delete service:', err);
        throw err;
      }
    },
    []
  );

  return {
    services,
    loading,
    error,
    fetchServices,
    getService,
    getActiveServices,
    getCategories,
    createService,
    updateService,
    deleteService,
  };
}
