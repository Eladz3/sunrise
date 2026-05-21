import { GoalCategory } from '@/constants/goal-category.constants'
import { Icon, type IconName } from '@/components/ui/Icon'

interface CategoryConfig {
  iconName: IconName
  badge: string
}

const categoryConfig: Record<GoalCategory, CategoryConfig> = {
  [GoalCategory.Health]:        { iconName: 'heart',        badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  [GoalCategory.Fitness]:       { iconName: 'zap',          badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  [GoalCategory.Finance]:       { iconName: 'dollar-sign',  badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  [GoalCategory.Learning]:      { iconName: 'book',         badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  [GoalCategory.Career]:        { iconName: 'briefcase',    badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  [GoalCategory.Relationships]: { iconName: 'user-group',   badge: 'bg-pink-100 text-pink-700 border-pink-200' },
  [GoalCategory.Creativity]:    { iconName: 'palette',      badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  [GoalCategory.Mindfulness]:   { iconName: 'brain',        badge: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  [GoalCategory.Other]:         { iconName: 'star',         badge: 'bg-slate-100 text-slate-700 border-slate-200' },
}

export function GoalCardSkeleton() {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm min-h-[140px] animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-gray-200 mb-2" />
          <div className="h-3 w-24 rounded bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-14 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-200" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" />
        <div className="flex justify-between">
          <div className="h-5 w-20 rounded-full bg-gray-200" />
          <div className="h-3 w-8 rounded bg-gray-200" />
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

function GoalCardBody({ title, description, userName, currentValue, targetValue, unit, category, isComplete, showUserName }: {
  title: string
  description?: string
  userName?: string
  currentValue: number
  targetValue: number
  unit: string
  category: GoalCategory
  isComplete: boolean
  showUserName: boolean
}) {
  const config = categoryConfig[category]
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0

  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border shrink-0 ${config.badge}`}>
            <Icon name={config.iconName} size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 leading-tight">{title}</h3>
            {showUserName && userName && (
              <p className="text-xs text-slate-500 mt-0.5">{userName}</p>
            )}
          </div>
        </div>
        {isComplete && (
          <div className="text-amber-500 shrink-0">
            <Icon name="star-filled" size={20} />
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-700">
            {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit}
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${isComplete ? 'bg-amber-100' : 'bg-slate-100'}`}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isComplete ? 'bg-amber-400' : 'bg-gradient-to-r from-sunrise-400 to-dawn-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${config.badge}`}>
            <Icon name={config.iconName} size={16} />
            {category}
          </span>
          <span className={`text-sm font-semibold ${isComplete ? 'text-amber-600' : 'text-indigo-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </>
  )
}

const cardBase = (isComplete: boolean) =>
  `p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${
    isComplete
      ? 'bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200'
      : 'bg-white'
  }`

export function GoalCard({ title, description, userName, currentValue, targetValue, unit, category, onEdit, onLogProgress }: GoalCardProps) {
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
  const isComplete = progress >= 100

  const bodyProps = { title, description, userName, currentValue, targetValue, unit, category, isComplete }

  if (onLogProgress) {
    return (
      <div className={cardBase(isComplete)}>
        <GoalCardBody {...bodyProps} showUserName={false} />
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={onLogProgress}
            className="flex flex-1 items-center justify-center gap-1.5 h-9 px-3 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Icon name="plus" size={14} />
            Log Progress
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="h-9 w-9 flex items-center justify-center text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Edit goal"
            >
              <Icon name="pencil" size={14} />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (onEdit) {
    return (
      <button
        onClick={onEdit}
        className={`w-full text-left active:brightness-95 ${cardBase(isComplete)}`}
      >
        <GoalCardBody {...bodyProps} showUserName />
      </button>
    )
  }

  return (
    <div className={cardBase(isComplete)}>
      <GoalCardBody {...bodyProps} showUserName />
    </div>
  )
}
