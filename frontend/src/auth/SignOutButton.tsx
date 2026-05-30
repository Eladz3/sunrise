/**
 * SignOutButton - Reusable Sign Out Component
 *
 * On click, calls logout() from AuthProvider.
 * After sign-out, user state resets and AuthGate shows Sign-In screen.
 * No navigation logic - state change handles the UI switch.
 */

import { useState } from 'react'
import { useAuth } from './useAuth'

interface SignOutButtonProps {
  className?: string
}

export function SignOutButton({ className = '' }: SignOutButtonProps) {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await logout()
      // After logout, user state becomes null
      // AuthGate will automatically show the Sign-In screen
    } catch (err) {
      console.error('Sign out failed:', err)
      setError('Failed to sign out. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <button onClick={handleSignOut} disabled={isLoading} className="rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? 'Signing out...' : 'Sign out'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
