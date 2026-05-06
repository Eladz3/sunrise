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

## 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app (e.g., "Sunrise Web App")
5. Copy the `firebaseConfig` object values

## 4. Configure Environment Variables

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

## 5. Configure Google OAuth for Calendar

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable **Google Calendar API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google Calendar API"
   - Click "Enable"
4. The OAuth client is auto-configured by Firebase Auth

## 6. Test the Setup

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

## Next Steps

1. Set up AuthProvider for React context
2. Create protected routes
3. Implement Google Calendar integration
