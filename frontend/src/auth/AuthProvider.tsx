/**
 * AuthProvider - Centralized Authentication State Management
 *
 * WHY CENTRALIZE AUTH?
 * --------------------
 * 1. SINGLE SOURCE OF TRUTH: All components read auth state from one place,
 *    preventing inconsistencies where different parts of the app have
 *    different views of whether a user is logged in.
 *
 * 2. ONE LISTENER: Firebase's onAuthStateChanged should only be called once.
 *    Multiple listeners can cause race conditions, memory leaks, and
 *    unpredictable state updates when auth changes.
 *
 * 3. ENCAPSULATION: Auth logic (login, logout, state management) is isolated
 *    here. UI components don't need to know about Firebase directly.
 *
 * 4. TESTABILITY: Mocking auth for tests is simpler when auth flows through
 *    a single context provider.
 *
 * AUTH ARCHITECTURE VERIFICATION CHECKLIST:
 * -----------------------------------------
 * [x] No Firebase auth calls outside the auth layer (src/auth/)
 *     - signInWithPopup: only in src/auth/auth.ts
 *     - signOut: only in src/auth/auth.ts
 *     - onAuthStateChanged: only in src/auth/auth.ts (wrapped as onAuthChange)
 *
 * [x] UI components consume auth via context only
 *     - Components use useAuth() hook, not Firebase directly
 *     - useAuth() is re-exported from @/hooks for convenience
 *
 * [x] AuthProvider is the single source of truth
 *     - Only ONE onAuthStateChanged listener (in this file)
 *     - All auth state flows through this context
 *     - Login/logout actions go through this provider
 *
 * [x] AuthGate controls access at the root level
 *     - Shows loading state while Firebase checks auth
 *     - Shows SignIn screen when not authenticated
 *     - Renders children when authenticated
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { onAuthChange, signInWithGoogle, signOut } from './auth'
import type { User } from 'firebase/auth'
import { syncBackendUser } from './users'
import { useAuthStore } from '@/stores/authStore'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Schedule a token refresh 5 minutes before the token's actual expiry.
  // Uses getIdTokenResult() to read the real expirationTime rather than assuming a fixed lifetime.
  // Reschedules itself after each refresh so the timing stays accurate across multiple cycles.
  useEffect(() => {
    if (!user) return

    let timeoutId: ReturnType<typeof setTimeout>

    async function scheduleRefresh() {
      try {
        const tokenResult = await user!.getIdTokenResult()
        const expiresAt = new Date(tokenResult.expirationTime).getTime()
        const delay = Math.max(expiresAt - Date.now() - 5 * 60 * 1000, 0)

        timeoutId = setTimeout(async () => {
          try {
            await user!.getIdToken(true)
            scheduleRefresh()
          } catch (error) {
            console.error('[Auth] Token refresh failed:', error)
          }
        }, delay)
      } catch (error) {
        console.error('[Auth] Failed to schedule token refresh:', error)
      }
    }

    scheduleRefresh()
    return () => clearTimeout(timeoutId)
  }, [user])

  useEffect(() => {
    // IMPORTANT: This is the ONE AND ONLY onAuthStateChanged listener.
    // Do not create additional listeners elsewhere in the app.
    const unsubscribe = onAuthChange(async (authUser) => {
      // TEMPORARY: Debug logging for development only
      // TODO: Remove these logs before production release
      if (import.meta.env.DEV) {
        if (authUser) {
          console.log('[Auth Debug] User signed in:', {
            uid: authUser.uid,
            email: authUser.email,
            photo: authUser.photoURL,
          })
          // NOTE: Never log tokens or sensitive credentials
        } else {
          console.log('[Auth Debug] User signed out')
        }
      }

      if (authUser) {
        try {
          await syncBackendUser(authUser)
          await useAuthStore.getState().bootstrapApplication(authUser.uid)
        } catch (error) {
          console.error('[Auth] Backend user sync failed:', error)
        }
      } else {
        useAuthStore.getState().logout()
      }

      setUser(authUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async () => {
    await signInWithGoogle()
    // User state will be updated automatically via onAuthChange
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    // User state will be updated automatically via onAuthChange
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 *
 * Access authentication state and methods from any component.
 * Must be used within AuthProvider.
 *
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
