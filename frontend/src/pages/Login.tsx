/**
 * Login Page
 *
 * Full-screen sunset background with a frosted-glass sign-in card.
 * Redirects to dashboard after successful sign-in, or immediately if
 * already authenticated.
 */

import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/dls'
import { Icon } from '@/components/ui/Icon'

// Sunset gradient: deep violet sky → rich purple → crimson → vivid orange → warm amber → pale horizon
const SUNSET_GRADIENT = 'linear-gradient(to bottom, #0d0221 0%, #1a0533 10%, #6e1141 26%, #c0384a 43%, #e85d20 60%, #f4a032 76%, #fad278 90%, #fef0c7 100%)'

export default function Login() {
  const { user, loading, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // If already signed in, go straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignIn = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await login()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const e = err as { code?: string }
      setError(getErrorMessage(e.code))
    } finally {
      setIsLoading(false)
    }
  }

  // While Firebase is resolving auth state, show a minimal spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: SUNSET_GRADIENT }}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12" style={{ background: SUNSET_GRADIENT }}>
      {/* ── Card ── */}
      <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-md">
        {/* Card header band */}
        <div className="rounded-t-2xl bg-gradient-to-r from-sunrise-500 via-dawn-500 to-rose-500 px-8 py-6 text-center">
          {/* Sun icon */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 shadow-inner">
            <Icon name="sunrise" size={32} className="text-white drop-shadow" />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">Welcome to Sunrise</h1>
          <p className="mt-1 text-sm text-white/80">Sign in to continue your journey</p>
        </div>

        {/* Card body */}
        <div className="px-8 py-7">
          {/* Divider label */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-warmGray-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-warmGray-400">Sign in with</span>
            <div className="h-px flex-1 bg-warmGray-200" />
          </div>

          {/* Google Sign-In button */}
          <button onClick={handleSignIn} disabled={isLoading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-warmGray-200 bg-white px-4 py-3 text-sm font-medium text-warmGray-700 shadow-sm transition-all hover:border-sunrise-300 hover:bg-sunrise-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sunrise-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>{isLoading ? 'Signing in…' : 'Google'}</span>
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Back link */}
          <p className="mt-6 text-center text-sm text-warmGray-500">
            <Link to="/" className="font-medium text-sunrise-600 transition-colors hover:text-sunrise-700">
              ← Back to home
            </Link>
          </p>
        </div>

        {/* Card footer */}
        <div className="rounded-b-2xl border-t border-warmGray-100 bg-warmGray-50/60 px-8 py-4 text-center">
          <p className="text-xs text-warmGray-400">
            By signing in you agree to our{' '}
            <Link to="/terms-of-service" className="underline transition-colors hover:text-warmGray-600">
              Terms
            </Link>{' '}
            &amp;{' '}
            <Link to="/privacy-policy" className="underline transition-colors hover:text-warmGray-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Subtle page footer */}
      <p className="mt-8 text-xs text-white/40">&copy; {new Date().getFullYear()} Sunrise</p>
    </div>
  )
}

/**
 * Map Firebase error codes to user-friendly messages
 */
function getErrorMessage(code?: string): string {
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.'
    case 'auth/invalid-credential':
    case 'auth/account-exists-with-different-credential':
      return 'There was a problem with your credentials. Please try again.'
    default:
      return 'Sign-in failed. Please try again.'
  }
}
