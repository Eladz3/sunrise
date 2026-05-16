import { useMetricsStore } from '@/stores/metricsStore'

export type SyncEvent =
  | { type: 'goal:created'; userId: number; groupIds: number[] }
  | { type: 'goal:updated'; userId: number; groupIds: number[] }
  | { type: 'goal:deleted'; userId: number; groupIds: number[] }
  | { type: 'group:deleted'; userId: number; groupId: number }
  | { type: 'group:joined'; userId: number; groupId: number }

async function emit(event: SyncEvent): Promise<void> {
  const metrics = useMetricsStore.getState()

  switch (event.type) {
    case 'goal:created':
    case 'goal:updated':
    case 'goal:deleted': {
      metrics.invalidateUserMetrics(event.userId)
      for (const groupId of event.groupIds) {
        metrics.invalidateGroupMetrics(groupId)
      }
      // Dynamic import breaks the circular dep: groupStore → syncService → groupStore
      const { useGroupStore } = await import('@/stores/groupStore')
      const groupStore = useGroupStore.getState()
      for (const groupId of event.groupIds) {
        groupStore.invalidateGroupMembers(groupId)
        await groupStore.fetchGroupMembersAsync(groupId)
      }
      break
    }
    case 'group:deleted': {
      // Dynamic import breaks the otherwise-circular dep: goalStore → syncService → goalStore
      const { useGoalStore } = await import('@/stores/goalStore')
      useGoalStore.getState().invalidateGroupGoals(event.groupId)
      metrics.invalidateGroupMetrics(event.groupId)
      break
    }
    case 'group:joined': {
      metrics.invalidateGroupMetrics(event.groupId)
      break
    }
  }
}

export const syncService = { emit }
