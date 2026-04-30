/**
 * Configuration for Cloud Functions
 *
 * Google OAuth credentials should be set via Firebase environment config:
 * firebase functions:config:set google.client_id="xxx" google.client_secret="xxx"
 */

import { defineString } from 'firebase-functions/params';

// Define environment parameters
export const googleClientId = defineString('GOOGLE_CLIENT_ID');
export const googleClientSecret = defineString('GOOGLE_CLIENT_SECRET');

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  GOALS: 'goals',
  USER_TOKENS: 'userTokens', // Private collection for OAuth tokens
} as const;
