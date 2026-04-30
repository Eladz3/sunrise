# Hooks

Custom React hooks used across the application.

## What belongs here:
- **Shared custom hooks** - Hooks used in multiple places
- **Firebase hooks** - Hooks for Firestore queries, real-time listeners
- **Calendar hooks** - Hooks for Google Calendar integration
- **Auth hooks** - If used outside auth context (e.g., useAuth)

## Examples:
- `useAuth.ts` - Access auth context and user state
- `useFirestore.ts` - Generic Firestore CRUD operations
- `useEvents.ts` - Fetch and manage events from Firestore
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
