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
 *     - Note: calendar.ts has separate OAuth for calendar scopes (not main auth)
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
} from 'react';
import { onAuthChange, signInWithGoogle, signOut } from './auth';
import type { User } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: This is the ONE AND ONLY onAuthStateChanged listener.
    // Do not create additional listeners elsewhere in the app.
    const unsubscribe = onAuthChange((authUser) => {
      // TEMPORARY: Debug logging for development only
      // TODO: Remove these logs before production release
      if (import.meta.env.DEV) {
        if (authUser) {
          console.log('[Auth Debug] User signed in:', {
            uid: authUser.uid,
            email: authUser.email,
          });
          // NOTE: Never log tokens or sensitive credentials
        } else {
          console.log('[Auth Debug] User signed out');
        }
      }

      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    await signInWithGoogle();
    // User state will be updated automatically via onAuthChange
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    // User state will be updated automatically via onAuthChange
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
