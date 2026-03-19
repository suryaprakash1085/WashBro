import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId(): string {
  return 'FP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Picked Up': 'bg-blue-100 text-blue-700 border-blue-200',
    'Washing': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Ironing': 'bg-purple-100 text-purple-700 border-purple-200',
    'Out for Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}
