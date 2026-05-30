import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { updateUser } from '@/api/users.api'
import type { ThemePreference } from '@/constants/theme.constants'

export function useTheme() {
  const preference = useThemeStore((s) => s.preference)
  const resolved = useThemeStore((s) => s.resolved)
  const setPreference = useThemeStore((s) => s.setPreference)

  const changeTheme = async (pref: ThemePreference) => {
    setPreference(pref)

    const userId = useAuthStore.getState().currentUserId
    if (userId) {
      try {
        await updateUser(userId, { themePreference: pref })
      } catch (err) {
        console.error('Failed to sync theme preference to account:', err)
      }
    }
  }

  return { preference, resolved, changeTheme }
}
