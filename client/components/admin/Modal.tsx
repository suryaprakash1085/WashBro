import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideSubmitButton?: boolean;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({
  open,
  title,
  description,
  onClose,
  onSubmit,
  loading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  closeOnBackdropClick = true,
  children,
  footer,
  size = 'lg',
  hideSubmitButton = false,
}: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeMap[size]} rounded-2xl bg-white shadow-xl`}
          >
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-start justify-between">
              <div>
                <h2 className="font-[Outfit] text-xl font-bold">{title}</h2>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer ? (
              <div className="border-t px-6 py-4 bg-slate-50/50">
                {footer}
              </div>
            ) : !hideSubmitButton ? (
              <div className="border-t px-6 py-4 flex justify-end gap-2 bg-slate-50/50">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                {onSubmit && (
                  <Button 
                    onClick={onSubmit} 
                    disabled={loading}
                    className="min-w-24"
                  >
                    {loading ? 'Saving...' : submitLabel}
                  </Button>
                )}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
