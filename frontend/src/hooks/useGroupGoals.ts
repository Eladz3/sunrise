import { useGoalStore } from '@/stores/goalStore';
import type { Goal } from '@/types';

export const useGroupGoals = (groupId: number): Goal[] => {
  return useGoalStore((state) =>
    (state.goalIdsByGroupId[groupId] ?? [])
      .map((id) => state.goalsById[id])
      .filter((g): g is Goal => g !== undefined)
  );
};
