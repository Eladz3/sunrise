import { api } from '@/services/api';

export interface GoalMetrics {
  participantCount: number;
  totalGoalsCount: number;
  completedGoalsCount: number;
  progressPercentage: number;
}

export async function getUserMetrics(sqlUserId: number): Promise<GoalMetrics> {
  return api.get<GoalMetrics>(`/metrics/by-user-id/${sqlUserId}`);
}
