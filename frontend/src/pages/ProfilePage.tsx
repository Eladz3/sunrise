import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@/components/ui/Icon';
import { DevPanel } from '@/components/dev/DevPanel';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Sign out failed:', err);
      setSigningOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20">
      <header className="rounded-2xl bg-gradient-to-br from-sunrise-500 via-dawn-500 to-rose-500 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Profile'}
                className="w-16 h-16 rounded-full border-2 border-white/50 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{user.displayName ?? 'User'}</h1>
              <p className="text-sm text-sunrise-100 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : (
              <>
                <Icon name="logout" size={15} />
                Sign Out
              </>
            )}
          </button>
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Display Name</p>
          <p className="text-gray-800 font-medium">{user.displayName ?? '—'}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
          <p className="text-gray-800 font-medium">{user.email ?? '—'}</p>
        </div>
      </section>

      {import.meta.env.DEV && <DevPanel />}

    </div>
  );
}
