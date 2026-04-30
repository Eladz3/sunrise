/**
 * AuthGate - Authentication Gatekeeper Component
 *
 * Controls access to the app based on authentication state.
 * No redirects, no routing - just explicit conditional rendering.
 */

import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { SignIn } from './SignIn';
import { Spinner } from '@/components/ui/Spinner';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();

  // STATE 1: Loading - Firebase is checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // STATE 2: Not authenticated - Show sign-in screen
  if (user === null) {
    return <SignIn />;
  }

  // STATE 3: Authenticated - Render protected content
  return <>{children}</>;
}
