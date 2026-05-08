# Sunrise — Codebase Guide

## Project Overview

Sunrise is a goals-tracking app. Users set personal goals (with a target value, unit, and category), track progress, and optionally participate in groups.

**Monorepo layout:**
```
sunrise/
├── frontend/          React 18 + TypeScript + Vite + Tailwind
├── SunriseApi/        .NET 9 Web API + EF Core + SQL Server
└── functions/         Firebase Cloud Functions (Google Calendar integration)
```

---

## Backend — SunriseApi

### Stack
| Concern | Choice |
|---------|--------|
| Runtime | .NET 9 (target: `net9.0`) |
| ORM | EF Core 8 with SQL Server provider |
| Mapping | AutoMapper 12 (Goal → GoalResponse) |
| Docs | Swagger/OpenAPI at `/swagger` (dev only) |

### Running the API
```bash
cd SunriseApi
dotnet run
# Listens on http://localhost:5000 (set in launchSettings.json)
```

### Database (SQL Server via Docker)
Connection string lives in `SunriseApi/appsettings.Development.json`:
```
Server=localhost,1433;Database=SunriseDb;User Id=sa;Password=CatsAreCute23!!;TrustServerCertificate=True
```

Start SQL Server:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=CatsAreCute23!!" \
  -p 1433:1433 --name sunrise-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

Apply migrations:
```bash
cd SunriseApi
dotnet ef database update
```

---

### Data Model

```
User
  Id (int PK)
  FirebaseUid (string)   ← maps Firebase Auth UID to SQL row
  Name (string)
  Email (string)
  Goals []               ← [JsonIgnore] on serialization
  UserGroups []          ← [JsonIgnore] on serialization

Goal
  Id (int PK)
  Title, Description (string)
  Category (GoalCategory enum, stored as string)
  TargetValue, CurrentValue (double)
  Unit (string)
  UserId (int FK → User)
  User (navigation)
  Year (int)
  CompletedOn (DateTime?)

Group
  Id (int PK)
  Name, BannerImage (string)
  UserGroups []           ← [JsonIgnore]

UserGroup  (join table)
  UserId + GroupId (composite PK)

BaseEntity (abstract base for all above)
  CreatedOn, ModifiedOn, DeletedOn, CreatedBy, ModifiedBy, DeletedBy
  DeletedOn != null = soft-deleted (global EF query filter excludes these)
```

**Enum `GoalCategory`:** Health, Fitness, Finance, Learning, Career, Relationships, Creativity, Mindfulness, Other

---

### API Endpoints

#### Users
| Method | Route | Body | Purpose |
|--------|-------|------|---------|
| POST | `/users/sync` | `{ firebaseUid, name, email }` | Upsert SQL user from Firebase auth. Call on every login. |

#### Goals
| Method | Route | Body | Purpose |
|--------|-------|------|---------|
| GET | `/goals` | — | All goals (community feed) |
| GET | `/goals/by-firebase-uid/{uid}` | — | Goals for current user |
| GET | `/goals-by-user-id/{userId}` | — | Goals by SQL user ID |
| GET | `/goals-by-group-id/{groupId}` | — | Goals for all users in a group |
| POST | `/goals` | `{ title, description, category, targetValue, currentValue, unit, year, firebaseUid }` | Create goal |
| PUT | `/goals/{goalId}` | `{ title?, description?, category?, targetValue?, currentValue?, unit?, year? }` | Partial update |
| DELETE | `/goals/{goalId}` | — | Soft-delete |

All goal endpoints return `GoalResponse` objects (not raw entity):
```json
{ "id": 1, "title": "...", "category": "Fitness", "targetValue": 100, "currentValue": 30,
  "unit": "km", "userId": 5, "userName": "Alice", "year": 2026 }
```

#### Groups
| Method | Route | Body | Purpose |
|--------|-------|------|---------|
| GET | `/groups-by-user-id/{userId}` | — | Groups the user belongs to |
| POST | `/groups` | `{ name, bannerImage }` | Create a group |

#### Metrics
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/metrics` | Global aggregated metrics |
| GET | `/metrics/by-user-id/{userId}` | Metrics for one user |
| GET | `/metrics/by-group-id/{groupId}` | Metrics for a group |

Returns `GoalMetrics`: `{ participantCount, totalGoalsCount, completedGoalsCount, progressPercentage }`

#### Health
| GET | `/health` | `{ status: "ok", timestamp }` |

---

### Key Files

| File | Purpose |
|------|---------|
| `Program.cs` | DI registration, CORS (`FrontendPolicy` allows localhost 5173/3000/4173), Swagger |
| `Data/AppDbContext.cs` | DbSets, soft-delete global filter, auto-timestamp on save |
| `Mapping/MappingProfile.cs` | `Goal → GoalResponse` (flattens `User.Name` → `UserName`) |
| `Models/Entities/` | Domain entities |
| `Models/Requests/` | `CreateNewGoalRequest`, `UpdateGoalRequest`, `SyncUserRequest`, `CreateNewGroupRequest` |
| `Models/Responses/` | `GoalResponse`, `GoalMetrics` |
| `Services/` | `GoalsService`, `GroupsService`, `MetricsService`, `UsersService` |
| `Migrations/` | EF migrations — run `dotnet ef database update` to apply |

---

## Frontend — frontend/

### Stack
React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Firebase Auth (Google OAuth)

### Running the frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Auth flow
1. User signs in via Google OAuth (`src/auth/AuthProvider.tsx`)
2. On auth state change, `syncUser()` is called → `POST /users/sync` creates the SQL user row
3. All subsequent API calls use `user.uid` (Firebase UID) to identify the user

### API client (`src/services/api.ts`)
- Base URL: `VITE_API_BASE_URL` env var, defaults to `http://localhost:5000`
- Sends Firebase ID token as `Authorization: Bearer <token>`
- Methods: `api.get`, `api.post`, `api.put`, `api.delete`

### Frontend → Backend service map
| Frontend service | File | Backend endpoint |
|-----------------|------|-----------------|
| `getUserByFirebaseUid` | `services/users.ts` | `GET /api/users/by-firebase-id/{uid}` |
| `syncBackendUser` | `services/users.ts` | `POST /api/users` (idempotent) |
| `getUserGoals` | `services/goals.ts` | `GET /goals-by-user-id/{sqlUserId}` |
| `getAllGoals` | `services/goals.ts` | `GET /goals` *(backend endpoint not yet implemented)* |
| `createGoal` | `services/goals.ts` | `POST /goals` |
| `updateGoal` | `services/goals.ts` | `PUT /goals/{id}` |
| `deleteGoal` | `services/goals.ts` | `DELETE /goals/{id}` |
| `getUserMetrics` | `services/metricsApi.ts` | `GET /metrics/by-user-id/{sqlUserId}` |

### Auth → SQL user ID bridge
`AuthProvider` calls `syncBackendUser` on every sign-in. The returned `ApiUser.id` (SQL integer) is stored as `sqlUserId` in auth context and exposed via `useAuth()`. All goal and metrics calls use this integer, not the Firebase UID string.

### Hooks consuming the API
- `useGoals(sqlUserId)` — personal goals CRUD with optimistic updates (`hooks/useGoals.ts`)
- `useUserMetrics(sqlUserId)` — fetches `progressPercentage` for the header bar (`hooks/useUserMetrics.ts`)
- `useCommunityGoals()` — calls `GET /goals` which is not yet implemented on the backend

---

## Known Gaps / TODO
- DELETE goal not yet wired to frontend UI
- Groups feature has no frontend UI
- Metrics endpoints unused in frontend
- `users.ts` Firestore service (streaks, leaderboard) still uses Firestore — not yet migrated to REST
- `stats.ts` Firestore service — not yet migrated to REST
- No JWT validation on the backend (backend accepts all requests without verifying the Firebase token)
