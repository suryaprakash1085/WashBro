import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AdminCardProps {
  title?: string;
  icon?: React.ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export default function AdminCard({
  title,
  icon: Icon,
  children,
  className = '',
  delay = 0,
  headerAction,
  footer,
}: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border bg-white shadow-sm ${className}`}
    >
      {(title || headerAction) && (
        <div className="border-b px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-5 text-primary" />}
            {title && <h3 className="font-[Outfit] text-base font-semibold">{title}</h3>}
          </div>
          {headerAction}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footer && <div className="border-t px-5 py-4">{footer}</div>}
    </motion.div>
  );
}
