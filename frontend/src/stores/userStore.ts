import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getUserByFirebaseUid } from '@/api/users.api'
import { isCacheStale } from '@/utils/cache'
import type { User } from '@/types'

type UserStore = {
  usersById: Record<number, User>
  firebaseUidToUserId: Record<string, number>

  loading: boolean
  error: string | null

  lastFetchedById: Record<number, number>

  fetchUserByFirebaseUid: (firebaseUid: string) => Promise<User>
  upsertUser: (user: User) => void
  removeUser: (userId: number) => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      usersById: {},
      firebaseUidToUserId: {},
      loading: false,
      error: null,
      lastFetchedById: {},

      fetchUserByFirebaseUid: async (firebaseUid: string) => {
        const existingId = get().firebaseUidToUserId[firebaseUid]
        if (existingId !== undefined) {
          const lastFetched = get().lastFetchedById[existingId]
          if (!isCacheStale(lastFetched, 'users')) {
            return get().usersById[existingId]
          }
        }

        set({ loading: true, error: null })
        try {
          const user = await getUserByFirebaseUid(firebaseUid)
          get().upsertUser(user)
          set((state) => ({
            firebaseUidToUserId: { ...state.firebaseUidToUserId, [firebaseUid]: user.id },
            lastFetchedById: { ...state.lastFetchedById, [user.id]: Date.now() },
            loading: false,
          }))
          return user
        } catch (err) {
          set({ loading: false, error: (err as Error).message })
          throw err
        }
      },

      upsertUser: (user: User) =>
        set((state) => ({
          usersById: { ...state.usersById, [user.id]: user },
        })),

      removeUser: (userId: number) =>
        set((state) => {
          const { [userId]: _, ...usersById } = state.usersById
          return { usersById }
        }),
    }),
    { name: 'UserStore' }
  )
)
