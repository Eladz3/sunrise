/**
 * Goal Utility Functions
 *
 * Helper functions for goal calculations and transformations.
 */

import type { Goal, GoalStatus, GoalPriority } from '@/types';

/**
 * Calculate days until due date
 *
 * @param dueDate - Goal due date
 * @returns Number of days until due (negative if overdue)
 */
export function calculateDaysUntilDue(dueDate: Date): number {
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
export function isOverdue(dueDate: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < now.getTime();
}

/**
 * Check if goal is active (todo or in_progress)
 *
 * @param goal - Goal object
 * @returns true if active, false otherwise
 */
export function isGoalActive(goal: Goal): boolean {
  return goal.status === 'todo' || goal.status === 'in_progress';
}

/**
 * Check if goal is completed
 *
 * @param goal - Goal object
 * @returns true if completed, false otherwise
 */
export function isGoalCompleted(goal: Goal): boolean {
  return goal.status === 'completed';
}

/**
 * Check if goal is high priority (high or urgent)
 *
 * @param goal - Goal object
 * @returns true if high priority, false otherwise
 */
export function isHighPriority(goal: Goal): boolean {
  return goal.priority === 'high' || goal.priority === 'urgent';
}

/**
 * Check if goal is recurring
 *
 * @param goal - Goal object
 * @returns true if recurring, false otherwise
 */
export function isRecurring(goal: Goal): boolean {
  return goal.recurring && goal.recurrencePattern !== null;
}

/**
 * Get goal status label
 *
 * @param status - Goal status
 * @returns Human-readable status label
 */
export function getStatusLabel(status: GoalStatus): string {
  const labels: Record<GoalStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    archived: 'Archived',
  };

  return labels[status];
}

/**
 * Get goal priority label
 *
 * @param priority - Goal priority
 * @returns Human-readable priority label
 */
export function getPriorityLabel(priority: GoalPriority): string {
  const labels: Record<GoalPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };

  return labels[priority];
}

/**
 * Get priority color (for UI)
 *
 * @param priority - Goal priority
 * @returns Tailwind color class
 */
export function getPriorityColor(priority: GoalPriority): string {
  const colors: Record<GoalPriority, string> = {
    low: 'text-warmGray-600',
    medium: 'text-sunrise-600',
    high: 'text-dawn-600',
    urgent: 'text-red-600',
  };

  return colors[priority];
}

/**
 * Get status color (for UI)
 *
 * @param status - Goal status
 * @returns Tailwind color class
 */
export function getStatusColor(status: GoalStatus): string {
  const colors: Record<GoalStatus, string> = {
    todo: 'text-warmGray-600',
    in_progress: 'text-sunrise-600',
    completed: 'text-green-600',
    cancelled: 'text-red-600',
    archived: 'text-warmGray-400',
  };

  return colors[status];
}

/**
 * Sort goals by due date (ascending)
 *
 * @param goals - Array of goals
 * @returns Sorted array
 */
export function sortByDueDate(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    const dateA = a.dueDate.toDate().getTime();
    const dateB = b.dueDate.toDate().getTime();
    return dateA - dateB;
  });
}

/**
 * Sort goals by priority (urgent first)
 *
 * @param goals - Array of goals
 * @returns Sorted array
 */
export function sortByPriority(goals: Goal[]): Goal[] {
  const priorityOrder: Record<GoalPriority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...goals].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Group goals by category
 *
 * @param goals - Array of goals
 * @returns Goals grouped by category
 */
export function groupByCategory(goals: Goal[]): Record<string, Goal[]> {
  return goals.reduce((acc, goal) => {
    const category = goal.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);
}

/**
 * Group goals by status
 *
 * @param goals - Array of goals
 * @returns Goals grouped by status
 */
export function groupByStatus(goals: Goal[]): Record<GoalStatus, Goal[]> {
  const grouped: Record<GoalStatus, Goal[]> = {
    todo: [],
    in_progress: [],
    completed: [],
    cancelled: [],
    archived: [],
  };

  goals.forEach((goal) => {
    grouped[goal.status].push(goal);
  });

  return grouped;
}

/**
 * Filter active goals
 *
 * @param goals - Array of goals
 * @returns Active goals only
 */
export function filterActiveGoals(goals: Goal[]): Goal[] {
  return goals.filter(isGoalActive);
}

/**
 * Filter completed goals
 *
 * @param goals - Array of goals
 * @returns Completed goals only
 */
export function filterCompletedGoals(goals: Goal[]): Goal[] {
  return goals.filter(isGoalCompleted);
}

/**
 * Filter overdue goals
 *
 * @param goals - Array of goals
 * @returns Overdue goals only
 */
export function filterOverdueGoals(goals: Goal[]): Goal[] {
  return goals.filter((goal) => goal.isOverdue && isGoalActive(goal));
}

/**
 * Filter high priority goals
 *
 * @param goals - Array of goals
 * @returns High priority goals only
 */
export function filterHighPriorityGoals(goals: Goal[]): Goal[] {
  return goals.filter(isHighPriority);
}

/**
 * Calculate completion percentage for a list of goals
 *
 * @param goals - Array of goals
 * @returns Completion percentage (0-100)
 */
export function calculateCompletionRate(goals: Goal[]): number {
  if (goals.length === 0) return 0;

  const completed = goals.filter(isGoalCompleted).length;
  return (completed / goals.length) * 100;
}

/**
 * Get goals due today
 *
 * @param goals - Array of goals
 * @returns Goals due today
 */
export function getGoalsDueToday(goals: Goal[]): Goal[] {
  return goals.filter((goal) => goal.daysUntilDue === 0 && isGoalActive(goal));
}

/**
 * Get goals due this week (next 7 days)
 *
 * @param goals - Array of goals
 * @returns Goals due this week
 */
export function getGoalsDueThisWeek(goals: Goal[]): Goal[] {
  return goals.filter(
    (goal) => goal.daysUntilDue >= 0 && goal.daysUntilDue <= 7 && isGoalActive(goal)
  );
}

/**
 * Format due date for display
 *
 * @param dueDate - Goal due date
 * @returns Formatted date string
 */
export function formatDueDate(dueDate: Date): string {
  const now = new Date();
  const due = new Date(dueDate);

  // Reset time parts for comparison
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;

  return due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== due.getFullYear() ? 'numeric' : undefined,
  });
}
