import { useEffect } from 'react'
import { useMetricsStore } from '@/stores/metricsStore'
import type { GoalMetrics } from '@/types'

export const useUserMetrics = (userId: number | null): GoalMetrics | undefined => {
  const metrics = useMetricsStore((s) => s.userMetricsByUserId[userId ?? 0])
  const lastFetched = useMetricsStore((s) => s.lastFetchedByUserId[userId ?? 0])
  const fetchUserMetrics = useMetricsStore((s) => s.fetchUserMetrics)

  useEffect(() => {
    if (userId == null) return
    fetchUserMetrics(userId)
  }, [userId, lastFetched, fetchUserMetrics])

  return metrics
}
