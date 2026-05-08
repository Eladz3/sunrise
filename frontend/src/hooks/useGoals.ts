import { useState, useEffect, useCallback } from 'react';
import {
  getUserGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
  type GoalDocument,
} from '@/services/goals';

interface UseGoalsResult {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  addGoal: (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => Promise<void>;
  editGoal: (id: string, data: Partial<GoalDocument>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

export function useGoals(sqlUserId: number | null): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!sqlUserId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserGoals(sqlUserId);
      setGoals(data);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [sqlUserId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (data: Omit<GoalDocument, 'current_value' | 'user_id'>) => {
      if (!sqlUserId) return;

      const optimisticGoal: Goal = {
        id: `temp-${Date.now()}`,
        ...data,
        user_id: String(sqlUserId),
        current_value: 0,
      };
      setGoals((prev) => [...prev, optimisticGoal]);

      try {
        const newId = await createGoal({ ...data, user_id: String(sqlUserId) });
        setGoals((prev) =>
          prev.map((g) => (g.id === optimisticGoal.id ? { ...g, id: newId } : g))
        );
      } catch (err) {
        setGoals((prev) => prev.filter((g) => g.id !== optimisticGoal.id));
        setError('Failed to create goal');
        console.error('Error creating goal:', err);
      }
    },
    [sqlUserId]
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

  const removeGoal = useCallback(
    async (id: string) => {
      const originalGoals = goals;
      setGoals((prev) => prev.filter((g) => g.id !== id));

      try {
        await deleteGoal(id);
      } catch (err) {
        setGoals(originalGoals);
        setError('Failed to delete goal');
        console.error('Error deleting goal:', err);
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
    removeGoal,
    refreshGoals: fetchGoals,
  };
}
