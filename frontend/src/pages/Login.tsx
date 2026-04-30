/**
 * Login Page
 *
 * Allows users to sign in with Google OAuth.
 * Redirects to dashboard after successful login.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '@/auth/auth';
import { Button } from '@/components';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      await signInWithGoogle();

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sunrise-50 via-dawn-50 to-rose-50 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-sunrise-100">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Sun Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sunrise-400 to-dawn-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sunrise-600 to-dawn-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-warmGray-600">
            Sign in to continue your journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          loading={loading}
          className="w-full flex items-center justify-center gap-3"
          size="lg"
        >
          {!loading && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Sign in with Google
        </Button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-warmGray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
