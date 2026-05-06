# Services

Business logic and external API integrations.

## What belongs here:
- **REST API clients** - Functions to interact with the .NET backend API
- **Firebase Auth helpers** - Sign-in, sign-out, token retrieval
- **Google Calendar service** - Calendar API integration
- **Business logic** - Complex operations that don't fit in components

## Organization:
```
services/
├── api.ts                    # Axios/fetch base client with auth headers
├── goals.ts                  # Goals REST API calls
├── users.ts                  # Users REST API calls
├── firebase/
│   └── auth.ts               # Firebase Auth methods
└── calendar/
    └── googleCalendar.ts     # Google Calendar API
```

## Examples:
- `api.ts` - Base HTTP client that attaches Firebase ID tokens to requests
- `goals.ts` - `createGoal()`, `getGoals()`, `updateGoal()`, `deleteGoal()`
- `users.ts` - `createUser()`, `getUserByFirebaseUid()`
- `calendar/googleCalendar.ts` - `syncToCalendar()`, `getCalendarEvents()`

## Note:
- Services should be framework-agnostic (no React dependencies)
- Return promises for async operations
- Handle errors within services and throw meaningful errors
- Services are called by hooks or components
- Firebase is used for **auth only** — all data operations go through the REST API
