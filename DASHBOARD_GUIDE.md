# Personal Dashboard - User Guide

Complete guide to using the personal dashboard with goal management.

## ✅ What Was Built

### Components Created

1. **`components/dashboard/UserStats.tsx`** - User statistics display
2. **`components/dashboard/GoalCard.tsx`** - Individual goal card with actions
3. **`components/dashboard/GoalList.tsx`** - Goal list with filtering
4. **`components/dashboard/GoalModal.tsx`** - Create/edit goal modal

### Hooks Created

1. **`hooks/useGoals.ts`** - Hook for goal management
2. **`hooks/useUser.ts`** - Hook for user profile data

### Updated Files

- **`pages/Dashboard.tsx`** - Complete dashboard implementation
- **`hooks/index.ts`** - Export new hooks

---

## 🎯 Dashboard Features

### 1. User Statistics

Displays four key metrics:

- **Current Streak** - Days with consecutive goal completions
- **Active Goals** - Goals in todo or in_progress status
- **Completed** - All-time completed goals count
- **Completion Rate** - Percentage of goals completed

### 2. Goal Management

**Create Goals:**
- Click "+ New Goal" button
- Fill in title, description, category, priority, due date, and tags
- Categories: Personal, Work, Health, Learning, Social, Finance, Other
- Priorities: Low, Medium, High, Urgent

**View Goals:**
- Filter by: Active, Overdue, Completed, All
- Each goal card shows:
  - Title and description
  - Tags
  - Status, due date, and category
  - Priority badge

**Update Goals:**
- **Start** - Mark as in_progress
- **Complete** - Mark as completed (updates streak!)
- **Add Note** - Add progress notes
- **Delete** - Remove goal (with confirmation)

### 3. Goal Status Workflow

```
todo → in_progress → completed
  ↓         ↓            ↓
cancelled  cancelled  archived
```

---

## 🚀 Getting Started

### Step 1: Set Up Firebase

Make sure you have Firebase configured (see `FIREBASE_SETUP.md`).

### Step 2: Create User Profile

**Important:** The dashboard requires a user profile in Firestore. When you first sign in with Google OAuth, you need to create your user profile.

**Option A: Automatic Creation (Recommended)**

Add this code to your sign-in flow:

```typescript
// In your sign-in handler
import { signInWithGoogle } from '@/auth/auth';
import { createUserProfile, userExists } from '@/services';
import { Timestamp } from 'firebase/firestore';

async function handleSignIn() {
  const result = await signInWithGoogle();
  const user = result.user;

  // Check if profile exists
  const exists = await userExists(user.uid);

  if (!exists) {
    // Create user profile
    await createUserProfile(user.uid, {
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
    });

    console.log('User profile created!');
  }

  // Navigate to dashboard
  navigate('/dashboard');
}
```

**Option B: Manual Creation via Firestore Console**

1. Go to Firebase Console > Firestore Database
2. Create collection: `users`
3. Add document with ID = your Firebase Auth UID
4. Add the following fields:

```json
{
  "email": "your@email.com",
  "displayName": "Your Name",
  "photoURL": "https://your-photo-url",
  "googleAccessToken": null,
  "tokenExpiresAt": null,
  "goalsCount": 0,
  "goalsCompletedCount": 0,
  "currentStreak": 0,
  "longestStreak": 0,
  "lastCompletionDate": null,
  "calendarConnected": false,
  "timezone": "America/New_York",
  "notificationPreferences": {
    "email": true,
    "reminders": true,
    "weeklySummary": true
  },
  "createdAt": [current timestamp],
  "updatedAt": [current timestamp]
}
```

### Step 3: Test the Dashboard

1. Start the dev server: `npm run dev`
2. Sign in with Google
3. Navigate to `/dashboard`
4. Click "+ New Goal" to create your first goal
5. Test the goal workflow (Start → Complete)

---

## 📝 Usage Examples

### Creating a Goal

```typescript
// Via the UI:
1. Click "+ New Goal" button
2. Fill in the form:
   - Title: "Complete project proposal"
   - Description: "Draft Q1 proposal for new features"
   - Category: Work
   - Priority: High
   - Due Date: 2024-02-01
   - Tags: project, q1, urgent
3. Click "Create Goal"
```

### Completing a Goal

```typescript
// Via the UI:
1. Find the goal in your list
2. Click "Complete" button
3. See success message with updated streak!
```

The `completeGoal` function automatically:
- Updates goal status to "completed"
- Sets completedAt timestamp
- Updates your streak (if consecutive day)
- Increments your goalsCompletedCount

### Filtering Goals

Use the filter tabs to view:
- **Active** - Goals you're currently working on
- **Overdue** - Goals past their due date (alerts you!)
- **Completed** - All completed goals
- **All** - Everything

---

## 🎨 UI Components

### UserStats Component

```tsx
<UserStats user={profile} goals={goals} />
```

Displays 4 statistics cards with color-coded backgrounds.

### GoalCard Component

```tsx
<GoalCard
  goal={goal}
  onComplete={handleComplete}
  onDelete={handleDelete}
  onUpdateStatus={handleUpdateStatus}
/>
```

Features:
- Displays goal details
- Priority badge with color coding
- Status indicator
- Due date with overdue highlighting
- Action buttons (Start, Complete, Add Note, Delete)
- Expandable notes section

### GoalList Component

```tsx
<GoalList
  goals={goals}
  onComplete={handleComplete}
  onDelete={handleDelete}
  onUpdateStatus={handleUpdateStatus}
/>
```

Features:
- Filter tabs
- Empty state messages
- Renders GoalCard for each goal

### GoalModal Component

```tsx
<GoalModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreate={handleCreateGoal}
  userId={user.uid}
/>
```

Features:
- Form validation
- Date picker (prevents past dates)
- Tag input (comma-separated)
- Category and priority dropdowns
- Loading states

---

## 🔧 Customization

### Adding Custom Goal Categories

Edit `src/types/models.ts`:

```typescript
export type GoalCategory =
  | 'personal'
  | 'work'
  | 'health'
  | 'learning'
  | 'social'
  | 'finance'
  | 'coding'  // Add custom category
  | 'other';
```

Then update the modal:

```tsx
// In GoalModal.tsx
<select ...>
  <option value="coding">Coding</option>
</select>
```

### Changing Priority Colors

Edit `src/utils/goals.ts`:

```typescript
export function getPriorityColor(priority: GoalPriority): string {
  const colors: Record<GoalPriority, string> = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',  // Customize these
  };
  return colors[priority];
}
```

### Adding More Stats

Edit `components/dashboard/UserStats.tsx`:

```tsx
const stats = [
  // ... existing stats
  {
    label: 'Goals This Week',
    value: `${goalsThisWeek.length}`,
    subtext: 'created',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];
```

---

## 🐛 Troubleshooting

### "Unable to load profile"

**Solution:** Create a user profile in Firestore (see Step 2 above).

### "Failed to load goals"

**Possible causes:**
1. Firestore security rules blocking access
2. No internet connection
3. Invalid Firebase configuration

**Solution:** Check browser console for specific error messages.

### Goals not updating after actions

**Solution:** The hooks automatically refresh. If not working:
1. Check browser console for errors
2. Verify Firestore security rules allow updates
3. Hard refresh the page (Ctrl+Shift+R)

### Streak not updating

**Solution:**
- Streak only increments if you complete a goal on consecutive days
- Same-day completions don't increment streak
- Check `lastCompletionDate` in your user profile

### Modal not closing after creating goal

**Solution:**
- Check browser console for errors during goal creation
- Verify all required fields are filled
- Ensure due date is in the future

---

## 📊 Data Flow

```
User Action (UI)
     ↓
Hook (useGoals/useUser)
     ↓
Service (services/goals.ts)
     ↓
Firestore Database
     ↓
Hook refreshes data
     ↓
UI updates
```

### Example: Completing a Goal

1. User clicks "Complete" button
2. `GoalCard` calls `onComplete(goalId)`
3. `Dashboard` calls `markComplete(goalId, userId)`
4. `useGoals` hook calls `completeGoal` service
5. Service updates goal in Firestore
6. Service updates user streak in Firestore
7. Hook calls `refreshGoals()` to fetch latest data
8. UI re-renders with updated goal and streak

---

## 🎯 Best Practices

### 1. Keep Goals Specific
- ✅ "Complete project proposal by Feb 1"
- ❌ "Work on project"

### 2. Use Tags Effectively
- Group related goals with tags
- Use consistent tag naming
- Examples: `#urgent`, `#q1`, `#client-x`

### 3. Set Realistic Due Dates
- Goals with near-term deadlines are more likely to be completed
- Use priority levels to indicate urgency

### 4. Add Progress Notes
- Document what you've done
- Note any blockers
- Track progress over time

### 5. Review Regularly
- Check overdue goals daily
- Archive completed goals periodically
- Adjust priorities as needed

---

## 🚀 Next Steps

1. **Add real-time updates** - Use Firestore `onSnapshot` instead of polling
2. **Implement goal editing** - Add edit functionality to GoalCard
3. **Add recurring goals** - Support for daily/weekly/monthly goals
4. **Calendar sync** - Sync goals to Google Calendar
5. **Goal templates** - Pre-defined goal templates for common tasks
6. **Search & filters** - Advanced filtering and search
7. **Mobile responsive** - Optimize for mobile devices
8. **Dark mode** - Add dark mode support

---

## 📚 Related Documentation

- **`SERVICES_DOCUMENTATION.md`** - Service layer API reference
- **`FIRESTORE_SCHEMA.md`** - Database schema
- **`DATA_MODELS_SUMMARY.md`** - Data model overview
- **`FIREBASE_SETUP.md`** - Firebase configuration

---

Your personal dashboard is ready to use! 🎉

Start creating goals and track your progress today!
