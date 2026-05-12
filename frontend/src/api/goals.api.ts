import { client } from './client';
import type { Goal, CreateGoalRequest, UpdateGoalRequest } from '@/types/goal.types';

export const getGoalsByUserId = (userId: number) =>
  client.get<Goal[]>(`/api/goals/by-user/${userId}`);

export const getGoalsByGroupId = (groupId: number) =>
  client.get<Goal[]>(`/api/goals/by-group/${groupId}`);

export const createGoal = (body: CreateGoalRequest & { firebaseUid: string }) =>
  client.post<Goal>('/api/goals', body);

export const updateGoal = (goalId: number, body: UpdateGoalRequest) =>
  client.put<Goal>(`/api/goals/${goalId}`, body);

export const deleteGoal = (goalId: number) =>
  client.delete(`/api/goals/${goalId}`);
