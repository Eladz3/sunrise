export type GoalCategory =
  | 'health'
  | 'fitness'
  | 'finance'
  | 'learning'
  | 'career'
  | 'relationships'
  | 'creativity'
  | 'mindfulness'
  | 'other';

interface GoalCardProps {
  title: string;
  user_name?: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: GoalCategory;
  onEdit?: () => void;
  onDelete?: () => void;
}

const categoryColors: Record<GoalCategory, { bg: string; text: string }> = {
  health: { bg: 'bg-green-100', text: 'text-green-700' },
  fitness: { bg: 'bg-blue-100', text: 'text-blue-700' },
  finance: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  learning: { bg: 'bg-purple-100', text: 'text-purple-700' },
  career: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  relationships: { bg: 'bg-pink-100', text: 'text-pink-700' },
  creativity: { bg: 'bg-orange-100', text: 'text-orange-700' },
  mindfulness: { bg: 'bg-teal-100', text: 'text-teal-700' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export function GoalCard({
  title,
  user_name,
  current_value,
  target_value,
  unit,
  category,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const progress = target_value > 0 ? (current_value / target_value) * 100 : 0;
  const progressClamped = Math.min(100, Math.max(0, progress));
  const colors = categoryColors[category];
  const isComplete = progressClamped >= 100;

  const cardContent = (
    <>
      <div className="flex justify-between items-start gap-2 mb-3">
        <h3 className="font-medium text-gray-800 leading-tight">{title}</h3>
        <span
          className={`text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded-full shrink-0`}
        >
          {category}
        </span>
      </div>

      {user_name && (
        <p className="text-sm text-gray-500 mb-3">{user_name}</p>
      )}

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
          {current_value.toLocaleString()} / {target_value.toLocaleString()} {unit}
        </p>
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
            {Math.round(progressClamped)}%
          </p>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-gray-300 hover:text-red-400 transition-colors"
              aria-label="Delete goal"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (onEdit) {
    return (
      <button
        onClick={onEdit}
        className="w-full text-left p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 hover:border-sunrise-200 hover:shadow-md active:bg-warmGray-50 transition-all min-h-[100px]"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-warmGray-100 min-h-[100px]">
      {cardContent}
    </div>
  );
}
