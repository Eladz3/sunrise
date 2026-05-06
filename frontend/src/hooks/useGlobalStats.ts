import { useState, useEffect } from 'react';
import { getAllGoals } from '@/services/goals';
import type { GlobalStats } from '@/types';

interface UseGlobalStatsReturn {
  stats: GlobalStats | null;
  loading: boolean;
  error: string | null;
  completionPercent: number;
}

export function useGlobalStats(): UseGlobalStatsReturn {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllGoals()
      .then((goals) => {
        if (cancelled) return;
        const totalGoals = goals.length;
        const totalGoalsCompleted = goals.filter(
          (r) => r.current_value >= r.target_value
        ).length;
        setStats({
          id: 'current',
          totalUsers: new Set(goals.map((r) => r.user_id)).size,
          totalGoals,
          totalGoalsCompleted,
          totalGoalsInProgress: totalGoals - totalGoalsCompleted,
        } as GlobalStats);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error fetching global stats:', err);
        setError('Failed to load community stats');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const completionPercent =
    stats && stats.totalGoals > 0
      ? Math.round((stats.totalGoalsCompleted / stats.totalGoals) * 100)
      : 0;

  return { stats, loading, error, completionPercent };
}
