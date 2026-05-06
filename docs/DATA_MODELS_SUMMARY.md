# Data Models Summary

Complete overview of Firestore data models and TypeScript types.

## ✅ What Was Created

### TypeScript Type Definitions

**File:** `src/types/models.ts`

Three core domain models with full TypeScript interfaces:

1. **User** - User profiles and preferences
2. **Goal** - User goals and tasks
3. **GlobalStats** - Community-wide statistics

Plus helper types for CRUD operations:
- `CreateUser`, `UpdateUser`
- `CreateGoal`, `UpdateGoal`
- `UpdateGlobalStats`

### Documentation

1. **`docs/FIRESTORE_SCHEMA.md`** - Complete database schema
   - Collection structure
   - Field descriptions
   - Example JSON documents
   - Security rules
   - Index requirements
   - Free tier estimates

2. **`docs/MODEL_EXAMPLES.md`** - TypeScript usage examples
   - CRUD operations for each model
   - Query examples
   - Utility functions
   - Type guards
   - Complete workflows

## 📊 Data Models Overview

### 1. User Model

**Collection:** `users`
**Document ID:** Firebase Auth UID

```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  googleAccessToken: string | null;
  tokenExpiresAt: FirestoreTimestamp | null;
  goalsCount: number;
  goalsCompletedCount: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: FirestoreTimestamp | null;
  calendarConnected: boolean;
  timezone: string;
  notificationPreferences: {
    email: boolean;
    reminders: boolean;
    weeklySummary: boolean;
  };
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
```

**Key Features:**
- ✅ Google OAuth integration (access token storage)
- ✅ Streak tracking (current & longest)
- ✅ Goal statistics (total & completed)
- ✅ Notification preferences
- ✅ Timezone support
- ✅ Calendar connection status

**Use Cases:**
- User profile display
- Leaderboards (by streak or goals completed)
- Personalization (timezone, preferences)
- Calendar API authentication

---

### 2. Goal Model

**Collection:** `goals`
**Document ID:** Auto-generated

```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory; // 'personal' | 'work' | 'health' | ...
  status: GoalStatus; // 'todo' | 'in_progress' | 'completed' | ...
  priority: GoalPriority; // 'low' | 'medium' | 'high' | 'urgent'
  startDate: FirestoreTimestamp;
  dueDate: FirestoreTimestamp;
  completedAt: FirestoreTimestamp | null;
  recurring: boolean;
  recurrencePattern: RecurrencePattern | null;
  calendarEventId: string | null;
  tags: string[];
  isPublic: boolean;
  daysUntilDue: number;
  isOverdue: boolean;
  notes: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
```

**Key Features:**
- ✅ Categorization (7 categories)
- ✅ Status lifecycle (5 states)
- ✅ Priority levels (4 levels)
- ✅ Recurring goals support
- ✅ Calendar sync (event ID)
- ✅ Tags for filtering
- ✅ Public/private visibility
- ✅ Computed fields (days until due, overdue status)

**Categories:**
- `personal` - Personal development
- `work` - Work-related
- `health` - Health & fitness
- `learning` - Education & skills
- `social` - Social activities
- `finance` - Financial goals
- `other` - Other

**Statuses:**
- `todo` - Not started
- `in_progress` - Currently working
- `completed` - Finished
- `cancelled` - Cancelled
- `archived` - Archived

**Use Cases:**
- Task management
- Goal tracking
- Calendar integration
- Progress monitoring
- Statistics & analytics

---

### 3. GlobalStats Model

**Collection:** `globalStats`
**Document ID:** `current` (single document)

```typescript
interface GlobalStats {
  id: string;
  totalUsers: number;
  totalGoals: number;
  totalGoalsCompleted: number;
  totalGoalsInProgress: number;
  completionRate: number;
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  goalsCompletedToday: number;
  goalsCompletedThisWeek: number;
  goalsCompletedThisMonth: number;
  popularCategory: GoalCategory;
  categoryDistribution: { [key in GoalCategory]: number };
  statusDistribution: { [key in GoalStatus]: number };
  averageGoalsPerUser: number;
  averageCompletionTimeDays: number;
  highestStreak: number;
  highestStreakUserId: string | null;
  lastUpdated: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
```

**Key Features:**
- ✅ User metrics (total, active)
- ✅ Goal metrics (total, completed, in progress)
- ✅ Time-based stats (today, week, month)
- ✅ Completion rate calculation
- ✅ Category distribution
- ✅ Status distribution
- ✅ Averages (goals per user, completion time)
- ✅ Leaderboard data (highest streak)

**Use Cases:**
- Dashboard statistics
- Community insights
- Progress visualization
- Leaderboards
- Trend analysis

---

## 💡 Design Decisions

### 1. **User Document ID = Auth UID**
- Simplifies user lookup
- No need for separate mapping
- Direct relationship between Auth and Firestore

### 2. **Computed Fields in Goals**
```typescript
daysUntilDue: number;
isOverdue: boolean;
```
- Enables efficient Firestore queries
- Updated when goal is modified
- Better than computing client-side every time

### 3. **Separate Collections (not subcollections)**
```
users/          ← Flat collection
goals/          ← Flat collection
globalStats/    ← Flat collection
```
**Why not subcollections?**
- Can't query across all users' goals
- More complex security rules
- Harder to calculate global stats
- Less flexible for future features

### 4. **Single GlobalStats Document**
- Cheaper than recalculating every time
- Updated via Cloud Functions (scheduled)
- Read-only for users
- One document is enough for stats

### 5. **Timestamps as Firestore Type**
```typescript
import type { Timestamp } from 'firebase/firestore';
```
- Native Firestore type
- Better for queries (comparison operators)
- Automatic timezone handling
- Convert to Date when needed: `timestamp.toDate()`

### 6. **Public/Private Goals**
```typescript
isPublic: boolean;
```
- Users can opt-out of global stats
- Privacy-conscious design
- Filter easily in queries

### 7. **Recurrence Pattern**
```typescript
recurrencePattern: RecurrencePattern | null;
```
- Flexible recurring goal support
- Supports daily, weekly, monthly, yearly
- Optional end date or occurrence count
- Basis for future calendar sync

---

## 📝 Usage Examples

### Import Types

```typescript
import type {
  User,
  Goal,
  GlobalStats,
  CreateGoal,
  UpdateGoal,
  GoalCategory,
  GoalStatus,
} from '@/types';
```

### Create a Goal

```typescript
import { createDocument } from '@/services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const newGoal: CreateGoal = {
  userId: user.uid,
  title: 'Learn TypeScript',
  description: 'Complete advanced TypeScript course',
  category: 'learning',
  status: 'todo',
  priority: 'high',
  startDate: Timestamp.now(),
  dueDate: Timestamp.fromDate(new Date('2024-02-01')),
  completedAt: null,
  recurring: false,
  recurrencePattern: null,
  calendarEventId: null,
  tags: ['coding', 'typescript'],
  isPublic: true,
  daysUntilDue: 30,
  isOverdue: false,
  notes: '',
};

const goalId = await createDocument('goals', newGoal);
```

### Query User's Goals

```typescript
import { getDocuments, where, orderBy } from '@/services/firebase/firestore';

const goals = await getDocuments<Goal>(
  'goals',
  where('userId', '==', user.uid),
  where('status', '==', 'todo'),
  orderBy('dueDate', 'asc')
);
```

### Complete a Goal

```typescript
const updates: UpdateGoal = {
  status: 'completed',
  completedAt: Timestamp.now(),
};

await updateDocument('goals', goalId, updates);
```

---

## 🔐 Security Considerations

### Firestore Security Rules

```javascript
// Users can only read/write their own profile
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// Users can only access their own goals
match /goals/{goalId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth.uid == resource.data.userId;
}

// Global stats are read-only (Cloud Functions update)
match /globalStats/{statsId} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

---

## 📊 Free Tier Estimates

**Firebase Spark Plan:**
- Firestore: 1 GiB storage, 50K reads/day, 20K writes/day

**Document Sizes:**
- User: ~1 KB
- Goal: ~2 KB
- GlobalStats: ~1 KB

**For 1000 users with 10 goals each:**
- Users: 1000 × 1 KB = 1 MB
- Goals: 10,000 × 2 KB = 20 MB
- GlobalStats: 1 KB
- **Total: ~21 MB** ✅ Well within free tier!

**Daily Operations (estimate):**
- 1000 users × 10 goal reads = 10K reads ✅
- 1000 users × 2 goal writes = 2K writes ✅
- Plenty of headroom for growth!

---

## 🚀 Next Steps

Now that you have the data models:

1. **Create Firestore service functions**
   - `services/users.ts` - User CRUD operations
   - `services/goals.ts` - Goal CRUD operations
   - `services/stats.ts` - Stats operations

2. **Build React hooks**
   - `hooks/useUser.ts` - User profile hook
   - `hooks/useGoals.ts` - Goals management hook
   - `hooks/useGlobalStats.ts` - Stats display hook

3. **Create UI components**
   - Goal list/cards
   - Goal creation form
   - User profile display
   - Stats dashboard

4. **Set up Firestore**
   - Initialize collections
   - Create security rules
   - Add indexes (as needed)
   - Seed initial data

5. **Implement features**
   - Goal CRUD
   - Streak tracking
   - Calendar sync
   - Stats calculation

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `src/types/models.ts` | TypeScript interfaces |
| `docs/FIRESTORE_SCHEMA.md` | Complete database schema |
| `docs/MODEL_EXAMPLES.md` | Usage examples & patterns |
| `DATA_MODELS_SUMMARY.md` | This file (overview) |

---

## ✅ Type Safety Benefits

With these models, you get:

✅ **Autocomplete** - IDE suggests all fields
✅ **Type checking** - Catch errors before runtime
✅ **Refactoring** - Rename fields safely
✅ **Documentation** - Types document the structure
✅ **Consistency** - Same structure everywhere

```typescript
// ❌ TypeScript catches this error
const goal: Goal = {
  title: 'My Goal',
  // Error: Missing required fields!
};

// ✅ All fields required
const goal: CreateGoal = {
  userId: '123',
  title: 'My Goal',
  description: 'Description',
  category: 'personal',
  status: 'todo',
  // ... all other fields
};
```

Your data models are ready! 🎉
