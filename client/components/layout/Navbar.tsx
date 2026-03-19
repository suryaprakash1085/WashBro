import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, User, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/constants/config';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition-transform duration-200 group-hover:scale-105">
            <Droplets className="size-5" />
          </div>
          <span className="font-[Outfit] text-xl font-bold tracking-tight text-foreground">
            Fresh<span className="text-primary">Press</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="gap-1.5">
                  <ShieldCheck className="size-3.5" /> Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="gap-1.5">
                <User className="size-3.5" /> {user?.name?.split(' ')[0]}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/my-orders')} className="text-sm">
                My Orders
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/booking')} className="rounded-full px-5">
                Book Now
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex size-10 items-center justify-center rounded-lg md:hidden hover:bg-muted"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-slide-up border-t bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium',
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => { navigate('/my-orders'); setOpen(false); }}>My Orders</Button>
                  <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setOpen(false); }}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { navigate('/login'); setOpen(false); }}>Sign In</Button>
                  <Button size="sm" onClick={() => { navigate('/booking'); setOpen(false); }}>Book Now</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
