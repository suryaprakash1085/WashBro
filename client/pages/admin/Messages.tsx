import { useState } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

export default function AdminMessages() {
  const { messages, deleteMessage, markReplied } = useMessageStore();
  const { toast } = useToast();

  const [selected, setSelected] = useState<string | null>(null);

  const selectedMessage = selected
    ? messages.find(m => m.id === selected)
    : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">
          Contact Messages
        </h2>
        <p className="text-sm text-muted-foreground">
          {messages.filter(m => !m.replied).length} unread
        </p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Actions
                  </th>
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
                    className={`cursor-pointer border-b last:border-0 transition-colors ${
                      selected === msg.id
                        ? 'bg-primary/5'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${
                            msg.replied
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {msg.replied ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <Mail className="size-4" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {msg.email}
                          </p>
                          {msg.phone && (
                            <p className="text-xs text-muted-foreground">
                              📞 {msg.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Message */}
                    <td className="px-4 py-3 max-w-xs truncate">
                      {msg.message}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          msg.replied
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {msg.replied ? 'Replied' : 'Pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        {!msg.replied && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              markReplied(msg.id);
                              toast({ title: 'Marked as replied' });
                            }}
                          >
                            Reply
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            deleteMessage(msg.id);
                            if (selected === msg.id) setSelected(null);
                            toast({ title: 'Message deleted' });
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="lg:col-span-5">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              {/* Header */}
              <div className="mb-5 flex items-center gap-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-full ${
                    selectedMessage.replied
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {selectedMessage.replied ? <CheckCircle2 /> : <Mail />}
                </div>

                <div>
                  <h3 className="font-[Outfit] text-lg font-bold">
                    {selectedMessage.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.email}
                  </p>
                  {selectedMessage.phone && (
                    <p className="text-xs text-muted-foreground">
                      📞 {selectedMessage.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="mb-4 text-sm text-muted-foreground">
                {formatDate(selectedMessage.createdAt)}
              </div>

              {/* Full Message */}
              <div className="mb-5 rounded-lg border bg-slate-50 p-4 text-sm leading-relaxed">
                {selectedMessage.message}
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    selectedMessage.replied
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {selectedMessage.replied ? 'Replied' : 'Pending'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!selectedMessage.replied && (
                  <Button
                    onClick={() => {
                      markReplied(selectedMessage.id);
                      toast({ title: 'Marked as replied' });
                    }}
                  >
                    Mark Replied
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                    setSelected(null);
                    toast({ title: 'Message deleted' });
                  }}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border bg-white text-sm text-muted-foreground">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}