import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { getGoalsByUserId, getGoalsByGroupId, createGoal as apiCreateGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '@/api/goals.api'
import { isCacheStale } from '@/utils/cache'
import { normalizeById, extractIds } from '@/utils/normalize'
import { useGroupStore } from './groupStore'
import { syncService } from '@/services/syncService'
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
  upsertGoal: (goal: Goal, opts?: { replacingId?: number }) => void
  removeGoal: (goalId: number) => void
  invalidateUserGoals: (userId: number) => void
  invalidateGroupGoals: (groupId: number) => void
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

        const userGroupIds = useGroupStore.getState().groupIdsByUserId[userId] ?? []

        set((state) => {
          const updatedIdsByGroup: Record<number, number[]> = {}
          for (const groupId of userGroupIds) {
            updatedIdsByGroup[groupId] = [...(state.goalIdsByGroupId[groupId] ?? []), tempId]
          }
          return {
            goalsById: { ...state.goalsById, [tempId]: optimisticGoal },
            goalIdsByUserId: {
              ...state.goalIdsByUserId,
              [userId]: [...(state.goalIdsByUserId[userId] ?? []), tempId],
            },
            goalIdsByGroupId: { ...state.goalIdsByGroupId, ...updatedIdsByGroup },
            pendingGoalIds: [...state.pendingGoalIds, tempId],
          }
        })

        try {
          const created = await apiCreateGoal({ ...goalData, userId, firebaseUid })
          get().upsertGoal(created, { replacingId: tempId })
          await syncService.emit({ type: 'goal:created', userId, groupIds: userGroupIds })
        } catch (err) {
          set((state) => {
            const { [tempId]: _, ...goalsById } = state.goalsById
            const updatedIdsByGroup: Record<number, number[]> = {}
            for (const groupId of userGroupIds) {
              updatedIdsByGroup[groupId] = (state.goalIdsByGroupId[groupId] ?? []).filter((id) => id !== tempId)
            }
            return {
              goalsById,
              goalIdsByUserId: {
                ...state.goalIdsByUserId,
                [userId]: (state.goalIdsByUserId[userId] ?? []).filter((id) => id !== tempId),
              },
              goalIdsByGroupId: { ...state.goalIdsByGroupId, ...updatedIdsByGroup },
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
          get().upsertGoal(updated) // updates map + indexes + clears from pendingGoalIds
          const groupIds = useGroupStore.getState().groupIdsByUserId[original.userId] ?? []
          await syncService.emit({ type: 'goal:updated', userId: original.userId, groupIds })
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

          const groupIds = useGroupStore.getState().groupIdsByUserId[original.userId] ?? []
          await syncService.emit({ type: 'goal:deleted', userId: original.userId, groupIds })
        } catch (err) {
          // Rollback — upsertGoal re-adds to all indexes and clears from pendingGoalIds
          get().upsertGoal(original)
          set({ error: (err as Error).message })
        }
      },

      upsertGoal: (goal: Goal, opts?: { replacingId?: number }) => {
        const groupIds = useGroupStore.getState().groupIdsByUserId[goal.userId] ?? []
        set((state) => {
          // Build goalsById — remove the temp/old entry, add the confirmed one
          let goalsById: Record<number, Goal>
          if (opts?.replacingId != null) {
            const { [opts.replacingId]: _removed, ...rest } = state.goalsById
            goalsById = { ...rest, [goal.id]: goal }
          } else {
            goalsById = { ...state.goalsById, [goal.id]: goal }
          }

          // Update the userId → goalIds index
          const userIds = (state.goalIdsByUserId[goal.userId] ?? []).filter(
            (id) => id !== opts?.replacingId && id !== goal.id
          )
          const goalIdsByUserId = { ...state.goalIdsByUserId, [goal.userId]: [...userIds, goal.id] }

          // Update every group index the user belongs to
          const goalIdsByGroupId = { ...state.goalIdsByGroupId }
          for (const gid of groupIds) {
            const existing = (goalIdsByGroupId[gid] ?? []).filter(
              (id) => id !== opts?.replacingId && id !== goal.id
            )
            goalIdsByGroupId[gid] = [...existing, goal.id]
          }

          // Clear both the confirmed ID and any temp ID from pendingGoalIds
          const pendingGoalIds = state.pendingGoalIds.filter(
            (id) => id !== goal.id && (opts?.replacingId == null || id !== opts.replacingId)
          )

          return { goalsById, goalIdsByUserId, goalIdsByGroupId, pendingGoalIds }
        })
      },

      removeGoal: (goalId: number) =>
        set((state) => {
          const { [goalId]: removed, ...goalsById } = state.goalsById
          if (!removed) return {}

          const updatedIdsByUser = { ...state.goalIdsByUserId }
          if (removed.userId !== undefined) {
            updatedIdsByUser[removed.userId] = (updatedIdsByUser[removed.userId] ?? []).filter((id) => id !== goalId)
          }

          const updatedIdsByGroup: Record<number, number[]> = {}
          for (const [groupId, ids] of Object.entries(state.goalIdsByGroupId)) {
            updatedIdsByGroup[Number(groupId)] = ids.filter((id) => id !== goalId)
          }

          return { goalsById, goalIdsByUserId: updatedIdsByUser, goalIdsByGroupId: updatedIdsByGroup }
        }),

      invalidateUserGoals: (userId: number) =>
        set((state) => ({
          lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: 0 },
        })),

      invalidateGroupGoals: (groupId: number) =>
        set((state) => ({
          lastFetchedByGroupId: { ...state.lastFetchedByGroupId, [groupId]: 0 },
        })),
    })),
    { name: 'GoalStore' }
  )
)
