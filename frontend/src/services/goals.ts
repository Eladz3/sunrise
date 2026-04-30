/**
 * Goals Service
 *
 * Firestore operations for goals management.
 */

import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
} from './firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import type {
  Goal,
  CreateGoal,
  UpdateGoal,
  GoalCategory,
  GoalStatus,
  GoalPriority,
} from '@/types';
import { incrementGoalCount, decrementGoalCount, updateUserStreak } from './users';

/**
 * Calculate days until due date
 *
 * @param dueDate - Goal due date
 * @returns Number of days until due (negative if overdue)
 */
function calculateDaysUntilDue(dueDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Start of due date

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if goal is overdue
 *
 * @param dueDate - Goal due date
 * @returns true if overdue, false otherwise
 */
function isGoalOverdue(dueDate: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < now.getTime();
}

/**
 * Create a new goal
 *
 * @param goalData - Goal data to create
 * @returns Created goal ID
 */
export async function createGoal(goalData: CreateGoal): Promise<string> {
  try {
    // Calculate computed fields
    const dueDate = goalData.dueDate.toDate();
    const goalWithComputedFields: CreateGoal = {
      ...goalData,
      daysUntilDue: calculateDaysUntilDue(dueDate),
      isOverdue: isGoalOverdue(dueDate),
    };

    // Create goal document
    const goalId = await createDocument('goals', goalWithComputedFields);

    // Increment user's goal count
    await incrementGoalCount(goalData.userId);

    return goalId;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw new Error(`Failed to create goal: ${(error as Error).message}`);
  }
}

/**
 * Get a goal by ID
 *
 * @param goalId - Goal ID
 * @returns Goal or null if not found
 */
export async function getGoal(goalId: string): Promise<Goal | null> {
  try {
    return await getDocument<Goal>('goals', goalId);
  } catch (error) {
    console.error('Error getting goal:', error);
    throw new Error(`Failed to get goal: ${(error as Error).message}`);
  }
}

/**
 * Get all goals for a user
 *
 * @param userId - User's Firebase Auth UID
 * @returns Array of user's goals
 */
export async function getUserGoals(userId: string): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    );
  } catch (error) {
    console.error('Error getting user goals:', error);
    throw new Error(`Failed to get user goals: ${(error as Error).message}`);
  }
}

/**
 * Get user's active goals (todo or in_progress)
 *
 * @param userId - User's Firebase Auth UID
 * @returns Array of active goals
 */
export async function getActiveGoals(userId: string): Promise<Goal[]> {
  try {
    const allGoals = await getUserGoals(userId);
    return allGoals.filter(
      (goal) => goal.status === 'todo' || goal.status === 'in_progress'
    );
  } catch (error) {
    console.error('Error getting active goals:', error);
    throw new Error(`Failed to get active goals: ${(error as Error).message}`);
  }
}

/**
 * Get user's completed goals
 *
 * @param userId - User's Firebase Auth UID
 * @returns Array of completed goals
 */
export async function getCompletedGoals(userId: string): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc')
    );
  } catch (error) {
    console.error('Error getting completed goals:', error);
    throw new Error(`Failed to get completed goals: ${(error as Error).message}`);
  }
}

/**
 * Get user's overdue goals
 *
 * @param userId - User's Firebase Auth UID
 * @returns Array of overdue goals
 */
export async function getOverdueGoals(userId: string): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      where('isOverdue', '==', true),
      orderBy('dueDate', 'asc')
    );
  } catch (error) {
    console.error('Error getting overdue goals:', error);
    throw new Error(`Failed to get overdue goals: ${(error as Error).message}`);
  }
}

/**
 * Get user's goals by category
 *
 * @param userId - User's Firebase Auth UID
 * @param category - Goal category
 * @returns Array of goals in the category
 */
export async function getGoalsByCategory(
  userId: string,
  category: GoalCategory
): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('dueDate', 'asc')
    );
  } catch (error) {
    console.error('Error getting goals by category:', error);
    throw new Error(`Failed to get goals by category: ${(error as Error).message}`);
  }
}

/**
 * Get user's goals by status
 *
 * @param userId - User's Firebase Auth UID
 * @param status - Goal status
 * @returns Array of goals with the status
 */
export async function getGoalsByStatus(
  userId: string,
  status: GoalStatus
): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('dueDate', 'asc')
    );
  } catch (error) {
    console.error('Error getting goals by status:', error);
    throw new Error(`Failed to get goals by status: ${(error as Error).message}`);
  }
}

/**
 * Get user's goals by priority
 *
 * @param userId - User's Firebase Auth UID
 * @param priority - Goal priority
 * @returns Array of goals with the priority
 */
export async function getGoalsByPriority(
  userId: string,
  priority: GoalPriority
): Promise<Goal[]> {
  try {
    return await getDocuments<Goal>(
      'goals',
      where('userId', '==', userId),
      where('priority', '==', priority),
      orderBy('dueDate', 'asc')
    );
  } catch (error) {
    console.error('Error getting goals by priority:', error);
    throw new Error(`Failed to get goals by priority: ${(error as Error).message}`);
  }
}

/**
 * Update a goal
 *
 * @param goalId - Goal ID
 * @param updates - Partial goal data to update
 * @returns void
 */
export async function updateGoal(
  goalId: string,
  updates: UpdateGoal
): Promise<void> {
  try {
    // Recalculate computed fields if dueDate changed
    let computedUpdates: UpdateGoal = { ...updates };

    if (updates.dueDate) {
      const dueDate = updates.dueDate.toDate();
      computedUpdates = {
        ...computedUpdates,
        daysUntilDue: calculateDaysUntilDue(dueDate),
        isOverdue: isGoalOverdue(dueDate),
      };
    }

    await updateDocument('goals', goalId, computedUpdates);
  } catch (error) {
    console.error('Error updating goal:', error);
    throw new Error(`Failed to update goal: ${(error as Error).message}`);
  }
}

/**
 * Update goal progress (status and notes)
 *
 * @param goalId - Goal ID
 * @param status - New status
 * @param notes - Progress notes
 * @returns void
 */
export async function updateGoalProgress(
  goalId: string,
  status: GoalStatus,
  notes?: string
): Promise<void> {
  try {
    const updates: UpdateGoal = { status };

    if (notes !== undefined) {
      updates.notes = notes;
    }

    await updateGoal(goalId, updates);
  } catch (error) {
    console.error('Error updating goal progress:', error);
    throw new Error(`Failed to update goal progress: ${(error as Error).message}`);
  }
}

/**
 * Mark a goal as completed
 *
 * @param goalId - Goal ID
 * @param userId - User's Firebase Auth UID
 * @returns Updated streak value
 */
export async function completeGoal(goalId: string, userId: string): Promise<number> {
  try {
    // Update goal status
    const updates: UpdateGoal = {
      status: 'completed',
      completedAt: Timestamp.fromDate(new Date()),
    };

    await updateGoal(goalId, updates);

    // Update user streak and completed count
    const newStreak = await updateUserStreak(userId);

    return newStreak;
  } catch (error) {
    console.error('Error completing goal:', error);
    throw new Error(`Failed to complete goal: ${(error as Error).message}`);
  }
}

/**
 * Mark a goal as in progress
 *
 * @param goalId - Goal ID
 * @param notes - Optional progress notes
 * @returns void
 */
export async function startGoal(goalId: string, notes?: string): Promise<void> {
  try {
    await updateGoalProgress(goalId, 'in_progress', notes);
  } catch (error) {
    console.error('Error starting goal:', error);
    throw new Error(`Failed to start goal: ${(error as Error).message}`);
  }
}

/**
 * Cancel a goal
 *
 * @param goalId - Goal ID
 * @returns void
 */
export async function cancelGoal(goalId: string): Promise<void> {
  try {
    await updateGoalProgress(goalId, 'cancelled');
  } catch (error) {
    console.error('Error cancelling goal:', error);
    throw new Error(`Failed to cancel goal: ${(error as Error).message}`);
  }
}

/**
 * Archive a goal
 *
 * @param goalId - Goal ID
 * @returns void
 */
export async function archiveGoal(goalId: string): Promise<void> {
  try {
    await updateGoalProgress(goalId, 'archived');
  } catch (error) {
    console.error('Error archiving goal:', error);
    throw new Error(`Failed to archive goal: ${(error as Error).message}`);
  }
}

/**
 * Delete a goal
 *
 * @param goalId - Goal ID
 * @param userId - User's Firebase Auth UID
 * @returns void
 */
export async function deleteGoal(goalId: string, userId: string): Promise<void> {
  try {
    // Delete goal document
    await deleteDocument('goals', goalId);

    // Decrement user's goal count
    await decrementGoalCount(userId);
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw new Error(`Failed to delete goal: ${(error as Error).message}`);
  }
}

/**
 * Update computed fields for all user goals
 * (useful for maintenance or after date changes)
 *
 * @param userId - User's Firebase Auth UID
 * @returns Number of goals updated
 */
export async function updateAllGoalComputedFields(userId: string): Promise<number> {
  try {
    const goals = await getUserGoals(userId);
    let updatedCount = 0;

    for (const goal of goals) {
      const dueDate = goal.dueDate.toDate();
      const newDaysUntilDue = calculateDaysUntilDue(dueDate);
      const newIsOverdue = isGoalOverdue(dueDate);

      // Only update if values changed
      if (
        goal.daysUntilDue !== newDaysUntilDue ||
        goal.isOverdue !== newIsOverdue
      ) {
        await updateGoal(goal.id, {
          daysUntilDue: newDaysUntilDue,
          isOverdue: newIsOverdue,
        });
        updatedCount++;
      }
    }

    return updatedCount;
  } catch (error) {
    console.error('Error updating all goal computed fields:', error);
    throw new Error(`Failed to update computed fields: ${(error as Error).message}`);
  }
}

/**
 * Get upcoming goals (due in the next N days)
 *
 * @param userId - User's Firebase Auth UID
 * @param days - Number of days to look ahead (default: 7)
 * @returns Array of upcoming goals
 */
export async function getUpcomingGoals(
  userId: string,
  days: number = 7
): Promise<Goal[]> {
  try {
    const goals = await getActiveGoals(userId);

    return goals.filter((goal) => {
      const daysUntil = goal.daysUntilDue;
      return daysUntil >= 0 && daysUntil <= days;
    });
  } catch (error) {
    console.error('Error getting upcoming goals:', error);
    throw new Error(`Failed to get upcoming goals: ${(error as Error).message}`);
  }
}

/**
 * Search goals by title or tags
 *
 * @param userId - User's Firebase Auth UID
 * @param searchTerm - Search term
 * @returns Array of matching goals
 */
export async function searchGoals(
  userId: string,
  searchTerm: string
): Promise<Goal[]> {
  try {
    const goals = await getUserGoals(userId);
    const lowerSearch = searchTerm.toLowerCase();

    return goals.filter((goal) => {
      const titleMatch = goal.title.toLowerCase().includes(lowerSearch);
      const tagMatch = goal.tags.some((tag) =>
        tag.toLowerCase().includes(lowerSearch)
      );
      const descMatch = goal.description.toLowerCase().includes(lowerSearch);

      return titleMatch || tagMatch || descMatch;
    });
  } catch (error) {
    console.error('Error searching goals:', error);
    throw new Error(`Failed to search goals: ${(error as Error).message}`);
  }
}
