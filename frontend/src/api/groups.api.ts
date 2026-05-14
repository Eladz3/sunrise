import { client } from './client'
import type { GroupSummary, GroupMemberSummary, CreateGroupRequest, GroupInviteResponse } from '@/types'

export const getGroupsByUserId = (userId: number) =>
  client.get<GroupSummary[]>(`/api/groups/by-user-id/${userId}`)

export const createGroup = (body: CreateGroupRequest) =>
  client.post<GroupSummary>('/api/groups', body)

export const getGroupMembers = (groupId: number) =>
  client.get<GroupMemberSummary[]>(`/api/groups/${groupId}/members`)

export const deleteGroup = (groupId: number, requestingUserId: number) =>
  client.delete(`/api/groups/${groupId}?requestingUserId=${requestingUserId}`)

export const getOrCreateInviteToken = (groupId: number, requestingUserId: number) =>
  client.post<GroupInviteResponse>(`/api/groups/${groupId}/invite?requestingUserId=${requestingUserId}`)

export const joinGroupByToken = (token: string, userId: number) =>
  client.post<GroupSummary>(`/api/groups/join/${token}`, { userId })
