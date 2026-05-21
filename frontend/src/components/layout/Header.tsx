/**
 * Header Component
 *
 * App header with navigation and user menu.
 * Shows different options based on auth state.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components'
import { Icon } from '@/components/ui/Icon'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-dawn-500 shadow-sm">
              <Icon name="sunrise" size={20} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-sunrise-600 to-dawn-600 bg-clip-text text-xl font-bold text-transparent">
              Sunrise
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-medium text-gray-700 hover:text-sunrise-600"
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="hidden text-sm text-gray-700 sm:block">
                      {user.displayName}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    loading={loggingOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="font-medium text-gray-700 hover:text-sunrise-600"
                >
                  Home
                </Link>
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
