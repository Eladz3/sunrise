/**
 * useGoals Hook
 *
 * React hook for managing user goals with real-time updates.
 */

import { useState, useEffect } from 'react';
import type { Goal, CreateGoal, GoalStatus } from '@/types';
import {
  getUserGoals,
  createGoal as createGoalService,
  updateGoal,
  completeGoal,
  deleteGoal as deleteGoalService,
} from '@/services';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  createGoal: (goalData: CreateGoal) => Promise<string>;
  updateGoalStatus: (goalId: string, status: GoalStatus, notes?: string) => Promise<void>;
  markComplete: (goalId: string, userId: string) => Promise<number>;
  deleteGoal: (goalId: string, userId: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

/**
 * Hook for managing user goals
 *
 * @param userId - User's Firebase Auth UID
 * @returns Goals state and operations
 */
export function useGoals(userId: string | null): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals
  const fetchGoals = async () => {
    if (!userId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedGoals = await getUserGoals(userId);
      setGoals(fetchedGoals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  // Load goals on mount and when userId changes
  useEffect(() => {
    fetchGoals();
  }, [userId]);

  // Create new goal
  const createGoal = async (goalData: CreateGoal): Promise<string> => {
    try {
      setError(null);
      const goalId = await createGoalService(goalData);
      await fetchGoals(); // Refresh list
      return goalId;
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal');
      throw err;
    }
  };

  // Update goal status
  const updateGoalStatus = async (
    goalId: string,
    status: GoalStatus,
    notes?: string
  ): Promise<void> => {
    try {
      setError(null);
      const updates: any = { status };
      if (notes !== undefined) {
        updates.notes = notes;
      }
      await updateGoal(goalId, updates);
      await fetchGoals(); // Refresh list
    } catch (err) {
      console.error('Error updating goal status:', err);
      setError('Failed to update goal');
      throw err;
    }
  };

  // Mark goal as complete
  const markComplete = async (goalId: string, userId: string): Promise<number> => {
    try {
      setError(null);
      const newStreak = await completeGoal(goalId, userId);
      await fetchGoals(); // Refresh list
      return newStreak;
    } catch (err) {
      console.error('Error completing goal:', err);
      setError('Failed to complete goal');
      throw err;
    }
  };

  // Delete goal
  const deleteGoal = async (goalId: string, userId: string): Promise<void> => {
    try {
      setError(null);
      await deleteGoalService(goalId, userId);
      await fetchGoals(); // Refresh list
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoalStatus,
    markComplete,
    deleteGoal,
    refreshGoals: fetchGoals,
  };
}
