import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from '@/components/ui/clsx';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
