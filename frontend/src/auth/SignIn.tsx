/**
 * SignIn - Sign-In Screen Component
 *
 * Mobile-first sign-in screen with Google OAuth.
 * Handles popup errors gracefully with user-friendly messages.
 */

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export function SignIn() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await login();
    } catch (err) {
      const error = err as { code?: string; message?: string };

      // Map Firebase error codes to user-friendly messages
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        {/* App Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {import.meta.env.VITE_APP_TITLE || 'Resolution Tracker'}
        </h1>
        <p className="text-gray-600 mb-8">Track your goals together</p>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Map Firebase error codes to user-friendly messages
 *
 * EDGE CASES HANDLED:
 * - Popup blocked: Browser blocks the sign-in popup
 * - Popup closed: User closes the popup without completing sign-in
 * - Network errors: User is offline or has connection issues
 * - No automatic retry: User must explicitly click to try again
 * - No redirects: Errors shown in-place
 */
function getErrorMessage(code?: string): string {
  switch (code) {
    // User intentionally cancelled
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return 'Sign-in was cancelled. Please try again.';

    // Popup blocked by browser
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';

    // Network issues
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';

    // Rate limiting
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';

    // Account issues
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';

    // OAuth configuration issues
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.';

    // Credential issues
    case 'auth/invalid-credential':
    case 'auth/account-exists-with-different-credential':
      return 'There was a problem with your credentials. Please try again.';

    // Unknown errors - generic message, no technical details
    default:
      return 'Sign-in failed. Please try again.';
  }
}
