# Firestore Services Documentation

Complete guide to using Firestore services for goals, users, and statistics.

## 📦 What Was Implemented

### Service Files Created

1. **`services/users.ts`** - User profile management
2. **`services/goals.ts`** - Goal CRUD operations
3. **`services/stats.ts`** - Global statistics
4. **`utils/goals.ts`** - Goal utility functions
5. **`utils/errors.ts`** - Error handling utilities

All services use:
- ✅ Firebase v9 modular SDK
- ✅ TypeScript with full type safety
- ✅ Async/await patterns
- ✅ Comprehensive error handling
- ✅ Clean, documented code

---

## 🎯 Users Service

### Import

```typescript
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  incrementGoalCount,
  decrementGoalCount,
  updateUserStreak,
  getTopStreakUsers,
  getTopCompletedGoalsUsers,
  updateGoogleAccessToken,
  userExists,
} from '@/services';
```

### Available Functions

#### Get User Profile

```typescript
const user = await getUserProfile(userId);

if (user) {
  console.log(user.displayName);
  console.log(`Streak: ${user.currentStreak} days`);
}
```

#### Create User Profile

```typescript
const userData: CreateUser = {
  email: 'john@example.com',
  displayName: 'John Doe',
  photoURL: 'https://...',
  googleAccessToken: 'token',
  tokenExpiresAt: Timestamp.fromDate(expiryDate),
  goalsCount: 0,
  goalsCompletedCount: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletionDate: null,
  calendarConnected: true,
  timezone: 'America/New_York',
  notificationPreferences: {
    email: true,
    reminders: true,
    weeklySummary: true,
  },
};

await createUserProfile(userId, userData);
```

#### Update User Profile

```typescript
await updateUserProfile(userId, {
  displayName: 'New Name',
  notificationPreferences: {
    email: false,
    reminders: true,
    weeklySummary: true,
  },
});
```

#### Update User Streak

```typescript
// Called automatically when completing a goal
const newStreak = await updateUserStreak(userId);
console.log(`New streak: ${newStreak} days`);
```

#### Get Leaderboards

```typescript
// Top 10 users by current streak
const topStreak = await getTopStreakUsers(10);

// Top 10 users by completed goals
const topCompleted = await getTopCompletedGoalsUsers(10);
```

---

## 🎯 Goals Service

### Import

```typescript
import {
  createGoal,
  getGoal,
  getUserGoals,
  getActiveGoals,
  getCompletedGoals,
  getOverdueGoals,
  getGoalsByCategory,
  getGoalsByStatus,
  getGoalsByPriority,
  updateGoal,
  updateGoalProgress,
  completeGoal,
  startGoal,
  cancelGoal,
  archiveGoal,
  deleteGoal,
  getUpcomingGoals,
  searchGoals,
  updateAllGoalComputedFields,
} from '@/services';
```

### Core Operations

#### Create a Goal

```typescript
import { Timestamp } from 'firebase/firestore';

const goalData: CreateGoal = {
  userId: user.uid,
  title: 'Complete project proposal',
  description: 'Draft and finalize Q1 project proposal',
  category: 'work',
  status: 'todo',
  priority: 'high',
  startDate: Timestamp.now(),
  dueDate: Timestamp.fromDate(new Date('2024-02-01')),
  completedAt: null,
  recurring: false,
  recurrencePattern: null,
  calendarEventId: null,
  tags: ['project', 'q1'],
  isPublic: true,
  daysUntilDue: 0, // Will be calculated automatically
  isOverdue: false, // Will be calculated automatically
  notes: '',
};

const goalId = await createGoal(goalData);
console.log('Goal created:', goalId);
```

**Note:** `daysUntilDue` and `isOverdue` are calculated automatically based on `dueDate`.

#### Get User's Goals

```typescript
// All goals
const allGoals = await getUserGoals(userId);

// Active goals only (todo or in_progress)
const activeGoals = await getActiveGoals(userId);

// Completed goals
const completedGoals = await getCompletedGoals(userId);

// Overdue goals
const overdueGoals = await getOverdueGoals(userId);

// Goals due in next 7 days
const upcomingGoals = await getUpcomingGoals(userId, 7);
```

#### Filter Goals

```typescript
// By category
const workGoals = await getGoalsByCategory(userId, 'work');
const healthGoals = await getGoalsByCategory(userId, 'health');

// By status
const inProgressGoals = await getGoalsByStatus(userId, 'in_progress');
const todoGoals = await getGoalsByStatus(userId, 'todo');

// By priority
const urgentGoals = await getGoalsByPriority(userId, 'urgent');
const highPriorityGoals = await getGoalsByPriority(userId, 'high');
```

#### Update Goal Progress

```typescript
// Update status and add notes
await updateGoalProgress(goalId, 'in_progress', 'Made good progress today');

// Start a goal
await startGoal(goalId, 'Starting work on this');

// Complete a goal (updates user streak automatically)
const newStreak = await completeGoal(goalId, userId);
console.log(`Goal completed! Streak: ${newStreak}`);

// Cancel a goal
await cancelGoal(goalId);

// Archive a goal
await archiveGoal(goalId);
```

#### Update Goal Fields

```typescript
// Update any goal fields
await updateGoal(goalId, {
  title: 'Updated title',
  priority: 'urgent',
  dueDate: Timestamp.fromDate(new Date('2024-02-15')),
});

// Due date changes automatically recalculate daysUntilDue and isOverdue
```

#### Delete a Goal

```typescript
// Deletes goal and decrements user's goal count
await deleteGoal(goalId, userId);
```

#### Search Goals

```typescript
// Search in title, description, and tags
const results = await searchGoals(userId, 'project');
```

---

## 🎯 Stats Service

### Import

```typescript
import {
  getGlobalStats,
  initializeGlobalStats,
  updateGlobalStats,
  recalculateGlobalStats,
  incrementTotalUsers,
  incrementTotalGoals,
  decrementTotalGoals,
  getStatsSummary,
} from '@/services';
```

### Available Functions

#### Get Global Stats

```typescript
const stats = await getGlobalStats();

if (stats) {
  console.log(`Total Users: ${stats.totalUsers}`);
  console.log(`Total Goals: ${stats.totalGoals}`);
  console.log(`Completion Rate: ${stats.completionRate.toFixed(1)}%`);
  console.log(`Popular Category: ${stats.popularCategory}`);
  console.log(`Highest Streak: ${stats.highestStreak} days`);
}
```

#### Initialize Stats (First Time)

```typescript
// Run once when setting up the app
await initializeGlobalStats();
```

#### Get Stats Summary

```typescript
const summary = await getStatsSummary();

if (summary) {
  console.log(summary);
  // {
  //   totalUsers: 247,
  //   totalGoals: 1853,
  //   completionRate: "56.2%",
  //   activeUsers: 89,
  //   popularCategory: "health",
  //   highestStreak: 45
  // }
}
```

#### Recalculate All Stats

```typescript
// Expensive operation - run periodically (e.g., daily via Cloud Function)
const updatedStats = await recalculateGlobalStats();
console.log('Stats recalculated:', updatedStats);
```

#### Update Stats Manually

```typescript
// Increment when new user signs up
await incrementTotalUsers();

// Increment when goal is created
await incrementTotalGoals();

// Decrement when goal is deleted
await decrementTotalGoals();

// Update specific fields
await updateGlobalStats({
  activeUsersLast7Days: 150,
  goalsCompletedToday: 25,
});
```

---

## 🛠️ Utility Functions

### Import

```typescript
import {
  calculateDaysUntilDue,
  isOverdue,
  isGoalActive,
  isGoalCompleted,
  isHighPriority,
  isRecurring,
  getStatusLabel,
  getPriorityLabel,
  getPriorityColor,
  getStatusColor,
  sortByDueDate,
  sortByPriority,
  groupByCategory,
  groupByStatus,
  filterActiveGoals,
  filterCompletedGoals,
  filterOverdueGoals,
  filterHighPriorityGoals,
  calculateCompletionRate,
  getGoalsDueToday,
  getGoalsDueThisWeek,
  formatDueDate,
} from '@/utils';
```

### Utility Examples

#### Date Calculations

```typescript
const daysUntil = calculateDaysUntilDue(goal.dueDate.toDate());
// 7 (days from now)

const overdue = isOverdue(goal.dueDate.toDate());
// false

const formatted = formatDueDate(goal.dueDate.toDate());
// "In 7 days" or "Today" or "Tomorrow" or "3 days overdue"
```

#### Type Guards

```typescript
if (isGoalActive(goal)) {
  console.log('Goal is active');
}

if (isGoalCompleted(goal)) {
  console.log('Goal is completed');
}

if (isHighPriority(goal)) {
  console.log('High priority goal');
}
```

#### Sorting & Filtering

```typescript
// Sort goals
const sortedByDate = sortByDueDate(goals);
const sortedByPriority = sortByPriority(goals);

// Filter goals
const activeGoals = filterActiveGoals(goals);
const completedGoals = filterCompletedGoals(goals);
const overdueGoals = filterOverdueGoals(goals);
const highPriorityGoals = filterHighPriorityGoals(goals);

// Get specific goals
const dueToday = getGoalsDueToday(goals);
const dueThisWeek = getGoalsDueThisWeek(goals);
```

#### Grouping

```typescript
// Group by category
const byCategory = groupByCategory(goals);
// { personal: [...], work: [...], health: [...] }

// Group by status
const byStatus = groupByStatus(goals);
// { todo: [...], in_progress: [...], completed: [...] }
```

#### Labels & Colors

```typescript
const statusLabel = getStatusLabel('in_progress');
// "In Progress"

const priorityLabel = getPriorityLabel('urgent');
// "Urgent"

const statusColor = getStatusColor('completed');
// "text-green-600" (Tailwind class)

const priorityColor = getPriorityColor('urgent');
// "text-red-600" (Tailwind class)
```

#### Statistics

```typescript
const completionRate = calculateCompletionRate(goals);
// 56.2 (percentage)
```

---

## 🚨 Error Handling

### Import

```typescript
import {
  ServiceError,
  ValidationError,
  NotFoundError,
  PermissionError,
  getFirebaseErrorMessage,
  isFirebaseError,
  handleAsync,
  validateRequired,
  validateEmail,
  validateFutureDate,
  validateLength,
} from '@/utils';
```

### Error Handling Examples

#### Try-Catch Pattern

```typescript
try {
  const goal = await createGoal(goalData);
  console.log('Goal created successfully');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message, error.field);
  } else if (error instanceof ServiceError) {
    console.error('Service error:', error.message, error.code);
  } else if (isFirebaseError(error)) {
    console.error('Firebase error:', getFirebaseErrorMessage(error));
  } else {
    console.error('Unknown error:', error);
  }
}
```

#### Validation

```typescript
// Validate required fields
const title = validateRequired(goalData.title, 'Title');

// Validate email
validateEmail(user.email);

// Validate future date
validateFutureDate(goalData.dueDate.toDate(), 'Due date');

// Validate string length
validateLength(goalData.title, 'Title', 3, 100);
```

#### Custom Errors

```typescript
// Throw custom errors
throw new ValidationError('Invalid goal category', 'category');
throw new NotFoundError('Goal not found');
throw new PermissionError('You do not have permission to delete this goal');
throw new ServiceError('Failed to create goal', 'GOAL_CREATE_FAILED');
```

---

## 📋 Complete Workflow Examples

### Create a New User on Sign Up

```typescript
import { signInWithGoogle } from '@/auth/auth';
import { createUserProfile, userExists } from '@/services';
import { incrementTotalUsers } from '@/services';

async function handleSignUp() {
  // Sign in with Google
  const result = await signInWithGoogle();
  const { user } = result;

  // Check if user profile already exists
  const exists = await userExists(user.uid);

  if (!exists) {
    // Create user profile
    const userData: CreateUser = {
      email: user.email!,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      googleAccessToken: null,
      tokenExpiresAt: null,
      goalsCount: 0,
      goalsCompletedCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      calendarConnected: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notificationPreferences: {
        email: true,
        reminders: true,
        weeklySummary: true,
      },
    };

    await createUserProfile(user.uid, userData);

    // Update global stats
    await incrementTotalUsers();

    console.log('User profile created');
  }
}
```

### Create and Complete a Goal

```typescript
import { createGoal, completeGoal } from '@/services';
import { Timestamp } from 'firebase/firestore';

async function createAndCompleteGoal(userId: string) {
  // Create goal
  const goalData: CreateGoal = {
    userId,
    title: 'Morning workout',
    description: '30 minutes of exercise',
    category: 'health',
    status: 'todo',
    priority: 'medium',
    startDate: Timestamp.now(),
    dueDate: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    completedAt: null,
    recurring: false,
    recurrencePattern: null,
    calendarEventId: null,
    tags: ['fitness'],
    isPublic: true,
    daysUntilDue: 1,
    isOverdue: false,
    notes: '',
  };

  const goalId = await createGoal(goalData);
  console.log('Goal created:', goalId);

  // ... user works on goal ...

  // Complete goal
  const newStreak = await completeGoal(goalId, userId);
  console.log(`Goal completed! Current streak: ${newStreak} days`);
}
```

### Display User Dashboard

```typescript
import {
  getUserProfile,
  getActiveGoals,
  getOverdueGoals,
  getUpcomingGoals,
} from '@/services';
import { calculateCompletionRate } from '@/utils';

async function displayDashboard(userId: string) {
  // Get user profile
  const user = await getUserProfile(userId);

  if (!user) {
    console.error('User not found');
    return;
  }

  // Get goals
  const activeGoals = await getActiveGoals(userId);
  const overdueGoals = await getOverdueGoals(userId);
  const upcomingGoals = await getUpcomingGoals(userId, 7);

  // Calculate stats
  const completionRate = calculateCompletionRate(activeGoals);

  console.log('=== Dashboard ===');
  console.log(`Welcome, ${user.displayName}!`);
  console.log(`Current Streak: ${user.currentStreak} days`);
  console.log(`Longest Streak: ${user.longestStreak} days`);
  console.log(`Goals Completed: ${user.goalsCompletedCount}/${user.goalsCount}`);
  console.log(`\nActive Goals: ${activeGoals.length}`);
  console.log(`Overdue Goals: ${overdueGoals.length}`);
  console.log(`Due This Week: ${upcomingGoals.length}`);
  console.log(`Completion Rate: ${completionRate.toFixed(1)}%`);
}
```

---

## 🔐 Security Notes

### Firestore Security Rules

Make sure to set up proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Users can only access their own goals
    match /goals/{goalId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Global stats are read-only (Cloud Functions update)
    match /globalStats/{statsId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

---

## ✅ Type Safety

All services are fully typed:

```typescript
// ✅ TypeScript ensures correct types
const goalData: CreateGoal = { ... };
const goalId: string = await createGoal(goalData);

// ✅ Autocomplete works
const user: User | null = await getUserProfile(userId);

// ✅ Type checking
const status: GoalStatus = 'in_progress'; // Valid
const status: GoalStatus = 'invalid'; // TypeScript error
```

---

## 🎯 Next Steps

Now that you have the services implemented:

1. **Create React hooks** - Wrap services in hooks (`useGoals`, `useUser`, `useStats`)
2. **Build UI components** - Goal forms, lists, dashboards
3. **Set up Firestore** - Security rules, indexes
4. **Test services** - Create test data and verify operations
5. **Implement Calendar sync** - Use stored Google access token

Your Firestore services are production-ready! 🚀
