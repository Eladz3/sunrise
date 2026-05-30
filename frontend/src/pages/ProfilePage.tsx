import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { THEME_OPTIONS } from '@/constants/theme.constants'
import { DevPanel } from '@/components/dev/DevPanel'
import { Avatar, Tabs } from '@/dls'

type ThemeValue = (typeof THEME_OPTIONS)[number]['value']

function ThemeIcon({ value }: { value: string }) {
  if (value === 'system')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  if (value === 'light')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    )
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { preference, changeTheme } = useTheme()
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

  const themeTabs = THEME_OPTIONS.map(({ value, label }) => ({
    key: value,
    label,
    icon: <ThemeIcon value={value} />,
  }))

  return (
    <div className="space-y-6 pb-20">
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar displayName={user.displayName ?? user.email ?? '?'} profilePhoto={user.photoURL ?? undefined} size="xl" className="shrink-0 border-2 border-white/50" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">{user.displayName ?? 'User'}</h1>
              <p className="truncate text-sm text-sunrise-100">{user.email}</p>
            </div>
          </div>
          {/* Glass-effect button on gradient — kept as raw button */}
          <button onClick={handleSignOut} disabled={signingOut} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/25 active:bg-white/30 disabled:opacity-50">
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

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="px-4 py-3">
          <p className="mb-3 text-xs uppercase tracking-wide text-gray-400">Appearance</p>
          <Tabs tabs={themeTabs} activeTab={preference} onChange={(key) => changeTheme(key as ThemeValue)} variant="pill" />
        </div>
      </section>

      {import.meta.env.DEV && <DevPanel />}
    </div>
  )
}
