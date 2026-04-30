# Services

Business logic and external API integrations.

## What belongs here:
- **API clients** - Functions to interact with external APIs
- **Firebase services** - Firestore queries, Cloud Functions calls
- **Google Calendar service** - Calendar API integration
- **Business logic** - Complex operations that don't fit in components

## Organization:
```
services/
├── firebase/
│   ├── firestore.ts      # Firestore CRUD operations
│   └── auth.ts           # Firebase Auth methods
├── calendar/
│   └── googleCalendar.ts # Google Calendar API
└── api/
    └── [external-api].ts # Other external APIs
```

## Examples:
- `firebase/firestore.ts` - Functions like `createEvent()`, `getEvents()`, `updateUser()`
- `calendar/googleCalendar.ts` - `syncToCalendar()`, `getCalendarEvents()`
- `api/notifications.ts` - Send notifications via external service

## Note:
- Services should be framework-agnostic (no React dependencies)
- Return promises for async operations
- Handle errors within services and throw meaningful errors
- Services are called by hooks or components
