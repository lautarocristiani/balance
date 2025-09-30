'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ',
  {
    variants: {
      variant: {
        default: 'bg-orange-500 text-white hover:bg-orange-600 dark:hover:bg-orange-400',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400',
        theme: 'border bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/30 dark:text-white/30',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };