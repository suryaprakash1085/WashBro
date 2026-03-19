import { useMessageStore } from '@/stores/messageStore';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

export default function AdminMessages() {
  const { messages, deleteMessage, markReplied } = useMessageStore();
  const { toast } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">Contact Messages</h2>
        <p className="text-sm text-muted-foreground">{messages.filter(m => !m.replied).length} unread</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${!msg.replied ? 'border-l-4 border-l-primary' : ''}`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${msg.replied ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {msg.replied ? <CheckCircle2 className="size-5" /> : <Mail className="size-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{msg.name}</h4>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDate(msg.createdAt)}
              </div>
            </div>

            {msg.phone && <p className="mb-2 text-xs text-muted-foreground">📞 {msg.phone}</p>}
            <p className="mb-4 text-sm leading-relaxed text-foreground">{msg.message}</p>

            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${msg.replied ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {msg.replied ? 'Replied' : 'Pending'}
              </span>
              <div className="flex gap-1">
                {!msg.replied && (
                  <Button variant="outline" size="sm" onClick={() => { markReplied(msg.id); toast({ title: 'Marked as replied' }); }}>
                    Mark Replied
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => { deleteMessage(msg.id); toast({ title: 'Message deleted' }); }}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
