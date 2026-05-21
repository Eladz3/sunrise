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
import { Icon } from '@/components/ui/Icon';

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
            <Icon name="sunrise" size={36} className="text-white" />
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
          {!loading && <Icon name="google" size={20} />}
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
