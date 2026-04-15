import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply_message?: string;
  replied_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function useMessages() {
  const { data, loading, error, execute } = useApi<any>();
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(
    async (page = 1, limit = 10, search = '') => {
      try {
        const url = `/api/messages?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
        const result = await execute(url, { method: 'GET' });
        if (result?.data) {
          setMessages(result.data);
        }
        return result;
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        return null;
      }
    },
    [execute]
  );

  const getMessage = useCallback(
    async (id: number) => {
      try {
        const result = await execute(`/api/messages/${id}`, { method: 'GET' });
        return result?.data;
      } catch (err) {
        console.error('Failed to fetch message:', err);
        return null;
      }
    },
    [execute]
  );

  const getUnreadMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages/unread');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch unread messages:', err);
      return [];
    }
  }, []);

  const getRepliedMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages/replied');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to fetch replied messages:', err);
      return [];
    }
  }, []);

  const getMessageStats = useCallback(async () => {
    try {
      const response = await fetch('/api/messages/stats');
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Failed to fetch message stats:', err);
      return null;
    }
  }, []);

  const createMessage = useCallback(
    async (messageData: Partial<Message>) => {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create message');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to create message:', err);
        throw err;
      }
    },
    []
  );

  const updateMessage = useCallback(
    async (id: number, messageData: Partial<Message>) => {
      try {
        const response = await fetch(`/api/messages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update message');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to update message:', err);
        throw err;
      }
    },
    []
  );

  const markAsRead = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/messages/${id}/read`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to mark as read');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to mark message as read:', err);
        throw err;
      }
    },
    []
  );

  const replyToMessage = useCallback(
    async (id: number, reply_message: string) => {
      try {
        const response = await fetch(`/api/messages/${id}/reply`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reply_message }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to reply to message');
        }

        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error('Failed to reply to message:', err);
        throw err;
      }
    },
    []
  );

  const deleteMessage = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to delete message');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        console.error('Failed to delete message:', err);
        throw err;
      }
    },
    []
  );

  return {
    messages,
    loading,
    error,
    fetchMessages,
    getMessage,
    getUnreadMessages,
    getRepliedMessages,
    getMessageStats,
    createMessage,
    updateMessage,
    markAsRead,
    replyToMessage,
    deleteMessage,
  };
}
