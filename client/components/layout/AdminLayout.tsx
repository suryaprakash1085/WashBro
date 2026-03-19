import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?admin=true" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 animate-slide-up">
            <AdminSidebar />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute right-4 top-4 z-20 text-white" aria-label="Close sidebar">
            <X className="size-6" />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="font-[Outfit] text-lg font-semibold text-foreground capitalize">
            {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
          </h1>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
