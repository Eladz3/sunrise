import { useShallow } from 'zustand/react/shallow';
import { useGoalStore } from '@/stores/goalStore';
import type { Goal } from '@/types/goal.types';

export const useUserGoals = (userId: number): Goal[] => {
  return useGoalStore(
    useShallow((state) =>
      (state.goalIdsByUserId[userId] ?? [])
        .map((id) => state.goalsById[id])
        .filter((g): g is Goal => g !== undefined)
    )
  );
};
