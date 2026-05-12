import { client } from './client';
import type { GoalMetrics } from '@/types/metrics.types';

export const getUserMetrics = (userId: number) =>
  client.get<GoalMetrics>(`/api/metrics/users/${userId}`);

export const getGroupMetrics = (groupId: number) =>
  client.get<GoalMetrics>(`/api/metrics/groups/${groupId}`);

export const getGlobalMetrics = () =>
  client.get<GoalMetrics>('/api/metrics/global');
