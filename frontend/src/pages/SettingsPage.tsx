import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const [imgError, setImgError] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-3 py-4">
        {user?.photoURL && !imgError ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'Profile'}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-24 w-24 rounded-full object-cover shadow-md ring-4 ring-white"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sunrise-100 shadow-md ring-4 ring-white">
            <svg
              className="h-12 w-12 text-sunrise-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        {user?.displayName && (
          <p className="text-xl font-semibold text-gray-800">{user.displayName}</p>
        )}
        {user?.email && (
          <p className="text-sm text-warmGray-500">{user.email}</p>
        )}
      </div>

      {/* Sign out */}
      <div className="rounded-xl bg-white shadow-sm">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-4 text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors"
        >
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
