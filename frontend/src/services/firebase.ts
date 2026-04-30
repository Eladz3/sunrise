/**
 * Firebase Client Configuration
 *
 * Initializes Firebase app, Auth, and Firestore.
 * Import and use the exported instances throughout the app.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Validate environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const

// Check if all required env vars are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(
    ([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`
  )

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables:\n${missingVars.join('\n')}\n\n` +
      'Please check your .env file and ensure all Firebase variables are set.'
  )
}

// Firebase configuration
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)

  // Connect to emulators in development (if needed)
  // Uncomment when using Firebase Emulator Suite
  // if (import.meta.env.DEV) {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(db, 'localhost', 8080);
  // }
} catch (error) {
  console.error('Failed to initialize Firebase:', error)
  throw error
}

// Export initialized instances
export { app, auth, db }

// Export types for convenience
export type { FirebaseApp, Auth, Firestore }
