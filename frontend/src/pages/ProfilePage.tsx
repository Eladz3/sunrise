import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DevPanel } from '@/components/dev/DevPanel'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await logout()
    } catch (err) {
      console.error('Sign out failed:', err)
      setSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6 pb-20">
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {user.photoURL ? <img src={user.photoURL} alt={user.displayName ?? 'Profile'} className="h-16 w-16 shrink-0 rounded-full border-2 border-white/50" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">{(user.displayName ?? user.email ?? '?')[0].toUpperCase()}</div>}
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">{user.displayName ?? 'User'}</h1>
              <p className="truncate text-sm text-sunrise-100">{user.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} disabled={signingOut} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/25 active:bg-white/30 disabled:opacity-50">
            {signingOut ? (
              'Signing out…'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </>
            )}
          </button>
        </div>
      </header>

      <section className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm">
        <div className="px-4 py-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Display Name</p>
          <p className="font-medium text-gray-800">{user.displayName ?? '—'}</p>
        </div>
        <div className="px-4 py-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Email</p>
          <p className="font-medium text-gray-800">{user.email ?? '—'}</p>
        </div>
      </section>

      {import.meta.env.DEV && <DevPanel />}
    </div>
  )
}
