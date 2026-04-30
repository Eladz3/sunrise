/**
 * CommunityProgressBar Component
 *
 * Displays a read-only progress bar showing global community goal completion.
 * Updates in real-time via Firestore subscription.
 */

import { useGlobalStats } from '@/hooks/useGlobalStats';

interface CommunityProgressBarProps {
  className?: string;
  showLabel?: boolean;
}

export function CommunityProgressBar({
  className = '',
  showLabel = true,
}: CommunityProgressBarProps) {
  const { stats, loading, error, completionPercent } = useGlobalStats();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded-full" />
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Community Progress</span>
          <span>
            {stats.totalGoalsCompleted.toLocaleString()} / {stats.totalGoals.toLocaleString()} goals
          </span>
        </div>
      )}
      <div className="h-4 bg-warmGray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sunrise-400 via-dawn-500 to-rose-500 transition-all duration-500"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
      <div className="text-center text-sm font-medium text-gray-700 mt-1">
        {completionPercent}% complete
      </div>
    </div>
  );
}
