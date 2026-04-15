import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'customer';
  address?: string;
  city?: string;
  zipcode?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useUsers() {
  const { data, loading, error, execute } = useApi<any>();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, search = '') => {
      try {
        const url = `/api/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const result = await execute(url, { method: 'GET' });
        if (result?.data) {
          setUsers(result.data);
        }
        return result;
      } catch (err) {
        console.error('Failed to fetch users:', err);
        return null;
      }
    },
    [execute]
  );

  const getUser = useCallback(
    async (id: number) => {
      try {
        const result = await execute(`/api/users/${id}`, { method: 'GET' });
        return result?.data;
      } catch (err) {
        console.error('Failed to fetch user:', err);
        return null;
      }
    },
    [execute]
  );

  const createUser = useCallback(
    async (userData: Partial<User>) => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create user');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to create user:', err);
        throw err;
      }
    },
    []
  );

  const updateUser = useCallback(
    async (id: number, userData: Partial<User>) => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update user');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to update user:', err);
        throw err;
      }
    },
    []
  );

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to delete user');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        console.error('Failed to delete user:', err);
        throw err;
      }
    },
    []
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
