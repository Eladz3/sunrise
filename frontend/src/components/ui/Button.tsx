/**
 * Button Component
 *
 * Reusable button with variants and loading state.
 */

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-sunrise-500 to-dawn-500 text-white hover:from-sunrise-600 hover:to-dawn-600 focus:ring-sunrise-500 shadow-sm',
    secondary: 'bg-warmGray-600 text-white hover:bg-warmGray-700 focus:ring-warmGray-500',
    outline:
      'border-2 border-sunrise-300 text-sunrise-700 hover:bg-sunrise-50 focus:ring-sunrise-500',
    ghost: 'text-warmGray-700 hover:bg-sunrise-50 focus:ring-sunrise-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Icon name="spinner" size={16} className="animate-spin -ml-1 mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
