# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sunrise is a full-stack goal-tracking app. The repo has two independent projects:
- `frontend/` — React 18 + Vite + TypeScript SPA
- `SunriseApi/` — ASP.NET Core 8 Web API, deployed as an AWS Lambda function

---

## Frontend

### Commands (run from `frontend/`)
```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # tsc + vite build
npm run tc           # Type-check only (no emit)
npm run lint         # ESLint (zero warnings policy)
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier
```

### Architecture

**State management — Zustand stores** (`src/stores/`)

Five domain stores, each with normalized entity maps and TTL-based cache timestamps:

| Store | Owns | TTL |
|---|---|---|
| `authStore` | Firebase token, currentUserId, bootstrap | persisted to sessionStorage |
| `userStore` | usersById, firebaseUidToUserId | 10 min |
| `goalStore` | goalsById, goalIdsByUserId, goalIdsByGroupId | 2 min |
| `groupStore` | groupsById, groupIdsByUserId, membersByGroupId | 5 min (members: 2 min) |
| `metricsStore` | userMetrics, groupMetrics, globalMetrics | 30 sec |

Cache staleness is checked via `isCacheStale(lastFetched, domain)` from `src/utils/cache.ts` using TTLs defined in `src/constants/cache.constants.ts`. Every fetch method checks staleness and returns early if fresh — this is intentional pull-on-demand behavior.

**SyncService — cross-store invalidation** (`src/services/syncService.ts`)

`syncService.emit(event)` is the single source of truth for what data needs to refresh after a mutation. All store mutations that affect other stores must call it instead of importing sibling stores directly.

Current event → invalidation mapping:
- `goal:created / goal:updated / goal:deleted` → invalidates user metrics + group metrics for all the user's groups
- `group:deleted` → invalidates goal cache for that group + group metrics
- `group:joined` → invalidates group metrics (groupStore self-invalidates its own member/user cache inline)

**Rule: any time you add a mutation to a store that affects data owned by another store, add a `syncService.emit()` call — do not import the target store directly.** Use a dynamic `import()` in `syncService.ts` itself only when needed to break circular deps (see the `group:deleted` handler as an example).

To add a new event:
1. Add its type to the `SyncEvent` union in `syncService.ts`
2. Add a `case` in the `emit` switch that calls the appropriate `invalidate*` methods
3. Add `invalidate*` methods to the target store if they don't exist yet
4. Call `syncService.emit(...)` from the mutating store method after the API call succeeds

**Auth flow**

`AuthProvider` (`src/auth/AuthProvider.tsx`) holds the single `onAuthStateChanged` listener. On sign-in it calls `useAuthStore.bootstrapApplication(firebaseUid)`, which sequentially hydrates all stores. Do not create additional Firebase auth listeners anywhere else.

The Firebase token is injected automatically by the API client (`src/api/client.ts`) on every request. On 401, the client retries once with a force-refreshed token.

**Hooks layer** (`src/hooks/`)

Components should consume data through hooks, not stores directly. High-level hooks (`useGoals`, `useCurrentUser`) combine auth context + store state. Selector hooks (`useUserGoals`, `useGroupGoals`, `useUserMetrics`) derive data from stores using `useShallow` for array stability.

**Path alias**: `@/` maps to `src/`.

---

## Backend

### Commands (run from `SunriseApi/`)
```bash
dotnet run                         # Start API (localhost:5000)
dotnet build                       # Build
dotnet ef migrations add <Name>    # Add EF migration
dotnet ef database update          # Apply migrations
```

Swagger UI is available at `/swagger` in non-production environments.

### Architecture

**Request pipeline**: `FirebaseAuthMiddleware` → controllers → services → EF Core

All routes except `/swagger` and `/health` require a valid Firebase JWT in the `Authorization: Bearer` header. The decoded token is available via `context.Items["User"]`.

**Pattern**: Thin controllers delegate entirely to scoped services (`IGoalsService`, `IGroupsService`, etc.). AutoMapper handles entity → response DTO mapping via `MappingProfile`.

**Database**: SQL Server via EF Core. Connection string is `SunriseSQLDatabaseConnectionString` in configuration.

**CORS**: Allowed origins are centralized in `Constants/CorsOrigins.cs`. Both `AddCors` and the exception handler's manual CORS logic reference `CorsOrigins.All` — add new origins there only.

**Deployment**: Runs inside AWS Lambda via `AddAWSLambdaHosting(LambdaEventSource.HttpApi)`. HTTPS redirect is only enabled in production.
