# Hooks

Custom React hooks used across the application.

## What belongs here:
- **Shared custom hooks** - Hooks used in multiple places
- **API data hooks** - Hooks that fetch/mutate data via the REST API
- **Calendar hooks** - Hooks for Google Calendar integration
- **Auth hooks** - If used outside auth context (e.g., useAuth)

## Examples:
- `useAuth.ts` - Access auth context and user state
- `useGoals.ts` - Fetch and manage goals via the REST API
- `useCalendar.ts` - Google Calendar integration
- `useDebounce.ts` - Debounce utility hook
- `useLocalStorage.ts` - Local storage synchronization

## Naming convention:
- Always prefix with `use` (React convention)
- Name describes what the hook provides or does
- Keep hooks focused on a single responsibility

## Note:
- Page-specific hooks go in `/pages/[page-name]/hooks`
- Export all hooks from `index.ts` for easier imports
