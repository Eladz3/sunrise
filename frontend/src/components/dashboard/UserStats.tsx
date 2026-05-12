import { useAuthStore } from '@/stores/authStore';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useUserMetrics } from '@/hooks/useUserMetrics';

export function UserStats() {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const goals = useUserGoals(currentUserId ?? 0);
  const metrics = useUserMetrics(currentUserId ?? 0);

  const activeGoals = goals.filter((g) => !g.completedOn);
  const completedGoals = goals.filter((g) => !!g.completedOn);

  const totalTarget = goals.reduce((sum, g) => sum + g.targetValue, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentValue, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const completionRate =
    metrics?.progressPercentage ??
    (goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0);

  const stats = [
    {
      label: 'Active Goals',
      value: `${activeGoals.length}`,
      subtext: `of ${goals.length} total`,
      color: 'text-sunrise-600',
      bgColor: 'bg-sunrise-50',
    },
    {
      label: 'Completed',
      value: `${metrics?.completedGoalsCount ?? completedGoals.length}`,
      subtext: 'all time',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Overall Progress',
      value: `${overallProgress}%`,
      subtext: `${totalCurrent.toLocaleString()} / ${totalTarget.toLocaleString()} total`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      subtext: 'goals finished',
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
