# Auth

Authentication-related code and utilities.

## What belongs here:
- **Authentication context/providers** - React context for auth state
- **Auth guards/protectors** - Components that protect routes (e.g., RequireAuth)
- **Auth utilities** - Helper functions for auth operations (login, logout, token handling)

## Examples:
- `AuthProvider.tsx` - Context provider for auth state
- `AuthContext.ts` - Auth context definition
- `ProtectedRoute.tsx` - Route wrapper that requires authentication
- `useAuth.ts` - Hook for accessing auth context (goes in /hooks if used elsewhere)

## Note:
Firebase Auth initialization goes in `/config`
