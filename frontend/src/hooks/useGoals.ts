import { useState, useEffect, useCallback } from 'react';
import {
  getUserGoals,
  createGoal,
  updateGoal,
  type Goal,
  type GoalDocument,
} from '@/services/goals';

interface UseGoalsResult {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  addGoal: (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => Promise<void>;
  editGoal: (id: string, data: Partial<GoalDocument>) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

export function useGoals(userId: string | null): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserGoals(userId);
      setGoals(data);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => {
      if (!userId) return;

      const optimisticGoal: Goal = {
        id: `temp-${Date.now()}`,
        ...data,
        user_id: userId,
        current_value: 0,
      };
      setGoals((prev) => [...prev, optimisticGoal]);

      try {
        const newId = await createGoal({ ...data, user_id: userId });
        setGoals((prev) =>
          prev.map((g) => (g.id === optimisticGoal.id ? { ...g, id: newId } : g))
        );
      } catch (err) {
        setGoals((prev) => prev.filter((g) => g.id !== optimisticGoal.id));
        setError('Failed to create goal');
        console.error('Error creating goal:', err);
      }
    },
    [userId]
  );

  const editGoal = useCallback(
    async (id: string, data: Partial<GoalDocument>) => {
      const originalGoal = goals.find((g) => g.id === id);
      if (!originalGoal) return;

      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));

      try {
        await updateGoal(id, data);
      } catch (err) {
        setGoals((prev) => prev.map((g) => (g.id === id ? originalGoal : g)));
        setError('Failed to update goal');
        console.error('Error updating goal:', err);
      }
    },
    [goals]
  );

  return {
    goals,
    loading,
    error,
    addGoal,
    editGoal,
    refreshGoals: fetchGoals,
  };
}
