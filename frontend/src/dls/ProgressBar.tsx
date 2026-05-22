type ProgressVariant = 'gradient' | 'amber' | 'emerald' | 'muted';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  className?: string;
}

const trackClasses: Record<ProgressVariant, string> = {
  gradient: 'bg-slate-100',
  amber:    'bg-amber-100',
  emerald:  'bg-slate-100',
  muted:    'bg-gray-100',
};

const fillClasses: Record<ProgressVariant, string> = {
  gradient: 'bg-gradient-to-r from-sunrise-400 to-dawn-500',
  amber:    'bg-amber-400',
  emerald:  'bg-emerald-500',
  muted:    'bg-warmGray-400',
};

const heightClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'gradient',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`w-full rounded-full ${heightClasses[size]} ${trackClasses[variant]} ${className}`}
    >
      <div
        className={`${heightClasses[size]} rounded-full transition-all duration-300 ${fillClasses[variant]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
