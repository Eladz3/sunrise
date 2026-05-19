import { useEffect } from 'react'
import { useMetricsStore } from '@/stores/metricsStore'
import type { GoalMetrics } from '@/types'

export const useGroupMetrics = (groupId: number | null): GoalMetrics | undefined => {
  const metrics = useMetricsStore((s) => s.groupMetricsByGroupId[groupId ?? 0])
  const lastFetched = useMetricsStore((s) => s.lastFetchedByGroupId[groupId ?? 0])
  const fetchGroupMetrics = useMetricsStore((s) => s.fetchGroupMetrics)

  useEffect(() => {
    if (groupId == null) return
    fetchGroupMetrics(groupId)
  }, [groupId, lastFetched, fetchGroupMetrics])

  return metrics
}
