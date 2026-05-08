/**
 * User Service
 *
 * Firestore operations for user profiles and management.
 */

import {
  getDocument,
  setDocument,
  updateDocument,
  getDocuments,
  orderBy,
  limit,
} from './firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { api } from './api';

// Shape returned by the backend UserResponse (SQL user table)
export interface ApiUser {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<ApiUser | null> {
  try {
    return await api.get<ApiUser>(`/api/users/by-firebase-id/${encodeURIComponent(firebaseUid)}`);
  } catch {
    // Backend returns 500 (not 404) when user doesn't exist yet; POST /api/users is idempotent
    return null;
  }
}

// Ensures a SQL user record exists for the given Firebase user, creating one on first sign-in.
// NOTE: depends on backend migrating User.FirebaseId from int → string (see TODO.md).
export async function syncBackendUser(firebaseUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): Promise<ApiUser> {
  const existing = await getUserByFirebaseUid(firebaseUser.uid);
  if (existing) return existing;

  const nameParts = (firebaseUser.displayName ?? '').trim().split(/\s+/);
  return api.post<ApiUser>('/api/users', {
    displayName: firebaseUser.displayName ?? '',
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' '),
    email: firebaseUser.email ?? '',
    profilePhoto: firebaseUser.photoURL ?? '',
    firebaseUid: firebaseUser.uid,
  });
}
import type { User, CreateUser, UpdateUser } from '@/types';

/**
 * Get user profile by ID
 *
 * @param userId - User's Firebase Auth UID
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    return await getDocument<User>('users', userId);
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error(`Failed to get user profile: ${(error as Error).message}`);
  }
}

/**
 * Create a new user profile
 *
 * @param userId - User's Firebase Auth UID
 * @param userData - User data (without id, createdAt, updatedAt)
 * @returns void
 */
export async function createUserProfile(
  userId: string,
  userData: CreateUser
): Promise<void> {
  try {
    await setDocument('users', userId, userData);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error(`Failed to create user profile: ${(error as Error).message}`);
  }
}

/**
 * Update user profile
 *
 * @param userId - User's Firebase Auth UID
 * @param updates - Partial user data to update
 * @returns void
 */
export async function updateUserProfile(
  userId: string,
  updates: UpdateUser
): Promise<void> {
  try {
    await updateDocument('users', userId, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(`Failed to update user profile: ${(error as Error).message}`);
  }
}

/**
 * Increment user's goal count
 *
 * @param userId - User's Firebase Auth UID
 * @returns void
 */
export async function incrementGoalCount(userId: string): Promise<void> {
  try {
    const user = await getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await updateUserProfile(userId, {
      goalsCount: user.goalsCount + 1,
    });
  } catch (error) {
    console.error('Error incrementing goal count:', error);
    throw new Error(`Failed to increment goal count: ${(error as Error).message}`);
  }
}

/**
 * Decrement user's goal count
 *
 * @param userId - User's Firebase Auth UID
 * @returns void
 */
export async function decrementGoalCount(userId: string): Promise<void> {
  try {
    const user = await getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await updateUserProfile(userId, {
      goalsCount: Math.max(0, user.goalsCount - 1),
    });
  } catch (error) {
    console.error('Error decrementing goal count:', error);
    throw new Error(`Failed to decrement goal count: ${(error as Error).message}`);
  }
}

/**
 * Update user streak after completing a goal
 *
 * @param userId - User's Firebase Auth UID
 * @returns Updated streak value
 */
export async function updateUserStreak(userId: string): Promise<number> {
  try {
    const user = await getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }

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
        // Consecutive day - increment streak
        newStreak = user.currentStreak + 1;
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        newStreak = 1;
      }
      // daysDiff === 0 means same day - keep current streak
    }

    const updates: UpdateUser = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastCompletionDate: Timestamp.fromDate(now),
      goalsCompletedCount: user.goalsCompletedCount + 1,
    };

    await updateUserProfile(userId, updates);

    return newStreak;
  } catch (error) {
    console.error('Error updating user streak:', error);
    throw new Error(`Failed to update user streak: ${(error as Error).message}`);
  }
}

/**
 * Get users with highest streaks (leaderboard)
 *
 * @param limitCount - Number of users to return
 * @returns Array of users sorted by streak
 */
export async function getTopStreakUsers(limitCount: number = 10): Promise<User[]> {
  try {
    return await getDocuments<User>(
      'users',
      orderBy('currentStreak', 'desc'),
      limit(limitCount)
    );
  } catch (error) {
    console.error('Error getting top streak users:', error);
    throw new Error(`Failed to get top streak users: ${(error as Error).message}`);
  }
}

/**
 * Get users with most completed goals (leaderboard)
 *
 * @param limitCount - Number of users to return
 * @returns Array of users sorted by completed goals
 */
export async function getTopCompletedGoalsUsers(limitCount: number = 10): Promise<User[]> {
  try {
    return await getDocuments<User>(
      'users',
      orderBy('goalsCompletedCount', 'desc'),
      limit(limitCount)
    );
  } catch (error) {
    console.error('Error getting top completed goals users:', error);
    throw new Error(`Failed to get top completed goals users: ${(error as Error).message}`);
  }
}

/**
 * Update user's Google access token
 *
 * @param userId - User's Firebase Auth UID
 * @param accessToken - Google OAuth access token
 * @param expiresIn - Token expiry time in seconds
 * @returns void
 */
export async function updateGoogleAccessToken(
  userId: string,
  accessToken: string,
  expiresIn: number = 3600
): Promise<void> {
  try {
    const expiryDate = new Date(Date.now() + expiresIn * 1000);

    await updateUserProfile(userId, {
      googleAccessToken: accessToken,
      tokenExpiresAt: Timestamp.fromDate(expiryDate),
      calendarConnected: true,
    });
  } catch (error) {
    console.error('Error updating Google access token:', error);
    throw new Error(`Failed to update Google access token: ${(error as Error).message}`);
  }
}

/**
 * Check if user exists
 *
 * @param userId - User's Firebase Auth UID
 * @returns true if user exists, false otherwise
 */
export async function userExists(userId: string): Promise<boolean> {
  try {
    const user = await getUserProfile(userId);
    return user !== null;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}
