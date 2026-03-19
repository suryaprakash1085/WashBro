import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, Sparkles, MessageSquare, BarChart3, Settings, LogOut, Droplets, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const icons: Record<string, React.ElementType> = { LayoutDashboard, ClipboardList, Users, Sparkles, MessageSquare, BarChart3, Settings };

const links = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Orders', path: '/admin/orders', icon: 'ClipboardList' },
  { label: 'Customers', path: '/admin/customers', icon: 'Users' },
  { label: 'Services', path: '/admin/services', icon: 'Sparkles' },
  { label: 'Messages', path: '/admin/messages', icon: 'MessageSquare' },
  { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const isActive = (path: string) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  return (
    <aside className="admin-gradient flex w-64 shrink-0 flex-col border-r border-white/5 lg:w-[260px]">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-white">
          <Droplets className="size-4" />
        </div>
        <span className="font-[Outfit] text-lg font-bold text-white">
          Fresh<span className="text-blue-400">Press</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {links.map((link) => {
          const Icon = icons[link.icon];
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive(link.path)
                  ? 'bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              )}
            >
              <Icon className="size-[18px]" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/5 px-3 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <ChevronLeft className="size-[18px]" />
          Back to Site
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="size-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
