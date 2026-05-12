import { useMetricsStore } from '@/stores/metricsStore';
import type { GoalMetrics } from '@/types/metrics.types';

export const useUserMetrics = (userId: number): GoalMetrics | undefined => {
  return useMetricsStore((state) => state.userMetricsByUserId[userId]);
};
