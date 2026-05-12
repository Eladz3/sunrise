import { client } from './client';
import type { Group, CreateGroupRequest } from '@/types/group.types';

export const getGroupsByUserId = (userId: number) =>
  client.get<Group[]>(`/api/groups/by-user-id/${userId}`);

export const getGroupById = (groupId: number) =>
  client.get<Group>(`/api/groups/${groupId}`);

export const createGroup = (body: CreateGroupRequest) =>
  client.post<Group>('/api/groups', body);

export const getUsersByGroupId = (groupId: number) =>
  client.get<{ userId: number }[]>(`/api/groups/${groupId}/members`);
