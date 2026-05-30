/**
 * Header Component
 *
 * App header with navigation and user menu.
 * Shows different options based on auth state.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, Button } from '@/dls'

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
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-sunrise-600 to-dawn-600 bg-clip-text text-xl font-bold text-transparent">Sunrise</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="font-medium text-gray-700 hover:text-sunrise-600">
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar displayName={user.displayName ?? user.email ?? '?'} profilePhoto={user.photoURL ?? undefined} size="sm" />
                    <span className="hidden text-sm text-gray-700 sm:block">{user.displayName}</span>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleLogout} loading={loggingOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="font-medium text-gray-700 hover:text-sunrise-600">
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
