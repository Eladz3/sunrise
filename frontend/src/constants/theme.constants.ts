export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_OPTIONS = [
  { value: 'system' as ThemePreference, label: 'System' },
  { value: 'light' as ThemePreference, label: 'Light' },
  { value: 'dark' as ThemePreference, label: 'Dark' },
] as const;
