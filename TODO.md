# Sunrise — TODO

## Backend Integration

### Auth / Token Verification

- [ ] **Firebase JWT verification middleware**: All protected REST endpoints must verify the Firebase ID token sent as `Authorization: Bearer <token>`. Install `FirebaseAdmin` NuGet package, initialize `FirebaseApp` with service account credentials, and call `FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token)` in middleware or a filter. Reject requests with missing/invalid tokens with 401.
- [ ] **Extract `uid` from verified token**: After verification, read `decodedToken.Uid` and attach it to the request context (e.g. `HttpContext.Items["uid"]`) so controllers can identify the caller without trusting client-supplied user IDs.

### Critical

- [ ] **Firebase UID → SQL User ID mapping**: Backend uses integer SQL user IDs; frontend identifies users by Firebase UID. Need either a dedicated lookup endpoint (`GET /users/by-firebase-uid/{uid}`) or a user sync endpoint that creates/returns a SQL user record on first sign-in.
- [ ] **`GET /goals/by-firebase-uid/{uid}` endpoint missing**: `frontend/src/services/goals.ts` calls this endpoint but it does not exist on the backend. Backend only has `GET /goals-by-user-id/{userId}` (integer ID). This breaks all goal loading.
- [ ] **User creation on sign-in**: When a Firebase user signs in for the first time, a corresponding SQL user record must be created (or confirmed to exist) before any goal operations can succeed.

### High

- [ ] **`Dashboard.tsx` references non-existent hook functions**: `markComplete()`, `deleteGoal()`, and `updateGoalStatus()` are called in [frontend/src/pages/Dashboard.tsx](frontend/src/pages/Dashboard.tsx) but do not exist in the `useGoals` hook. Either implement them or remove Dashboard.
- [ ] **Dashboard.tsx is unreachable**: `AppLayout.tsx` routes to `HomePage` and `MyGoalsPage`, never to `Dashboard`. Decide whether to integrate or remove it.
- [ ] **`DELETE /goals/{goalId}` not wired to frontend**: Backend has a soft-delete endpoint but the frontend has no delete functionality exposed to the user.
- [ ] **Groups feature has no frontend**: Backend has `GroupsController` (`GET /groups-by-user-id`, `POST /groups`) with no corresponding frontend pages, hooks, or services.
- [ ] **Metrics endpoints unused**: `MetricsController` exposes per-user and per-group metrics but nothing in the frontend fetches or displays them.

### Medium

- [ ] **Migrate `frontend/src/services/users.ts` off Firestore**: Currently reads/writes user profiles directly to Firestore. Replace with REST API calls once a `/users` endpoint exists on the backend.
- [ ] **Migrate `frontend/src/services/stats.ts` off Firestore**: Currently reads/writes global stats directly to Firestore. Replace with calls to the backend `MetricsController` endpoints.
- [ ] **Remove Firestore SDK from frontend**: Once the service migrations above are done, remove `firebase/firestore` imports and the Firestore initializer from `config/firebase.ts`. Firebase should be auth-only.
- [ ] **`AuthProvider.tsx` debug logs**: Remove the `console.log` statements marked `TODO` at [frontend/src/auth/AuthProvider.tsx:76](frontend/src/auth/AuthProvider.tsx#L76) before production.

### Low

- [ ] **Remove duplicate `resolutions.ts`**: [frontend/src/services/resolutions.ts](frontend/src/services/resolutions.ts) is identical to `goals.ts` and unused — delete it.
- [ ] **Remove orphaned mock data files**: [frontend/src/data/mockGoals.ts](frontend/src/data/mockGoals.ts) and [frontend/src/data/mockResolutions.ts](frontend/src/data/mockResolutions.ts) are not imported anywhere — delete them.

---

## Real-Time (SignalR)

### Backend — Setup *(prerequisite for all items below)*

- [ ] **Add SignalR to the .NET backend**: Install `Microsoft.AspNetCore.SignalR` and register it in `Program.cs` / `Startup.cs`. Map at least one hub endpoint (e.g. `/hubs/goals`).

### Backend — Hubs & Events

- [ ] **`GoalsHub`**: Broadcast goal-created, goal-updated, and goal-deleted events to relevant clients (per-user and per-group channels).
- [ ] **`MetricsHub`**: Push live community/group metric updates so progress bars update without polling.
- [ ] **Auth on hubs**: Validate the Firebase JWT on SignalR connection (same auth middleware as REST endpoints).

### Frontend — Setup *(prerequisite for all items below)*

- [ ] **Add `@microsoft/signalr` client**: Install the npm package and create a singleton connection manager (connect on sign-in, disconnect on sign-out, auto-reconnect on drop).

### Frontend — Integration

- [ ] **Live goal list**: Subscribe to `GoalsHub` and update the `useGoals` hook state in real time instead of requiring a manual refresh.
- [ ] **Live community progress**: Subscribe to `MetricsHub` so `CommunityProgressBar` reflects changes as other users log progress.
- [ ] **Presence / activity feed** *(stretch)*: Show when group members update goals (e.g. "Alice just hit 50% on Run a 5K").
- [ ] **Connection status indicator**: Display a subtle banner or icon when the SignalR connection is lost or reconnecting.

---

## Frontend — Incomplete Features

- [ ] **Goal delete UI**: No delete button or confirm dialog exists in `MyGoalsPage` / `GoalCard`.
- [ ] **Goal progress updates**: No way for a user to update `currentValue` on an existing goal (only full edits via the modal).
- [ ] **Community / social view**: `HomePage` lists goals by user and by goal but has no interaction (no liking, commenting, or following).
- [ ] **Groups / team goals**: Backend supports groups; frontend has no UI for creating, joining, or viewing group goals.
- [ ] **Metrics / stats dashboard**: Backend exposes metrics endpoints; no frontend chart or summary screen consumes them.
- [ ] **Calendar integration**: `frontend/src/services/calendar.ts` calls Firebase Cloud Functions (`connectCalendar`, `syncGoalToCalendar`, etc.) but there is no UI surface for this feature.
- [ ] **Error states**: Most pages show a spinner but no meaningful error message when API calls fail.
- [ ] **Empty states**: Goal list has no styled empty-state illustration or CTA when a user has zero goals.
- [ ] **Loading skeletons**: Spinner-only loading; no skeleton screens for goal cards or stats.
- [ ] **Pagination / infinite scroll**: `GET /goals` fetches all goals with no pagination — will not scale.
- [ ] **Goal categories filter/sort**: No UI to filter or sort goals by category, status, or date on `MyGoalsPage`.
- [ ] **Offline / network error handling**: No retry logic or offline indicator anywhere in the app.
- [ ] **Sign-out / user settings flow**: No sign-out button or user settings screen exists. Needs a profile menu or settings page covering: sign out, display name, avatar, notification preferences, connected calendar, and account deletion.

---

## Design System

### Tokenized Design Language System

- [ ] Define and implement a complete design token set (spacing, typography scale, border radii, shadow levels, motion durations) as CSS custom properties or a JS/TS token file.
- [ ] Replace all hardcoded pixel/color values in components with token references.

### Color Library

- [ ] Establish a semantic color palette (primary, secondary, success, warning, error, neutral) on top of the raw token set.
- [ ] Ensure all category badge colors, status indicators, and interactive states use palette tokens.

### Icon Library

- [ ] Choose and integrate an icon library (e.g. Lucide, Phosphor, or a custom SVG sprite).
- [ ] Replace any text-only buttons and emoji placeholders with proper icons.

### Theming

- [ ] Refactor the current CSS approach to support runtime theme switching (CSS variable swaps or a ThemeProvider context).
- [ ] Audit all components to ensure zero hardcoded colors remain.

### Dark Mode

- [ ] Design and implement a dark-mode token set.
- [ ] Wire dark-mode toggle to `prefers-color-scheme` with a manual override stored in user preferences.

### Additional Themes

- [ ] **Party theme** — high-saturation, celebratory palette.
- [ ] **Grayscale theme** — full desaturation for focus/distraction-free mode.
- [ ] Infrastructure for additional themes (token file per theme, theme switcher component).

### Accessibility

- [ ] Audit all interactive elements for keyboard navigation and visible focus rings.
- [ ] Verify color contrast ratios meet WCAG AA across all themes.
- [ ] Add `aria-label` / `aria-describedby` to icon-only buttons and form controls.
- [ ] Test with a screen reader (NVDA / VoiceOver).
- [ ] Ensure modals trap focus correctly and restore focus on close.

### Animations

- [ ] Define a motion token set (duration, easing curves) consistent with the design token system.
- [ ] Add entry/exit animations to modals and toasts.
- [ ] Add micro-interactions: goal card progress bar fill, button press feedback.
- [ ] Respect `prefers-reduced-motion` for all animated elements.
