import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getUserMetrics, getGroupMetrics, getGlobalMetrics } from '@/api/metrics.api'
import { isCacheStale } from '@/utils/cache'
import type { GoalMetrics } from '@/types'

type MetricsStore = {
  userMetricsByUserId: Record<number, GoalMetrics>
  groupMetricsByGroupId: Record<number, GoalMetrics>
  globalMetrics: GoalMetrics | null

  loading: boolean
  error: string | null

  lastFetchedByUserId: Record<number, number>
  lastFetchedByGroupId: Record<number, number>
  globalLastFetched: number | null

  fetchUserMetrics: (userId: number) => Promise<void>
  fetchGroupMetrics: (groupId: number) => Promise<void>
  fetchGlobalMetrics: () => Promise<void>
  invalidateUserMetrics: (userId: number) => void
  invalidateGroupMetrics: (groupId: number) => void
}

export const useMetricsStore = create<MetricsStore>()(
  devtools(
    (set, get) => ({
      userMetricsByUserId: {},
      groupMetricsByGroupId: {},
      globalMetrics: null,
      loading: false,
      error: null,
      lastFetchedByUserId: {},
      lastFetchedByGroupId: {},
      globalLastFetched: null,

      fetchUserMetrics: async (userId: number) => {
        const lastFetched = get().lastFetchedByUserId[userId]
        if (!isCacheStale(lastFetched, 'metrics')) return

        set({ loading: true, error: null })
        try {
          const metrics = await getUserMetrics(userId)
          set((state) => ({
            userMetricsByUserId: { ...state.userMetricsByUserId, [userId]: metrics },
            lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: Date.now() },
            loading: false,
          }))
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      fetchGroupMetrics: async (groupId: number) => {
        const lastFetched = get().lastFetchedByGroupId[groupId]
        if (!isCacheStale(lastFetched, 'metrics')) return

        set({ loading: true, error: null })
        try {
          const metrics = await getGroupMetrics(groupId)
          set((state) => ({
            groupMetricsByGroupId: { ...state.groupMetricsByGroupId, [groupId]: metrics },
            lastFetchedByGroupId: { ...state.lastFetchedByGroupId, [groupId]: Date.now() },
            loading: false,
          }))
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      fetchGlobalMetrics: async () => {
        const lastFetched = get().globalLastFetched ?? undefined
        if (!isCacheStale(lastFetched, 'metrics')) return

        set({ loading: true, error: null })
        try {
          const metrics = await getGlobalMetrics()
          set({ globalMetrics: metrics, globalLastFetched: Date.now(), loading: false })
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      // Invalidation resets the cache timestamp, triggering a fresh fetch on next access
      invalidateUserMetrics: (userId: number) =>
        set((state) => ({
          lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: 0 },
        })),

      invalidateGroupMetrics: (groupId: number) =>
        set((state) => ({
          lastFetchedByGroupId: { ...state.lastFetchedByGroupId, [groupId]: 0 },
        })),
    }),
    { name: 'MetricsStore' }
  )
)
