import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { Droplets, LogIn, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const isAdminMode = searchParams.get('admin') === 'true';
  const [tab, setTab] = useState<'user' | 'admin'>(isAdminMode ? 'admin' : 'user');
  const [email, setEmail] = useState(isAdminMode ? 'admin@freshpress.com' : 'sarah@example.com');
  const [password, setPassword] = useState('password');
  const { login, loginAsAdmin } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'admin') {
      const ok = loginAsAdmin(email, password);
      if (ok) { navigate('/admin'); toast({ title: 'Welcome back, Admin!' }); }
      else toast({ variant: 'destructive', title: 'Invalid admin credentials', description: 'Use admin@freshpress.com' });
    } else {
      login(email, password);
      navigate('/');
      toast({ title: `Welcome, ${email.split('@')[0]}!` });
    }
  };

  return (
    <div className="hero-gradient flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
            <Droplets className="size-7" />
          </div>
          <h1 className="font-[Outfit] text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your FreshPress account</p>
        </div>

        <div className="mb-6 flex overflow-hidden rounded-xl border bg-muted/50 p-1">
          <button
            onClick={() => { setTab('user'); setEmail('sarah@example.com'); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${tab === 'user' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <LogIn className="mr-1.5 inline size-3.5" /> Customer
          </button>
          <button
            onClick={() => { setTab('admin'); setEmail('admin@freshpress.com'); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${tab === 'admin' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <ShieldCheck className="mr-1.5 inline size-3.5" /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {tab === 'admin' && (
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              <strong>Demo:</strong> admin@freshpress.com / any password
            </div>
          )}
          {tab === 'user' && (
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              <strong>Demo:</strong> sarah@example.com / any password (or use any email)
            </div>
          )}

          <Button type="submit" size="lg" className="w-full rounded-xl text-base font-semibold">
            {tab === 'admin' ? 'Sign In as Admin' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
