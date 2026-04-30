/**
 * Create Test User Script
 *
 * Helper script to create a test user profile in Firestore.
 * Run this after signing in to create your user profile.
 *
 * Usage:
 * 1. Sign in with Google OAuth
 * 2. Get your user UID from Firebase Auth console
 * 3. Update the USER_ID constant below
 * 4. Run: npx tsx src/scripts/createTestUser.ts
 */

import { createUserProfile } from '../services/users';

// UPDATE THIS with your Firebase Auth UID
const USER_ID = 'YOUR_FIREBASE_AUTH_UID_HERE';

// UPDATE THIS with your user data
const USER_DATA = {
  email: 'your-email@example.com',
  displayName: 'Your Name',
  photoURL: 'https://example.com/your-photo.jpg',
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

async function main() {
  try {
    console.log('Creating user profile...');
    console.log('User ID:', USER_ID);
    console.log('Email:', USER_DATA.email);

    if (USER_ID === 'YOUR_FIREBASE_AUTH_UID_HERE') {
      throw new Error(
        'Please update USER_ID with your Firebase Auth UID'
      );
    }

    await createUserProfile(USER_ID, USER_DATA);

    console.log('✅ User profile created successfully!');
    console.log('You can now access the dashboard at /dashboard');
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    process.exit(1);
  }
}

main();
