import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import {
  getGroupsByUserId,
  createGroup as apiCreateGroup,
  deleteGroup as apiDeleteGroup,
  getOrCreateInviteToken,
  joinGroupByToken as apiJoinGroupByToken,
  getGroupMembers,
} from '@/api/groups.api'
import { isCacheStale } from '@/utils/cache'
import { normalizeById, extractIds } from '@/utils/normalize'
import type { GroupSummary, CreateGroupRequest, GroupMemberSummary } from '@/types'

type GroupStore = {
  groupsById: Record<number, GroupSummary>
  groupIdsByUserId: Record<number, number[]>
  membersByGroupId: Record<number, GroupMemberSummary[]>

  selectedGroupId: number | null

  loading: boolean
  error: string | null

  lastFetchedByUserId: Record<number, number>
  lastFetchedMembersByGroupId: Record<number, number>

  fetchGroupsByUserId: (userId: number) => Promise<void>
  fetchGroupMembersAsync: (groupId: number) => Promise<void>
  setSelectedGroup: (groupId: number) => void
  createGroup: (request: CreateGroupRequest) => Promise<GroupSummary>
  deleteGroup: (groupId: number, requestingUserId: number) => Promise<void>
  generateInviteToken: (groupId: number, requestingUserId: number) => Promise<string>
  joinGroupByToken: (token: string, userId: number) => Promise<GroupSummary>
  upsertGroup: (group: GroupSummary) => void
}

export const useGroupStore = create<GroupStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      groupsById: {},
      groupIdsByUserId: {},
      membersByGroupId: {},
      selectedGroupId: null,
      loading: false,
      error: null,
      lastFetchedByUserId: {},
      lastFetchedMembersByGroupId: {},

      fetchGroupsByUserId: async (userId: number) => {
        const lastFetched = get().lastFetchedByUserId[userId]
        if (!isCacheStale(lastFetched, 'groups')) return

        set({ loading: true, error: null })
        try {
          const groups = await getGroupsByUserId(userId)
          const normalized = normalizeById(groups)
          const ids = extractIds(groups)

          set((state) => {
            const selectedGroupId =
              state.selectedGroupId !== null ? state.selectedGroupId : (ids[0] ?? null)
            return {
              groupsById: { ...state.groupsById, ...normalized },
              groupIdsByUserId: { ...state.groupIdsByUserId, [userId]: ids },
              lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: Date.now() },
              selectedGroupId,
              loading: false,
            }
          })
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
        }
      },

      fetchGroupMembersAsync: async (groupId: number) => {
        const lastFetched = get().lastFetchedMembersByGroupId[groupId]
        if (!isCacheStale(lastFetched, 'groupMembers')) return

        try {
          const members = await getGroupMembers(groupId)
          set((state) => ({
            membersByGroupId: { ...state.membersByGroupId, [groupId]: members },
            lastFetchedMembersByGroupId: { ...state.lastFetchedMembersByGroupId, [groupId]: Date.now() },
          }))
        } catch (err) {
          console.error('[Groups] Failed to fetch members:', err)
        }
      },

      setSelectedGroup: (groupId: number) => set({ selectedGroupId: groupId }),

      createGroup: async (request: CreateGroupRequest) => {
        const group = await apiCreateGroup(request)
        get().upsertGroup(group)
        const userId = request.groupOwnerId
        set((state) => ({
          groupIdsByUserId: {
            ...state.groupIdsByUserId,
            [userId]: [...(state.groupIdsByUserId[userId] ?? []), group.id],
          },
          selectedGroupId: state.selectedGroupId ?? group.id,
        }))
        return group
      },

      deleteGroup: async (groupId: number, requestingUserId: number) => {
        await apiDeleteGroup(groupId, requestingUserId)
        set((state) => {
          const { [groupId]: _, ...groupsById } = state.groupsById
          const updatedIdsByUser: Record<number, number[]> = {}
          for (const [uid, ids] of Object.entries(state.groupIdsByUserId)) {
            updatedIdsByUser[Number(uid)] = ids.filter((id) => id !== groupId)
          }
          const remainingIds = Object.values(updatedIdsByUser).flat()
          const nextSelectedId =
            state.selectedGroupId === groupId ? (remainingIds[0] ?? null) : state.selectedGroupId
          return { groupsById, groupIdsByUserId: updatedIdsByUser, selectedGroupId: nextSelectedId }
        })
        // Invalidate cache so next fetch re-fetches
        set((state) => ({
          lastFetchedByUserId: Object.fromEntries(
            Object.entries(state.lastFetchedByUserId).map(([k]) => [k, 0])
          ),
        }))
      },

      generateInviteToken: async (groupId: number, requestingUserId: number) => {
        const response = await getOrCreateInviteToken(groupId, requestingUserId)
        return response.token
      },

      joinGroupByToken: async (token: string, userId: number) => {
        const group = await apiJoinGroupByToken(token, userId)
        get().upsertGroup(group)
        set((state) => {
          const existing = state.groupIdsByUserId[userId] ?? []
          const ids = existing.includes(group.id) ? existing : [...existing, group.id]
          return {
            groupIdsByUserId: { ...state.groupIdsByUserId, [userId]: ids },
            selectedGroupId: state.selectedGroupId ?? group.id,
            lastFetchedByUserId: { ...state.lastFetchedByUserId, [userId]: 0 },
          }
        })
        return group
      },

      upsertGroup: (group: GroupSummary) =>
        set((state) => ({
          groupsById: { ...state.groupsById, [group.id]: group },
        })),
    })),
    { name: 'GroupStore' }
  )
)
