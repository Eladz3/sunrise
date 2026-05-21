/**
 * Firebase Authentication Service
 *
 * Provides methods for user authentication using Firebase Auth.
 * All methods are async and return promises.
 */

import {
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import type { AuthUser, FirebaseError } from '@/types';

/**
 * Google OAuth Provider Configuration
 */
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in with Google popup
 *
 * @returns Promise with user credential
 * @throws FirebaseError if sign-in fails
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error('Google sign-in error:', firebaseError.code, firebaseError.message);
    throw error;
  }
}

/**
 * Sign out current user
 *
 * @returns Promise that resolves when sign-out is complete
 * @throws FirebaseError if sign-out fails
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error('Sign-out error:', firebaseError.code, firebaseError.message);
    throw error;
  }
}

/**
 * Get current authenticated user
 *
 * @returns Current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Convert Firebase User to AuthUser
 *
 * @param user - Firebase User object
 * @returns Simplified AuthUser object
 */
export function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

/**
 * Subscribe to authentication state changes
 *
 * @param callback - Function called when auth state changes
 * @returns Unsubscribe function
 *
 * @example
 * const unsubscribe = onAuthChange((user) => {
 *   if (user) {
 *     console.log('User signed in:', user.email);
 *   } else {
 *     console.log('User signed out');
 *   }
 * });
 *
 * // Clean up when component unmounts
 * return () => unsubscribe();
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if user is authenticated
 *
 * @returns true if user is signed in, false otherwise
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * Get user's ID token (for backend API authentication)
 *
 * @param forceRefresh - Force token refresh
 * @returns Promise with ID token or null if not authenticated
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Failed to get ID token:', error);
    return null;
  }
}
