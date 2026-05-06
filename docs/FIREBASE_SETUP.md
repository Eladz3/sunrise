# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name and follow the setup wizard
4. Choose Spark (free) plan

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider
3. Add your app domain to authorized domains (for production)

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Test mode** (for development)
4. Choose a location (closest to your users)

**Important:** Set up proper security rules before going to production!

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app (e.g., "Community Web App")
5. Copy the `firebaseConfig` object values

## 5. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config values in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Never commit `.env` to Git!** (already in `.gitignore`)

## 6. Configure Google OAuth for Calendar

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable **Google Calendar API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google Calendar API"
   - Click "Enable"
4. The OAuth client is auto-configured by Firebase Auth

## 7. Set Up Firestore Security Rules (Important!)

Before deploying to production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Example: Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Example: Events collection
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() &&
        resource.data.createdBy == request.auth.uid;
    }
  }
}
```

## 8. Test the Setup

Run the development server:
```bash
npm run dev
```

The app should start without errors. Check the browser console for any Firebase initialization errors.

## Troubleshooting

### "Missing required Firebase environment variables"
- Make sure you created a `.env` file (not just `.env.example`)
- Check that all `VITE_FIREBASE_*` variables are set
- Restart the dev server after adding env variables

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add your domain (e.g., `localhost` for development)

### "Failed to get document: Missing or insufficient permissions"
- Check Firestore security rules
- Make sure you're authenticated before accessing Firestore
- In development, you can use test mode (allow read, write: if true)

## Free Tier Limits

Firebase Spark (free) plan includes:
- **Firestore**: 1 GiB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB storage, 360 MB/day bandwidth

For a small community app, this should be sufficient!

## Next Steps

1. Set up AuthProvider for React context
2. Create protected routes
3. Build your first Firestore collection
4. Implement Google Calendar integration
