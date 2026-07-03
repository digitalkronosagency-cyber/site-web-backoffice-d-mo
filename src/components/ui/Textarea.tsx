import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from '@/components/ui/clsx';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
