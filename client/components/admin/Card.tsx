import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  delay = 0,
  headerAction,
  footer,
  variant = 'default',
  onClick,
  hoverable = false,
}: CardProps) {
  const variantStyles = {
    default: 'rounded-2xl border bg-white shadow-sm',
    bordered: 'rounded-2xl border-2 bg-transparent',
    elevated: 'rounded-2xl border bg-white shadow-lg',
    flat: 'rounded-2xl bg-white',
  };

  const hoverableClass = hoverable && onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`${variantStyles[variant]} ${hoverableClass} ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="border-b px-6 py-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {Icon && <Icon className="size-5 text-primary mt-1" />}
            <div>
              {title && <h3 className="font-[Outfit] text-base font-semibold">{title}</h3>}
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          {headerAction}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && <div className="border-t px-6 py-4 bg-slate-50/50">{footer}</div>}
    </motion.div>
  );
}
