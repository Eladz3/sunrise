# Data Model Usage Examples

This document shows how to use the TypeScript interfaces for CRUD operations.

## Importing Types

```typescript
import type {
  User,
  Goal,
  GlobalStats,
  CreateUser,
  UpdateUser,
  CreateGoal,
  UpdateGoal,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  RecurrencePattern,
} from '@/types/models';
```

---

## User Examples

### Creating a New User

```typescript
import { createDocument } from '@/services/firebase/firestore';
import type { CreateUser } from '@/types/models';
import { Timestamp } from 'firebase/firestore';

async function createNewUser(authUser: any, accessToken: string) {
  const newUser: CreateUser = {
    email: authUser.email,
    displayName: authUser.displayName || 'Anonymous',
    photoURL: authUser.photoURL,
    googleAccessToken: accessToken,
    tokenExpiresAt: Timestamp.fromDate(new Date(Date.now() + 3600000)), // 1 hour
    goalsCount: 0,
    goalsCompletedCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    calendarConnected: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationPreferences: {
      email: true,
      reminders: true,
      weeklySummary: true,
    },
  };

  // Use auth UID as document ID
  await setDocument('users', authUser.uid, newUser);

  return authUser.uid;
}
```

### Reading a User

```typescript
import { getDocument } from '@/services/firebase/firestore';
import type { User } from '@/types/models';

async function getUserProfile(userId: string): Promise<User | null> {
  const user = await getDocument<User>('users', userId);

  if (!user) {
    console.log('User not found');
    return null;
  }

  console.log(`Welcome, ${user.displayName}!`);
  console.log(`Streak: ${user.currentStreak} days`);
  console.log(`Goals completed: ${user.goalsCompletedCount}/${user.goalsCount}`);

  return user;
}
```

### Updating a User

```typescript
import { updateDocument } from '@/services/firebase/firestore';
import type { UpdateUser } from '@/types/models';

async function updateUserProfile(userId: string, updates: UpdateUser) {
  await updateDocument('users', userId, updates);
}

// Example: Update notification preferences
await updateUserProfile('abc123', {
  notificationPreferences: {
    email: false,
    reminders: true,
    weeklySummary: true,
  },
});

// Example: Increment goals count
const user = await getDocument<User>('users', 'abc123');
if (user) {
  await updateUserProfile('abc123', {
    goalsCount: user.goalsCount + 1,
  });
}
```

### Updating User Streak

```typescript
import { Timestamp } from 'firebase/firestore';

async function updateUserStreak(userId: string) {
  const user = await getDocument<User>('users', userId);
  if (!user) return;

  const now = new Date();
  const lastCompletion = user.lastCompletionDate?.toDate();

  let newStreak = user.currentStreak;

  if (!lastCompletion) {
    // First goal completion
    newStreak = 1;
  } else {
    const daysDiff = Math.floor(
      (now.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      // Consecutive day
      newStreak = user.currentStreak + 1;
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }
    // daysDiff === 0 means same day, keep current streak
  }

  const updates: UpdateUser = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, user.longestStreak),
    lastCompletionDate: Timestamp.fromDate(now),
    goalsCompletedCount: user.goalsCompletedCount + 1,
  };

  await updateDocument('users', userId, updates);
}
```

---

## Goal Examples

### Creating a Simple Goal

```typescript
import { createDocument } from '@/services/firebase/firestore';
import type { CreateGoal } from '@/types/models';
import { Timestamp } from 'firebase/firestore';

async function createSimpleGoal(userId: string) {
  const startDate = new Date();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const newGoal: CreateGoal = {
    userId,
    title: 'Complete project proposal',
    description: 'Draft and finalize Q1 project proposal',
    category: 'work',
    status: 'todo',
    priority: 'high',
    startDate: Timestamp.fromDate(startDate),
    dueDate: Timestamp.fromDate(dueDate),
    completedAt: null,
    recurring: false,
    recurrencePattern: null,
    calendarEventId: null,
    tags: ['project', 'q1'],
    isPublic: true,
    daysUntilDue: 7,
    isOverdue: false,
    notes: '',
  };

  const goalId = await createDocument('goals', newGoal);
  console.log('Goal created:', goalId);

  return goalId;
}
```

### Creating a Recurring Goal

```typescript
import type { CreateGoal, RecurrencePattern } from '@/types/models';

async function createRecurringGoal(userId: string) {
  const startDate = new Date();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const recurrence: RecurrencePattern = {
    type: 'weekly',
    interval: 1, // Every week
    daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
    endDate: null, // Never ends
    occurrences: null,
  };

  const newGoal: CreateGoal = {
    userId,
    title: 'Morning workout',
    description: '30 minutes of exercise',
    category: 'health',
    status: 'todo',
    priority: 'medium',
    startDate: Timestamp.fromDate(startDate),
    dueDate: Timestamp.fromDate(dueDate),
    completedAt: null,
    recurring: true,
    recurrencePattern: recurrence,
    calendarEventId: null,
    tags: ['fitness', 'routine'],
    isPublic: true,
    daysUntilDue: 7,
    isOverdue: false,
    notes: 'Includes cardio and stretching',
  };

  return await createDocument('goals', newGoal);
}
```

### Querying User's Goals

```typescript
import { getDocuments, where, orderBy } from '@/services/firebase/firestore';
import type { Goal } from '@/types/models';

// Get all goals for a user
async function getUserGoals(userId: string): Promise<Goal[]> {
  return await getDocuments<Goal>(
    'goals',
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );
}

// Get only active goals (todo or in_progress)
async function getActiveGoals(userId: string): Promise<Goal[]> {
  const allGoals = await getDocuments<Goal>(
    'goals',
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );

  return allGoals.filter(
    (goal) => goal.status === 'todo' || goal.status === 'in_progress'
  );
}

// Get overdue goals
async function getOverdueGoals(userId: string): Promise<Goal[]> {
  return await getDocuments<Goal>(
    'goals',
    where('userId', '==', userId),
    where('isOverdue', '==', true),
    orderBy('dueDate', 'asc')
  );
}

// Get goals by category
async function getGoalsByCategory(
  userId: string,
  category: GoalCategory
): Promise<Goal[]> {
  return await getDocuments<Goal>(
    'goals',
    where('userId', '==', userId),
    where('category', '==', category),
    orderBy('dueDate', 'asc')
  );
}
```

### Completing a Goal

```typescript
import type { UpdateGoal } from '@/types/models';
import { Timestamp } from 'firebase/firestore';

async function completeGoal(goalId: string, userId: string) {
  const updates: UpdateGoal = {
    status: 'completed',
    completedAt: Timestamp.fromDate(new Date()),
  };

  await updateDocument('goals', goalId, updates);

  // Update user stats
  await updateUserStreak(userId);

  console.log('Goal completed!');
}
```

### Updating Goal Progress

```typescript
async function updateGoalProgress(goalId: string, notes: string) {
  const updates: UpdateGoal = {
    status: 'in_progress',
    notes,
  };

  await updateDocument('goals', goalId, updates);
}

// Example usage
await updateGoalProgress('goal_001', 'Made good progress today. 50% complete.');
```

### Calculating Days Until Due

```typescript
function calculateDaysUntilDue(dueDate: Date): number {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function isGoalOverdue(dueDate: Date): boolean {
  return dueDate.getTime() < new Date().getTime();
}

// Update computed fields
async function updateGoalComputedFields(goalId: string, dueDate: Date) {
  const updates: UpdateGoal = {
    daysUntilDue: calculateDaysUntilDue(dueDate),
    isOverdue: isGoalOverdue(dueDate),
  };

  await updateDocument('goals', goalId, updates);
}
```

---

## GlobalStats Examples

### Reading Global Stats

```typescript
import { getDocument } from '@/services/firebase/firestore';
import type { GlobalStats } from '@/types/models';

async function getGlobalStats(): Promise<GlobalStats | null> {
  return await getDocument<GlobalStats>('globalStats', 'current');
}

// Display stats
async function displayStats() {
  const stats = await getGlobalStats();

  if (!stats) {
    console.log('No stats available');
    return;
  }

  console.log('=== Community Stats ===');
  console.log(`Total Users: ${stats.totalUsers}`);
  console.log(`Total Goals: ${stats.totalGoals}`);
  console.log(`Completed: ${stats.totalGoalsCompleted}`);
  console.log(`Completion Rate: ${stats.completionRate.toFixed(1)}%`);
  console.log(`Most Popular Category: ${stats.popularCategory}`);
  console.log(`Highest Streak: ${stats.highestStreak} days`);
}
```

### Updating Global Stats (Admin/Cloud Function)

```typescript
import { setDocument, getDocuments, where } from '@/services/firebase/firestore';
import type { GlobalStats, Goal, User } from '@/types/models';
import { Timestamp } from 'firebase/firestore';

async function recalculateGlobalStats() {
  // Get all users
  const users = await getDocuments<User>('users');

  // Get all public goals
  const goals = await getDocuments<Goal>(
    'goals',
    where('isPublic', '==', true)
  );

  // Calculate category distribution
  const categoryDist = {
    personal: 0,
    work: 0,
    health: 0,
    learning: 0,
    social: 0,
    finance: 0,
    other: 0,
  };

  goals.forEach((goal) => {
    categoryDist[goal.category]++;
  });

  // Calculate status distribution
  const statusDist = {
    todo: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    archived: 0,
  };

  goals.forEach((goal) => {
    statusDist[goal.status]++;
  });

  // Find most popular category
  const popularCategory = Object.entries(categoryDist).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0] as GoalCategory;

  // Find highest streak
  let highestStreak = 0;
  let highestStreakUserId: string | null = null;

  users.forEach((user) => {
    if (user.currentStreak > highestStreak) {
      highestStreak = user.currentStreak;
      highestStreakUserId = user.id;
    }
  });

  // Calculate completion rate
  const completionRate =
    goals.length > 0 ? (statusDist.completed / goals.length) * 100 : 0;

  const stats: Omit<GlobalStats, 'createdAt' | 'updatedAt'> = {
    id: 'current',
    totalUsers: users.length,
    totalGoals: goals.length,
    totalGoalsCompleted: statusDist.completed,
    totalGoalsInProgress: statusDist.in_progress,
    completionRate,
    activeUsersLast7Days: 0, // Calculate based on lastCompletionDate
    activeUsersLast30Days: 0,
    goalsCompletedToday: 0, // Calculate from completedAt
    goalsCompletedThisWeek: 0,
    goalsCompletedThisMonth: 0,
    popularCategory,
    categoryDistribution: categoryDist,
    statusDistribution: statusDist,
    averageGoalsPerUser: users.length > 0 ? goals.length / users.length : 0,
    averageCompletionTimeDays: 0, // Calculate from createdAt to completedAt
    highestStreak,
    highestStreakUserId,
    lastUpdated: Timestamp.fromDate(new Date()),
  };

  await setDocument('globalStats', 'current', stats);

  console.log('Global stats updated!');
}
```

---

## Utility Functions

### Convert Firestore Timestamps to Dates

```typescript
import type { Goal, User } from '@/types/models';

function convertGoalTimestamps(goal: Goal) {
  return {
    ...goal,
    startDate: goal.startDate.toDate(),
    dueDate: goal.dueDate.toDate(),
    completedAt: goal.completedAt?.toDate() || null,
    createdAt: goal.createdAt.toDate(),
    updatedAt: goal.updatedAt.toDate(),
  };
}

// Usage
const goal = await getDocument<Goal>('goals', 'goal_001');
if (goal) {
  const goalWithDates = convertGoalTimestamps(goal);
  console.log('Due date:', goalWithDates.dueDate.toLocaleDateString());
}
```

### Type Guards

```typescript
import type { Goal, GoalStatus, GoalPriority } from '@/types/models';

function isGoalActive(goal: Goal): boolean {
  return goal.status === 'todo' || goal.status === 'in_progress';
}

function isGoalCompleted(goal: Goal): boolean {
  return goal.status === 'completed';
}

function isHighPriority(goal: Goal): boolean {
  return goal.priority === 'high' || goal.priority === 'urgent';
}

function isRecurring(goal: Goal): boolean {
  return goal.recurring && goal.recurrencePattern !== null;
}

// Usage
const goals = await getUserGoals(userId);
const activeGoals = goals.filter(isGoalActive);
const highPriorityGoals = activeGoals.filter(isHighPriority);
```

---

## Complete Example: Create User Flow

```typescript
import { signInWithGoogle } from '@/auth/auth';
import { setDocument } from '@/services/firebase/firestore';
import type { CreateUser } from '@/types/models';
import { Timestamp } from 'firebase/firestore';

async function completeSignUpFlow() {
  // Step 1: Sign in with Google
  const result = await signInWithGoogle();
  const user = result.user;

  // Step 2: Get access token
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;

  // Step 3: Create user document
  const newUser: CreateUser = {
    email: user.email!,
    displayName: user.displayName || 'User',
    photoURL: user.photoURL,
    googleAccessToken: accessToken || null,
    tokenExpiresAt: accessToken
      ? Timestamp.fromDate(new Date(Date.now() + 3600000))
      : null,
    goalsCount: 0,
    goalsCompletedCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    calendarConnected: !!accessToken,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationPreferences: {
      email: true,
      reminders: true,
      weeklySummary: true,
    },
  };

  await setDocument('users', user.uid, newUser);

  // Step 4: Update global stats
  const stats = await getDocument<GlobalStats>('globalStats', 'current');
  if (stats) {
    await updateDocument('globalStats', 'current', {
      totalUsers: stats.totalUsers + 1,
    });
  }

  console.log('User created successfully!');
  return user.uid;
}
```

---

## TypeScript Benefits

With strong typing, you get:

✅ **Autocomplete** - IDE suggests available fields
✅ **Type safety** - Catch errors at compile time
✅ **Refactoring** - Rename fields with confidence
✅ **Documentation** - Types serve as documentation

```typescript
// ❌ This will throw TypeScript error
const invalidGoal: CreateGoal = {
  title: 'My goal',
  // Missing required fields!
};

// ✅ TypeScript ensures all required fields
const validGoal: CreateGoal = {
  userId: 'abc123',
  title: 'My goal',
  description: 'Goal description',
  category: 'personal',
  status: 'todo',
  priority: 'medium',
  startDate: Timestamp.now(),
  dueDate: Timestamp.now(),
  completedAt: null,
  recurring: false,
  recurrencePattern: null,
  calendarEventId: null,
  tags: [],
  isPublic: true,
  daysUntilDue: 7,
  isOverdue: false,
  notes: '',
};
```
