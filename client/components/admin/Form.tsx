import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import FormField from './FormField';
import { motion } from 'framer-motion';

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { label: string; value: string }[];
  validation?: (value: any) => string | undefined;
  disabled?: boolean;
  className?: string;
}

interface FormProps {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  layout?: 'single' | 'double';
  initialValues?: Record<string, any>;
  className?: string;
}

export default function Form({
  fields,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  layout = 'single',
  initialValues = {},
  className = '',
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => {
      acc[field.name] = initialValues[field.name] ?? '';
      return acc;
    }, {} as Record<string, any>)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.name];

      // Required validation
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }

      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Invalid email format';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, fields]);

  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: '',
        }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDoubleLayout = layout === 'double';
  const fieldsPerRow = isDoubleLayout ? Math.ceil(fields.length / 2) : fields.length;

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className={isDoubleLayout ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={isDoubleLayout && index % 2 === 0 ? 'col-span-1' : ''}
          >
            <FormField
              label={field.label}
              type={field.type as any}
              value={formData[field.name]}
              onChange={(value) => handleChange(field.name, value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled || isSubmitting || loading}
              rows={field.rows}
              options={field.options}
              error={errors[field.name]}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="min-w-32"
        >
          {isSubmitting || loading ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
