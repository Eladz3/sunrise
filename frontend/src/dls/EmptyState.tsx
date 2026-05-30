import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 py-12 text-center ${className}`}>
      {icon && <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sunrise-100 to-dawn-100 text-sunrise-500">{icon}</div>}
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
