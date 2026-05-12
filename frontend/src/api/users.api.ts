import { client } from './client';
import type { User, CreateUserRequest } from '@/types/user.types';

export const getUserByFirebaseUid = (firebaseUid: string) =>
  client.get<User>(`/api/users/by-firebase-id/${encodeURIComponent(firebaseUid)}`);

export const createUser = (body: CreateUserRequest) =>
  client.post<User>('/api/users', body);

export const getUserById = (userId: number) =>
  client.get<User>(`/api/users/${userId}`);
