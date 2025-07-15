'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      default: 'bg-pink-500 text-white hover:bg-pink-600',
      outline: 'border border-pink-500 text-pink-500 hover:bg-pink-100',
      ghost: 'text-pink-700 hover:bg-pink-200',
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
