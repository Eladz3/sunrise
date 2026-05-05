import { useState, useEffect, useCallback } from 'react';
import { getAllGoals, type Goal } from '@/services/goals';

interface UseCommunityGoalsResult {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refreshGoals: () => void;
}

export function useCommunityGoals(): UseCommunityGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGoals();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching community goals:', err);
      setError('Failed to load community data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    refreshGoals: fetchGoals,
  };
}

export function groupGoalsByUser(goals: Goal[]): Record<string, Goal[]> {
  return goals.reduce(
    (acc, goal) => {
      const userName = goal.user_name;
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(goal);
      return acc;
    },
    {} as Record<string, Goal[]>
  );
}

export function calculateCommunityProgress(goals: Goal[]): {
  totalCurrent: number;
  totalTarget: number;
  percentage: number;
} {
  const totalCurrent = goals.reduce((sum, g) => sum + g.current_value, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target_value, 0);
  const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return {
    totalCurrent,
    totalTarget,
    percentage: Math.round(percentage),
  };
}
