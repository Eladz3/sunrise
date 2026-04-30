# Authentication Usage Guide

## Quick Start

### 1. Sign In with Google

```typescript
import { signInWithGoogle } from '@/auth/auth';

async function handleLogin() {
  try {
    const result = await signInWithGoogle();
    console.log('Signed in:', result.user.email);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### 2. Sign Out

```typescript
import { signOut } from '@/auth/auth';

async function handleLogout() {
  try {
    await signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

### 3. Get Current User

```typescript
import { getCurrentUser, isAuthenticated } from '@/auth/auth';

// Check if user is signed in
if (isAuthenticated()) {
  const user = getCurrentUser();
  console.log('Current user:', user?.email);
}
```

### 4. Listen to Auth State Changes

```typescript
import { useEffect } from 'react';
import { onAuthChange } from '@/auth/auth';

function MyComponent() {
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        console.log('User signed in:', user.email);
      } else {
        console.log('User signed out');
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return <div>My Component</div>;
}
```

## Available Functions

### Authentication

- **`signInWithGoogle()`** - Sign in with Google OAuth popup
- **`signOut()`** - Sign out current user
- **`getCurrentUser()`** - Get current user or null
- **`isAuthenticated()`** - Check if user is signed in
- **`onAuthChange(callback)`** - Subscribe to auth state changes
- **`toAuthUser(user)`** - Convert Firebase User to AuthUser

### Tokens

- **`getIdToken(forceRefresh?)`** - Get Firebase ID token for backend API
- **`getGoogleAccessToken()`** - Get Google OAuth token for Calendar API

## Next Steps

Create an AuthProvider component to wrap your app:

```typescript
// auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from './auth';
import type { User } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

Then wrap your app:

```typescript
// main.tsx
import { AuthProvider } from '@/auth/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## Google Calendar Scopes

The auth service requests these Calendar API scopes:
- `calendar.events` - Create and edit events
- `calendar.readonly` - Read calendar data

Access token is stored in `sessionStorage` and available via `getGoogleAccessToken()`.
