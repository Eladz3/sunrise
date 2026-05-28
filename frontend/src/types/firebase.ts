import type { User as FirebaseUser } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore'

/**
 * Firebase Authentication Types
 */

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

export type FirebaseAuthUser = FirebaseUser

/**
 * Firebase Error Types
 */

export interface FirebaseError {
  code: string
  message: string
  name: string
}

export type AuthErrorCode = 'auth/invalid-email' | 'auth/user-disabled' | 'auth/user-not-found' | 'auth/wrong-password' | 'auth/email-already-in-use' | 'auth/weak-password' | 'auth/operation-not-allowed' | 'auth/popup-closed-by-user' | 'auth/cancelled-popup-request' | 'auth/network-request-failed' | 'auth/too-many-requests'

/**
 * Firestore Types
 */

export type FirestoreTimestamp = Timestamp

// Helper to convert Firestore Timestamp to Date
export interface TimestampField {
  toDate(): Date
}

// Base document structure with Firestore metadata
export interface FirestoreDocument {
  id: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

// Helper type for creating documents (without id and timestamps)
export type CreateDocument<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// Helper type for updating documents (partial fields, excluding id)
export type UpdateDocument<T> = Partial<Omit<T, 'id' | 'createdAt'>> & {
  updatedAt?: FirestoreTimestamp
}
