import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { ThemePreference, ResolvedTheme } from '@/constants/theme.constants';

type ThemeStore = {
  preference: ThemePreference;
  resolved: ResolvedTheme;

  setPreference: (pref: ThemePreference) => void;
  setResolved: (theme: ResolvedTheme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        preference: 'system',
        resolved: 'light',

        setPreference: (pref) => set({ preference: pref }),
        setResolved: (theme) => set({ resolved: theme }),
      }),
      {
        name: 'theme-store',
        storage: createJSONStorage(() => localStorage),
        // Only persist the user's explicit preference, not the derived resolved value
        partialize: (state) => ({ preference: state.preference }),
      }
    ),
    { name: 'ThemeStore' }
  )
);
