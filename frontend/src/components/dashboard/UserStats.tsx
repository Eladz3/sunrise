/**
 * UserStats Component
 *
 * Displays user statistics on the dashboard.
 */

import type { User, Goal } from '@/types';
import { filterActiveGoals, calculateCompletionRate } from '@/utils';

interface UserStatsProps {
  user: User;
  goals: Goal[];
}

export function UserStats({ user, goals }: UserStatsProps) {
  const activeGoals = filterActiveGoals(goals);
  const completionRate = calculateCompletionRate(goals);

  const stats = [
    {
      label: 'Current Streak',
      value: `${user.currentStreak}`,
      subtext: 'days',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Active Goals',
      value: `${activeGoals.length}`,
      subtext: `of ${goals.length} total`,
      color: 'text-sunrise-600',
      bgColor: 'bg-sunrise-50',
    },
    {
      label: 'Completed',
      value: `${user.goalsCompletedCount}`,
      subtext: 'all time',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      subtext: 'success rate',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}
