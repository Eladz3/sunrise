import { GoalCategory } from '@/constants/goal-category.constants';

export function GoalCardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 min-h-[100px] animate-pulse">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="h-3 w-24 rounded bg-gray-200 mb-3" />
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2" />
      <div className="flex justify-between">
        <div className="h-3 w-28 rounded bg-gray-200" />
        <div className="h-3 w-8 rounded bg-gray-200" />
      </div>
    </div>
  )
}

interface GoalCardProps {
  title: string;
  userName?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: GoalCategory;
  onEdit?: () => void;
  onLogProgress?: () => void;
}

const categoryColors: Record<GoalCategory, { bg: string; text: string }> = {
  [GoalCategory.Health]: { bg: 'bg-green-100', text: 'text-green-700' },
  [GoalCategory.Fitness]: { bg: 'bg-blue-100', text: 'text-blue-700' },
  [GoalCategory.Finance]: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  [GoalCategory.Learning]: { bg: 'bg-purple-100', text: 'text-purple-700' },
  [GoalCategory.Career]: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  [GoalCategory.Relationships]: { bg: 'bg-pink-100', text: 'text-pink-700' },
  [GoalCategory.Creativity]: { bg: 'bg-orange-100', text: 'text-orange-700' },
  [GoalCategory.Mindfulness]: { bg: 'bg-teal-100', text: 'text-teal-700' },
  [GoalCategory.Other]: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export function GoalCard({ title, userName, currentValue, targetValue, unit, category, onEdit, onLogProgress }: GoalCardProps) {
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  const progressClamped = Math.min(100, Math.max(0, progress));
  const colors = categoryColors[category];
  const isComplete = progressClamped >= 100;

  const body = (
    <>
      <div className="flex justify-between items-start gap-2 mb-3">
        <h3 className="font-medium text-gray-800 leading-tight">{title}</h3>
        <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded-full shrink-0`}>
          {category}
        </span>
      </div>

      {userName && <p className="text-sm text-gray-500 mb-3">{userName}</p>}

      <div className="w-full bg-warmGray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-sunrise-400 to-dawn-500'
          }`}
          style={{ width: `${progressClamped}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-600">
          {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit}
        </p>
        <p className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
          {Math.round(progressClamped)}%
        </p>
      </div>
    </>
  );

  // When onLogProgress is provided, render as a div with explicit action buttons
  if (onLogProgress) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 min-h-[100px]">
        {body}
        <div className="flex gap-2 mt-3 pt-3 border-t border-warmGray-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
          <button
            onClick={onLogProgress}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Log Progress
          </button>
        </div>
      </div>
    );
  }

  if (onEdit) {
    return (
      <button
        onClick={onEdit}
        className="w-full text-left p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 hover:border-sunrise-200 hover:shadow-md active:bg-warmGray-50 transition-all min-h-[100px]"
      >
        {body}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 min-h-[100px]">
      {body}
    </div>
  );
}
