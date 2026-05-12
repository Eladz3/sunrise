import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { getGoalsByUserId, getGoalsByGroupId, createGoal as apiCreateGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '@/api/goals.api'
import { isCacheStale } from '@/utils/cache'
import { normalizeById, extractIds } from '@/utils/normalize'
import type { Goal, CreateGoalRequest, UpdateGoalRequest } from '@/types'

type GoalStore = {
  goalsById: Record<number, Goal>
  goalIdsByUserId: Record<number, number[]>
  goalIdsByGroupId: Record<number, number[]>

  loading: boolean
  error: string | null

  pendingGoalIds: number[]

  lastFetchedByUserId: Record<number, number>
  lastFetchedByGroupId: Record<number, number>

  fetchGoalsByUserId: (userId: number) => Promise<void>
  fetchGoalsByGroupId: (groupId: number) => Promise<void>
  createGoal: (request: CreateGoalRequest & { firebaseUid: string; userId: number }) => Promise<void>
  updateGoal: (goalId: number, request: UpdateGoalRequest) => Promise<void>
  deleteGoal: (goalId: number) => Promise<void>
  upsertGoal: (goal: Goal) => void
  removeGoal: (goalId: number) => void
}

export const useGoalStore = create<GoalStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      goalsById: {},
      goalIdsByUserId: {},
      goalIdsByGroupId: {},
      loading: false,
      error: null,
      pendingGoalIds: [],
      lastFetchedByUserId: {},
      lastFetchedByGroupId: {},

      fetchGoalsByUserId: async (userId: number) => {
        const lastFetched = get().lastFetchedByUserId[userId]
        if (!isCacheStale(lastFetched, 'goals')) return

        set({ loading: true, error: null })
        try {
          const goals = await getGoalsByUserId(userId)
          set((state) => ({
            goalsById: { ...state.goalsById, ...normalizeById(goals) },
            goalIdsByUserId: { ...state.goalIdsByUserId, [userId]: extractIds(goals) },
            lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: Date.now() },
            loading: false,
          }))
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      fetchGoalsByGroupId: async (groupId: number) => {
        const lastFetched = get().lastFetchedByGroupId[groupId]
        if (!isCacheStale(lastFetched, 'goals')) return

        set({ loading: true, error: null })
        try {
          const goals = await getGoalsByGroupId(groupId)
          set((state) => ({
            goalsById: { ...state.goalsById, ...normalizeById(goals) },
            goalIdsByGroupId: { ...state.goalIdsByGroupId, [groupId]: extractIds(goals) },
            lastFetchedByGroupId: { ...state.lastFetchedByGroupId, [groupId]: Date.now() },
            loading: false,
          }))
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      createGoal: async (request) => {
        const { userId, firebaseUid, ...goalData } = request

        // Optimistic update with a temporary negative ID (avoids collisions with real IDs)
        const tempId = -Date.now()
        const optimisticGoal: Goal = {
          id: tempId,
          ...goalData,
          userId,
          currentValue: 0,
          completedOn: null,
          createdOn: new Date().toISOString(),
          createdBy: userId,
        }

        set((state) => ({
          goalsById: { ...state.goalsById, [tempId]: optimisticGoal },
          goalIdsByUserId: {
            ...state.goalIdsByUserId,
            [userId]: [...(state.goalIdsByUserId[userId] ?? []), tempId],
          },
          pendingGoalIds: [...state.pendingGoalIds, tempId],
        }))

        try {
          const created = await apiCreateGoal({ ...goalData, userId, firebaseUid })

          set((state) => {
            const { [tempId]: _, ...rest } = state.goalsById
            const ids = (state.goalIdsByUserId[userId] ?? []).filter((id) => id !== tempId)
            return {
              goalsById: { ...rest, [created.id]: created },
              goalIdsByUserId: { ...state.goalIdsByUserId, [userId]: [...ids, created.id] },
              pendingGoalIds: state.pendingGoalIds.filter((id) => id !== tempId),
            }
          })

          // Invalidate metrics
          const { useMetricsStore } = await import('./metricsStore')
          useMetricsStore.getState().invalidateUserMetrics(userId)
        } catch (err) {
          // Rollback
          set((state) => {
            const { [tempId]: _, ...goalsById } = state.goalsById
            return {
              goalsById,
              goalIdsByUserId: {
                ...state.goalIdsByUserId,
                [userId]: (state.goalIdsByUserId[userId] ?? []).filter((id) => id !== tempId),
              },
              pendingGoalIds: state.pendingGoalIds.filter((id) => id !== tempId),
              error: (err as Error).message,
            }
          })
        }
      },

      updateGoal: async (goalId: number, request: UpdateGoalRequest) => {
        const original = get().goalsById[goalId]
        if (!original) return

        // Optimistic update
        set((state) => ({
          goalsById: { ...state.goalsById, [goalId]: { ...original, ...request } },
          pendingGoalIds: [...state.pendingGoalIds, goalId],
        }))

        try {
          const updated = await apiUpdateGoal(goalId, request)
          set((state) => ({
            goalsById: { ...state.goalsById, [goalId]: updated },
            pendingGoalIds: state.pendingGoalIds.filter((id) => id !== goalId),
          }))

          // Invalidate metrics
          const { useMetricsStore } = await import('./metricsStore')
          useMetricsStore.getState().invalidateUserMetrics(original.userId)
        } catch (err) {
          // Rollback
          set((state) => ({
            goalsById: { ...state.goalsById, [goalId]: original },
            pendingGoalIds: state.pendingGoalIds.filter((id) => id !== goalId),
            error: (err as Error).message,
          }))
        }
      },

      deleteGoal: async (goalId: number) => {
        const original = get().goalsById[goalId]
        if (!original) return

        // Optimistic removal
        get().removeGoal(goalId)
        set((state) => ({
          pendingGoalIds: [...state.pendingGoalIds, goalId],
        }))

        try {
          await apiDeleteGoal(goalId)
          set((state) => ({
            pendingGoalIds: state.pendingGoalIds.filter((id) => id !== goalId),
          }))

          // Invalidate metrics
          const { useMetricsStore } = await import('./metricsStore')
          useMetricsStore.getState().invalidateUserMetrics(original.userId)
        } catch (err) {
          // Rollback
          get().upsertGoal(original)
          set((state) => ({
            pendingGoalIds: state.pendingGoalIds.filter((id) => id !== goalId),
            error: (err as Error).message,
          }))
        }
      },

      upsertGoal: (goal: Goal) =>
        set((state) => ({
          goalsById: { ...state.goalsById, [goal.id]: goal },
        })),

      removeGoal: (goalId: number) =>
        set((state) => {
          const { [goalId]: removed, ...goalsById } = state.goalsById
          if (!removed) return {}

          const updatedIdsByUser = { ...state.goalIdsByUserId }
          if (removed.userId !== undefined) {
            updatedIdsByUser[removed.userId] = (updatedIdsByUser[removed.userId] ?? []).filter((id) => id !== goalId)
          }

          return { goalsById, goalIdsByUserId: updatedIdsByUser }
        }),
    })),
    { name: 'GoalStore' }
  )
)
