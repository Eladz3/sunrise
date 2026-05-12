import { useMetricsStore } from '@/stores/metricsStore'
import type { GoalMetrics } from '@/types'

export const useGroupMetrics = (groupId: number): GoalMetrics | undefined => {
  return useMetricsStore((state) => state.groupMetricsByGroupId[groupId])
}
