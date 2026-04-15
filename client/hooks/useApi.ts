import { useState, useCallback } from 'react';

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, options?: UseApiOptions, body?: any) => Promise<T | null>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('fp_token');
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
}

export function useApi<T = any>(): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, options: UseApiOptions = {}, body?: any) => {
      const { method = 'GET', headers = {}, requireAuth = false } = options;
      setLoading(true);
      setError(null);

      try {
        const authHeaders = requireAuth ? getAuthHeaders() : {};
        const finalHeaders = {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        };

        const fetchOptions: RequestInit = {
          method,
          headers: finalHeaders,
        };

        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || result);
        return result.data || result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, execute };
}

export function useApiCall<T = any>(url: string, options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = useCallback(
    async (body?: any) => {
      const { method = 'GET', headers = {}, requireAuth = true } = options;
      setLoading(true);
      setError(null);

      try {
        const authHeaders = requireAuth ? getAuthHeaders() : {};
        const finalHeaders = {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        };

        const fetchOptions: RequestInit = {
          method,
          headers: finalHeaders,
        };

        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        const returnData = result.data || result;
        setData(returnData);
        return returnData;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { data, loading, error, call };
}

/**
 * Simple fetch wrapper that includes auth token automatically
 */
export async function apiFetch<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  requireAuth: boolean = true
): Promise<T> {
  const authHeaders = requireAuth ? getAuthHeaders() : {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const result = await response.json();
  const data = result.data || result;

  // Normalize numeric string fields from API
  const normalize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(normalize);
    if (obj && typeof obj === 'object') {
      const out = { ...obj };
      for (const key of ['price', 'total_amount', 'amount']) {
        if (key in out && out[key] != null) out[key] = Number(out[key]);
      }
      return out;
    }
    return obj;
  };

  return normalize(data) as T;
}
