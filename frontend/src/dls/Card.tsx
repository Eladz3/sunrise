import type { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'muted' | 'complete' | 'selected';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: CardPadding;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:  'bg-white shadow-sm',
  elevated: 'bg-white shadow-md',
  muted:    'bg-gray-50 border border-gray-100',
  complete: 'bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200',
  selected: 'bg-sunrise-50 border border-sunrise-400 shadow-sm',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
};

export function Card({
  variant = 'default',
  interactive = false,
  padding = 'md',
  onClick,
  className = '',
  children,
}: CardProps) {
  const base = `rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]}${interactive ? ' hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' : ''}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left active:brightness-95 ${base} ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  );
}
