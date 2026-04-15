import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Droplets,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { NAV_LINKS } from '@/constants/config';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  // 🔥 Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-md border-b'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          
          {/* 🔷 LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition-transform duration-200 group-hover:scale-110">
              <Droplets className="size-5" />
            </div>

            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              FreshPress
            </span>
          </Link>

          {/* 🔷 DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-2 text-sm font-medium"
                >
                  <span
                    className={cn(
                      active
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </span>

                  {/* 🔥 Animated underline */}
                  {active && (
                    <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary animate-in slide-in-from-left" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 🔷 RIGHT SECTION */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* 🧠 USER DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:scale-105 transition"
                    >
                      <User className="mr-1 size-4" />
                      {user?.name?.split(' ')[0]}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                      My Orders
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <ShieldCheck className="mr-2 size-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hover:scale-105 transition"
                >
                  Sign In
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate('/booking')}
                  className="rounded-full px-5 hover:scale-105 transition"
                >
                  Book Now
                </Button>
              </>
            )}
          </div>

          {/* 📱 MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex size-10 items-center justify-center rounded-lg hover:bg-muted"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity',
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-xl transition-transform duration-300 p-4',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end">
          <button onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="mt-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* AUTH ACTIONS */}
        <div className="mt-6 border-t pt-4 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/my-orders');
                  setOpen(false);
                }}
              >
                My Orders
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/login');
                  setOpen(false);
                }}
              >
                Sign In
              </Button>

              <Button
                onClick={() => {
                  navigate('/booking');
                  setOpen(false);
                }}
              >
                Book Now
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}