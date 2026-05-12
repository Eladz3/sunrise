import { client } from '@/api/client'
import type { User } from '@/types'

export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
  try {
    return await client.get<User>(`/api/users/by-firebase-id/${encodeURIComponent(firebaseUid)}`)
  } catch (error) {
    if ((error as Error).message.startsWith('API 404')) return null
    throw error
  }
}

// Upserts the SQL user record on every sign-in so profile data stays in sync with Firebase/Google.
export async function syncBackendUser(firebaseUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }): Promise<User> {
  const existing = await getUserByFirebaseUid(firebaseUser.uid)

  if (existing) {
    return client.patch<User>(`/api/users/${existing.id}`, {
      displayName: firebaseUser.displayName ?? '',
      profilePhoto: firebaseUser.photoURL ?? '',
      email: firebaseUser.email ?? '',
    })
  }

  const nameParts = (firebaseUser.displayName ?? '').trim().split(/\s+/)
  return client.post<User>('/api/users', {
    displayName: firebaseUser.displayName ?? '',
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' '),
    email: firebaseUser.email ?? '',
    profilePhoto: firebaseUser.photoURL ?? '',
    firebaseUid: firebaseUser.uid,
  })
}
