# Config

Application configuration and initialization.

## What belongs here:
- **Firebase config** - Firebase initialization and config
- **Environment variables** - Typed env var access
- **App constants** - Large constant objects, feature flags
- **Third-party configs** - Calendar API, analytics, etc.

## Examples:
- `firebase.ts` - Initialize Firebase app, auth, firestore
- `env.ts` - Typed environment variables
- `calendar.ts` - Google Calendar API configuration
- `constants.ts` - App-wide configuration values

## Example structure:
```typescript
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Note:
- Never commit sensitive values - use .env files
- Export initialized instances, not just config objects
- Keep config separate from business logic
