export const APP_CONFIG = {
  name: 'FreshPress',
  tagline: 'Premium Laundry Service',
  phone: '+1 (555) 234-5678',
  email: 'hello@freshpress.com',
  address: '247 Clean Street, Suite 100, San Francisco, CA 94105',
  hours: 'Mon - Sat: 7:00 AM - 9:00 PM',
  social: {
    twitter: '#',
    facebook: '#',
    instagram: '#',
  },
};

export const ORDER_STATUSES = [
  'Pending',
  'Picked Up',
  'Washing',
  'Ironing',
  'Out for Delivery',
  'Delivered',
] as const;

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Booking', path: '/booking' },
  { label: 'Contact', path: '/contact' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Orders', path: '/admin/orders', icon: 'ClipboardList' },
  { label: 'Customers', path: '/admin/customers', icon: 'Users' },
  { label: 'Services', path: '/admin/services', icon: 'Sparkles' },
  { label: 'Messages', path: '/admin/messages', icon: 'MessageSquare' },
  { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
];
