/**
 * Central export point for all custom hooks
 * Import hooks like: import { useAuth, useGoals } from '@/hooks'
 */

export { useAuth } from './useAuth';
export { useGoals } from './useGoals';
export { useCommunityGoals, groupGoalsByUser, calculateCommunityProgress } from './useCommunityGoals';
export { useUser } from './useUser';
export { useGlobalStats } from './useGlobalStats';
// export { useCalendar } from './useCalendar';
