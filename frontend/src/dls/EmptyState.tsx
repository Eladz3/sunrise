import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 gap-3 ${className}`}>
      {icon && (
        <div className="mb-1 w-16 h-16 rounded-2xl bg-gradient-to-br from-sunrise-100 to-dawn-100 flex items-center justify-center text-sunrise-500">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
