import { useAuthStore } from '@/stores/authStore';
import { useGoalStore } from '@/stores/goalStore';
import { useUserGoals } from './useUserGoals';
import { getCurrentUser } from '@/auth/auth';
import type { CreateGoalRequest, UpdateGoalRequest } from '@/types/goal.types';

export function useGoals() {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const goals = useUserGoals(currentUserId ?? 0);
  const loading = useGoalStore((state) => state.loading);
  const error = useGoalStore((state) => state.error);
  const storeCreateGoal = useGoalStore((state) => state.createGoal);
  const storeUpdateGoal = useGoalStore((state) => state.updateGoal);
  const storeDeleteGoal = useGoalStore((state) => state.deleteGoal);

  const addGoal = (data: Omit<CreateGoalRequest, 'year'>) => {
    if (!currentUserId) return Promise.resolve();
    const firebaseUser = getCurrentUser();
    if (!firebaseUser) return Promise.resolve();
    return storeCreateGoal({
      ...data,
      year: new Date().getFullYear(),
      userId: currentUserId,
      firebaseUid: firebaseUser.uid,
    });
  };

  const editGoal = (goalId: number, data: UpdateGoalRequest) =>
    storeUpdateGoal(goalId, data);

  const removeGoal = (goalId: number) =>
    storeDeleteGoal(goalId);

  return { goals, loading, error, addGoal, editGoal, removeGoal };
}
