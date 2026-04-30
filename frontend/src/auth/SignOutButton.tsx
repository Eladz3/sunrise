/**
 * SignOutButton - Reusable Sign Out Component
 *
 * On click, calls logout() from AuthProvider.
 * After sign-out, user state resets and AuthGate shows Sign-In screen.
 * No navigation logic - state change handles the UI switch.
 */

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className = '' }: SignOutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await logout();
      // After logout, user state becomes null
      // AuthGate will automatically show the Sign-In screen
    } catch (err) {
      console.error('Sign out failed:', err);
      setError('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing out...' : 'Sign out'}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
