/**
 * Global Stats Service
 *
 * Firestore operations for community-wide statistics.
 */

import {
  getDocument,
  setDocument,
  updateDocument,
  getDocuments,
  where,
} from './firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import type { GlobalStats, User, Goal, GoalCategory, UpdateGlobalStats } from '@/types';

const STATS_DOCUMENT_ID = 'current';

/**
 * Get global statistics
 *
 * @returns Global stats or null if not found
 */
export async function getGlobalStats(): Promise<GlobalStats | null> {
  try {
    return await getDocument<GlobalStats>('globalStats', STATS_DOCUMENT_ID);
  } catch (error) {
    console.error('Error getting global stats:', error);
    throw new Error(`Failed to get global stats: ${(error as Error).message}`);
  }
}

/**
 * Initialize global stats document
 * (Should be run once during app setup)
 *
 * @returns void
 */
export async function initializeGlobalStats(): Promise<void> {
  try {
    const existingStats = await getGlobalStats();

    if (existingStats) {
      console.log('Global stats already initialized');
      return;
    }

    const initialStats: Omit<GlobalStats, 'createdAt' | 'updatedAt'> = {
      id: STATS_DOCUMENT_ID,
      totalUsers: 0,
      totalGoals: 0,
      totalGoalsCompleted: 0,
      totalGoalsInProgress: 0,
      completionRate: 0,
      activeUsersLast7Days: 0,
      activeUsersLast30Days: 0,
      goalsCompletedToday: 0,
      goalsCompletedThisWeek: 0,
      goalsCompletedThisMonth: 0,
      popularCategory: 'personal',
      categoryDistribution: {
        personal: 0,
        work: 0,
        health: 0,
        learning: 0,
        social: 0,
        finance: 0,
        other: 0,
      },
      statusDistribution: {
        todo: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        archived: 0,
      },
      averageGoalsPerUser: 0,
      averageCompletionTimeDays: 0,
      highestStreak: 0,
      highestStreakUserId: null,
      lastUpdated: Timestamp.fromDate(new Date()),
    };

    await setDocument('globalStats', STATS_DOCUMENT_ID, initialStats);
    console.log('Global stats initialized successfully');
  } catch (error) {
    console.error('Error initializing global stats:', error);
    throw new Error(`Failed to initialize global stats: ${(error as Error).message}`);
  }
}

/**
 * Update global statistics
 *
 * @param updates - Partial stats to update
 * @returns void
 */
export async function updateGlobalStats(updates: UpdateGlobalStats): Promise<void> {
  try {
    const updatesWithTimestamp: UpdateGlobalStats = {
      ...updates,
      lastUpdated: Timestamp.fromDate(new Date()),
    };

    await updateDocument('globalStats', STATS_DOCUMENT_ID, updatesWithTimestamp);
  } catch (error) {
    console.error('Error updating global stats:', error);
    throw new Error(`Failed to update global stats: ${(error as Error).message}`);
  }
}

/**
 * Recalculate all global statistics
 * (Expensive operation - should be run periodically via Cloud Functions)
 *
 * @returns Updated global stats
 */
export async function recalculateGlobalStats(): Promise<GlobalStats> {
  try {
    console.log('Starting global stats recalculation...');

    // Get all users
    const users = await getDocuments<User>('users');

    // Get all public goals
    const allGoals = await getDocuments<Goal>('goals', where('isPublic', '==', true));

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

    allGoals.forEach((goal) => {
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

    allGoals.forEach((goal) => {
      statusDist[goal.status]++;
    });

    // Find most popular category
    const popularCategory = (Object.entries(categoryDist).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as GoalCategory) || 'personal';

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
      allGoals.length > 0 ? (statusDist.completed / allGoals.length) * 100 : 0;

    // Calculate active users
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeUsersLast7Days = users.filter((user) => {
      if (!user.lastCompletionDate) return false;
      return user.lastCompletionDate.toDate() >= sevenDaysAgo;
    }).length;

    const activeUsersLast30Days = users.filter((user) => {
      if (!user.lastCompletionDate) return false;
      return user.lastCompletionDate.toDate() >= thirtyDaysAgo;
    }).length;

    // Calculate time-based completed goals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedGoals = allGoals.filter((goal) => goal.status === 'completed');

    const goalsCompletedToday = completedGoals.filter((goal) => {
      if (!goal.completedAt) return false;
      const completedDate = goal.completedAt.toDate();
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    const goalsCompletedThisWeek = completedGoals.filter((goal) => {
      if (!goal.completedAt) return false;
      return goal.completedAt.toDate() >= startOfWeek;
    }).length;

    const goalsCompletedThisMonth = completedGoals.filter((goal) => {
      if (!goal.completedAt) return false;
      return goal.completedAt.toDate() >= startOfMonth;
    }).length;

    // Calculate average completion time
    let totalCompletionDays = 0;
    let completedGoalsWithTime = 0;

    completedGoals.forEach((goal) => {
      if (goal.completedAt) {
        const created = goal.createdAt.toDate();
        const completed = goal.completedAt.toDate();
        const days = Math.ceil(
          (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalCompletionDays += days;
        completedGoalsWithTime++;
      }
    });

    const averageCompletionTimeDays =
      completedGoalsWithTime > 0 ? totalCompletionDays / completedGoalsWithTime : 0;

    // Calculate average goals per user
    const averageGoalsPerUser = users.length > 0 ? allGoals.length / users.length : 0;

    // Create updated stats object
    const updatedStats: Omit<GlobalStats, 'createdAt' | 'updatedAt'> = {
      id: STATS_DOCUMENT_ID,
      totalUsers: users.length,
      totalGoals: allGoals.length,
      totalGoalsCompleted: statusDist.completed,
      totalGoalsInProgress: statusDist.in_progress,
      completionRate,
      activeUsersLast7Days,
      activeUsersLast30Days,
      goalsCompletedToday,
      goalsCompletedThisWeek,
      goalsCompletedThisMonth,
      popularCategory,
      categoryDistribution: categoryDist,
      statusDistribution: statusDist,
      averageGoalsPerUser,
      averageCompletionTimeDays,
      highestStreak,
      highestStreakUserId,
      lastUpdated: Timestamp.fromDate(new Date()),
    };

    await setDocument('globalStats', STATS_DOCUMENT_ID, updatedStats);

    console.log('Global stats recalculated successfully');

    // Fetch and return updated stats
    const result = await getGlobalStats();
    if (!result) {
      throw new Error('Failed to retrieve updated stats');
    }

    return result;
  } catch (error) {
    console.error('Error recalculating global stats:', error);
    throw new Error(`Failed to recalculate global stats: ${(error as Error).message}`);
  }
}

/**
 * Increment total users count
 *
 * @returns void
 */
export async function incrementTotalUsers(): Promise<void> {
  try {
    const stats = await getGlobalStats();
    if (!stats) {
      await initializeGlobalStats();
      return incrementTotalUsers();
    }

    await updateGlobalStats({
      totalUsers: stats.totalUsers + 1,
    });
  } catch (error) {
    console.error('Error incrementing total users:', error);
    throw new Error(`Failed to increment total users: ${(error as Error).message}`);
  }
}

/**
 * Increment total goals count
 *
 * @returns void
 */
export async function incrementTotalGoals(): Promise<void> {
  try {
    const stats = await getGlobalStats();
    if (!stats) {
      await initializeGlobalStats();
      return incrementTotalGoals();
    }

    await updateGlobalStats({
      totalGoals: stats.totalGoals + 1,
    });
  } catch (error) {
    console.error('Error incrementing total goals:', error);
    throw new Error(`Failed to increment total goals: ${(error as Error).message}`);
  }
}

/**
 * Decrement total goals count
 *
 * @returns void
 */
export async function decrementTotalGoals(): Promise<void> {
  try {
    const stats = await getGlobalStats();
    if (!stats) {
      return;
    }

    await updateGlobalStats({
      totalGoals: Math.max(0, stats.totalGoals - 1),
    });
  } catch (error) {
    console.error('Error decrementing total goals:', error);
    throw new Error(`Failed to decrement total goals: ${(error as Error).message}`);
  }
}

/**
 * Get stats summary for display
 *
 * @returns Formatted stats summary
 */
export async function getStatsSummary(): Promise<{
  totalUsers: number;
  totalGoals: number;
  completionRate: string;
  activeUsers: number;
  popularCategory: string;
  highestStreak: number;
} | null> {
  try {
    const stats = await getGlobalStats();

    if (!stats) {
      return null;
    }

    return {
      totalUsers: stats.totalUsers,
      totalGoals: stats.totalGoals,
      completionRate: `${stats.completionRate.toFixed(1)}%`,
      activeUsers: stats.activeUsersLast7Days,
      popularCategory: stats.popularCategory,
      highestStreak: stats.highestStreak,
    };
  } catch (error) {
    console.error('Error getting stats summary:', error);
    throw new Error(`Failed to get stats summary: ${(error as Error).message}`);
  }
}
