import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'
import { onAuthChange, signInWithGoogle, signOut, getIdToken } from '@/auth/auth'
import { getUserByFirebaseUid } from '@/api/users.api'

type AuthStore = {
  firebaseToken: string | null
  currentUserId: number | null

  isAuthenticated: boolean
  isInitializing: boolean
  authInitialized: boolean

  initializeAuth: () => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  bootstrapApplication: (firebaseUid: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          firebaseToken: null,
          currentUserId: null,
          isAuthenticated: false,
          isInitializing: true,
          authInitialized: false,

          initializeAuth: () => {
            const unsubscribe = onAuthChange(async (firebaseUser) => {
              if (firebaseUser) {
                const token = await getIdToken()
                set({
                  firebaseToken: token,
                  isAuthenticated: true,
                })
                await get().bootstrapApplication(firebaseUser.uid)
              } else {
                set({
                  firebaseToken: null,
                  currentUserId: null,
                  isAuthenticated: false,
                  isInitializing: false,
                  authInitialized: true,
                })
              }
            })
            // Store unsubscribe so callers can clean up if needed
            return unsubscribe
          },

          loginWithGoogle: async () => {
            await signInWithGoogle()
            // Auth state change handled by initializeAuth listener
          },

          logout: async () => {
            await signOut()
            set({
              firebaseToken: null,
              currentUserId: null,
              isAuthenticated: false,
              authInitialized: true,
            })
          },

          bootstrapApplication: async (firebaseUid: string) => {
            try {
              set({ isInitializing: true })

              // Fetch internal user record
              const user = await getUserByFirebaseUid(firebaseUid)

              // Hydrate user store
              const { useUserStore } = await import('./userStore')
              useUserStore.getState().upsertUser(user)
              set({ currentUserId: user.id })

              // Hydrate groups
              const { useGroupStore } = await import('./groupStore')
              await useGroupStore.getState().fetchGroupsByUserId(user.id)

              // Hydrate goals
              const { useGoalStore } = await import('./goalStore')
              await useGoalStore.getState().fetchGoalsByUserId(user.id)

              // Hydrate metrics
              const { useMetricsStore } = await import('./metricsStore')
              await useMetricsStore.getState().fetchUserMetrics(user.id)

              set({ isInitializing: false, authInitialized: true })
            } catch (err) {
              console.error('Bootstrap failed:', err)
              set({ isInitializing: false, authInitialized: true })
            }
          },
        }),
        {
          name: 'auth-store',
          storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({
            firebaseToken: state.firebaseToken,
            currentUserId: state.currentUserId,
          }),
        }
      )
    ),
    { name: 'AuthStore' }
  )
)
