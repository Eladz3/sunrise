import { api } from '@/services/api';

export interface ApiUser {
  id: number;
  firebaseUid: string;
  name: string;
  email: string;
}

export async function syncUser(
  firebaseUid: string,
  name: string,
  email: string
): Promise<ApiUser> {
  return api.post<ApiUser>('/users/sync', { firebaseUid, name, email });
}
