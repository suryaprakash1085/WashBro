import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { apiFetch } from '@/hooks/useApi';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  reply_message?: string;
  replied_at?: string;
  created_at: string;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Message[]>('/api/messages', 'GET', undefined, false);
      setMessages(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch messages';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setLoading(false);
    }
  };

  const selectedMessage = selected ? messages.find((m) => m.id === selected) : null;

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await apiFetch(`/api/messages/${id}`, 'DELETE');
      toast({ title: 'Message deleted' });
      await fetchMessages();
      setSelected(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete message';
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a reply' });
      return;
    }

    setReplying(true);
    try {
      await apiFetch(`/api/messages/${selectedMessage.id}/reply`, 'PUT', { reply_message: replyText });
      toast({ title: 'Reply sent successfully' });
      setReplyText('');
      await fetchMessages();
      setSelected(selectedMessage.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reply';
      toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">Contact Messages</h2>
        <p className="text-sm text-muted-foreground">{messages.filter((m) => !m.replied_at).length} unreplied</p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Message</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((msg, i) => (
                  <motion.tr
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(msg.id)}
                    className={`cursor-pointer border-b last:border-0 transition-colors ${selected === msg.id ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${msg.replied_at ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}
                        >
                          <Mail className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">{msg.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Message preview */}
                    <td className="px-4 py-3">
                      <p className="line-clamp-1 text-muted-foreground">{msg.message}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(msg.created_at)}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${msg.replied_at ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {msg.replied_at ? 'Replied' : 'Pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="size-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-5">
          {selectedMessage ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border bg-white p-5 shadow-sm space-y-5">
              <div>
                <h3 className="font-[Outfit] text-base font-semibold mb-3">Message Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">From</p>
                    <p className="mt-1 font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                    <p className="mt-1 break-all text-primary underline cursor-pointer">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Phone</p>
                    <p className="mt-1">{selectedMessage.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Date</p>
                    <p className="mt-1">{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-[Outfit] text-sm font-semibold mb-2">Message</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {selectedMessage.replied_at && selectedMessage.reply_message && (
                <div className="border-t pt-4 rounded-lg bg-emerald-50 p-3">
                  <h4 className="font-[Outfit] text-sm font-semibold text-emerald-900 mb-2">Your Reply</h4>
                  <p className="text-sm text-emerald-800 whitespace-pre-wrap">{selectedMessage.reply_message}</p>
                  <p className="text-xs text-emerald-700 mt-2">Sent on {formatDate(selectedMessage.replied_at)}</p>
                </div>
              )}

              {!selectedMessage.replied_at && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-[Outfit] text-sm font-semibold">Send Reply</h4>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button onClick={handleReply} disabled={replying || !replyText.trim()} className="w-full gap-2">
                    <Send className="size-4" />
                    {replying ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="rounded-2xl border bg-white p-5 shadow-sm text-center text-muted-foreground">
              <Mail className="size-8 mx-auto mb-2 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
