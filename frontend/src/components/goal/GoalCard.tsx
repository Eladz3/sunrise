import { GoalCategory } from '@/constants/goal-category.constants'

// Placeholder SVG icons — replace with a proper SVG library later
function IconHealth() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function IconFitness() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
function IconFinance() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconLearning() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}
function IconCareer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
function IconRelationships() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconCreativity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}
function IconMindfulness() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  )
}
function IconOther() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
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

interface CategoryConfig {
  icon: React.ReactNode
  badge: string
}

const categoryConfig: Record<GoalCategory, CategoryConfig> = {
  [GoalCategory.Health]: { icon: <IconHealth />, badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  [GoalCategory.Fitness]: { icon: <IconFitness />, badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  [GoalCategory.Finance]: { icon: <IconFinance />, badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  [GoalCategory.Learning]: { icon: <IconLearning />, badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  [GoalCategory.Career]: { icon: <IconCareer />, badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  [GoalCategory.Relationships]: { icon: <IconRelationships />, badge: 'bg-pink-100 text-pink-700 border-pink-200' },
  [GoalCategory.Creativity]: { icon: <IconCreativity />, badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  [GoalCategory.Mindfulness]: { icon: <IconMindfulness />, badge: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  [GoalCategory.Other]: { icon: <IconOther />, badge: 'bg-slate-100 text-slate-700 border-slate-200' },
}

export function GoalCardSkeleton() {
  return (
    <div className="min-h-[140px] animate-pulse rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-xl bg-gray-200" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-40 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-14 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-200" />
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200" />
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

function GoalCardBody({ title, description, userName, currentValue, targetValue, unit, category, isComplete, showUserName }: { title: string; description?: string; userName?: string; currentValue: number; targetValue: number; unit: string; category: GoalCategory; isComplete: boolean; showUserName: boolean }) {
  const config = categoryConfig[category]
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0

  return (
    <>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`shrink-0 rounded-xl border p-2 ${config.badge}`}>{config.icon}</div>
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
        <div className={`h-2 w-full rounded-full ${isComplete ? 'bg-amber-100' : 'bg-slate-100'}`}>
          <div className={`h-2 rounded-full transition-all duration-300 ${isComplete ? 'bg-amber-400' : 'bg-gradient-to-r from-sunrise-400 to-dawn-500'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.badge}`}>
            {config.icon}
            {category}
          </span>
          <span className={`text-sm font-semibold ${isComplete ? 'text-amber-600' : 'text-indigo-600'}`}>{Math.round(progress)}%</span>
        </div>
      </div>
    </>
  )
}

const cardBase = (isComplete: boolean) => `p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${isComplete ? 'bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200' : 'bg-white'}`

export function GoalCard({ title, description, userName, currentValue, targetValue, unit, category, onEdit, onLogProgress }: GoalCardProps) {
  const progress = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
  const isComplete = progress >= 100

  const bodyProps = { title, description, userName, currentValue, targetValue, unit, category, isComplete }

  if (onLogProgress) {
    return (
      <div className={cardBase(isComplete)}>
        <GoalCardBody {...bodyProps} showUserName={false} />
        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <button onClick={onLogProgress} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <IconPlus />
            Log Progress
          </button>
          {onEdit && (
            <button onClick={onEdit} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Edit goal">
              <IconPencil />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (onEdit) {
    return (
      <button onClick={onEdit} className={`w-full text-left active:brightness-95 ${cardBase(isComplete)}`}>
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
