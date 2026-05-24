import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((s) => s.preference);
  const setResolved = useThemeStore((s) => s.setResolved);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function apply() {
      const resolved =
        preference === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : preference;
      setResolved(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    }

    apply();

    if (preference === 'system') {
      mediaQuery.addEventListener('change', apply);
      return () => mediaQuery.removeEventListener('change', apply);
    }
  }, [preference, setResolved]);

  return <>{children}</>;
}
