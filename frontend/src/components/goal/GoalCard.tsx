import { GoalCategory } from '@/constants/goal-category.constants'
import { Badge, Button, Card, categoryConfig, IconButton, ProgressBar, Skeleton } from '@/dls'

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function GoalCardSkeleton() {
  return (
    <div className="min-h-[140px] animate-pulse rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <Skeleton width="w-8" height="h-8" rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-40" height="h-4" />
          <Skeleton width="w-24" height="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton width="w-14" height="h-3" />
          <Skeleton width="w-28" height="h-3" />
        </div>
        <Skeleton height="h-2" rounded="rounded-full" />
        <div className="flex justify-between">
          <Skeleton width="w-20" height="h-5" rounded="rounded-full" />
          <Skeleton width="w-8" height="h-3" />
        </div>
      </div>
    </div>
  )
}

interface GoalCardProps {
  title: string
  description?: string
  userName?: string
  currentValue: number
  targetValue: number
  unit: string
  category: GoalCategory
  onEdit?: () => void
  onLogProgress?: () => void
}

function GoalCardBody({ title, description, userName, currentValue, targetValue, unit, category, isComplete, showUserName }: { title: string; description?: string; userName?: string; currentValue: number; targetValue: number; unit: string; category: GoalCategory; isComplete: boolean; showUserName: boolean }) {
  const config = categoryConfig[category]
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0

  return (
    <>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`shrink-0 rounded-xl border p-2 ${config.classes}`}>{config.icon}</div>
          <div>
            <h3 className="font-semibold leading-tight text-slate-800">{title}</h3>
            {showUserName && userName && <p className="mt-0.5 text-xs text-slate-500">{userName}</p>}
          </div>
        </div>
        {isComplete && (
          <div className="shrink-0 text-amber-500">
            <IconStar />
          </div>
        )}
      </div>

      {description && <p className="mb-4 line-clamp-2 text-sm text-slate-600">{description}</p>}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-700">
            {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit}
          </span>
        </div>
        <ProgressBar value={currentValue} max={targetValue} variant={isComplete ? 'amber' : 'gradient'} />
        <div className="flex items-center justify-between">
          <Badge variant={category}>{category}</Badge>
          <span className={`text-sm font-semibold ${isComplete ? 'text-amber-600' : 'text-indigo-600'}`}>{Math.round(progress)}%</span>
        </div>
      </div>
    </>
  )
}

export function GoalCard({ title, description, userName, currentValue, targetValue, unit, category, onEdit, onLogProgress }: GoalCardProps) {
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
  const isComplete = progress >= 100
  const bodyProps = { title, description, userName, currentValue, targetValue, unit, category, isComplete }

  if (onLogProgress) {
    return (
      <Card variant={isComplete ? 'complete' : 'default'} interactive>
        <GoalCardBody {...bodyProps} showUserName={false} />
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onLogProgress}>
            <IconPlus />
            Log Progress
          </Button>
          {onEdit && <IconButton icon={<IconPencil />} label="Edit goal" size="sm" shape="circle" onClick={onEdit} />}
        </div>
      </Card>
    )
  }

  if (onEdit) {
    return (
      <Card variant={isComplete ? 'complete' : 'default'} interactive onClick={onEdit}>
        <GoalCardBody {...bodyProps} showUserName />
      </Card>
    )
  }

  return (
    <Card variant={isComplete ? 'complete' : 'default'} interactive>
      <GoalCardBody {...bodyProps} showUserName />
    </Card>
  )
}
