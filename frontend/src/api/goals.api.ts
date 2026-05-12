import { client } from './client';
import type { Goal, CreateGoalRequest, UpdateGoalRequest } from '@/types/goal.types';

export const getAllGoals = () =>
  client.get<Goal[]>('/api/goals');

export const getGoalsByUserId = (userId: number) =>
  client.get<Goal[]>(`/api/goals/by-user-id/${userId}`);

export const getGoalsByGroupId = (groupId: number) =>
  client.get<Goal[]>(`/api/goals/by-group-id/${groupId}`);

export const createGoal = (body: CreateGoalRequest & { userId: number; firebaseUid: string }) =>
  client.post<Goal>('/api/goals', body);

export const updateGoal = (goalId: number, body: UpdateGoalRequest) =>
  client.put<Goal>(`/api/goals/${goalId}`, body);

export const deleteGoal = (goalId: number) =>
  client.delete(`/api/goals/${goalId}`);
