/**
 * AuthGate - Authentication Gatekeeper Component
 *
 * Controls access to the app based on authentication state.
 * No routing logic in children — just explicit conditional rendering/redirect.
 */

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
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

  // STATE 2: Not authenticated - Redirect to login page
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // STATE 3: Authenticated - Render protected content
  return <>{children}</>;
}
