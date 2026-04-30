/**
 * Calendar Service
 *
 * Frontend service for Google Calendar integration.
 * Communicates with Cloud Functions for secure operations.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

// Initialize Functions
const functions = getFunctions();

// Callable function references
const connectCalendarFn = httpsCallable<{ authCode: string }, { success: boolean }>(
  functions,
  'connectCalendar'
);

const disconnectCalendarFn = httpsCallable<void, { success: boolean }>(
  functions,
  'disconnectCalendar'
);

const syncGoalToCalendarFn = httpsCallable<
  { goalId: string },
  { success: boolean; eventId: string }
>(functions, 'syncGoalToCalendar');

const removeCalendarEventFn = httpsCallable<{ goalId: string }, { success: boolean }>(
  functions,
  'removeCalendarEvent'
);

/**
 * Connect Google Calendar
 *
 * Opens OAuth popup, gets authorization code, and sends to Cloud Function.
 */
export async function connectCalendar(): Promise<void> {
  // Create provider with calendar scopes
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  provider.setCustomParameters({
    access_type: 'offline', // Request refresh token
    prompt: 'consent', // Force consent to get refresh token
  });

  try {
    // Sign in to get authorization code
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Failed to get authorization credentials');
    }

    // The accessToken from popup can be used as auth code for server
    // Note: For proper offline access, you may need to use a different OAuth flow
    // This is a simplified approach - see notes below
    await connectCalendarFn({ authCode: credential.accessToken });
  } catch (error) {
    console.error('Error connecting calendar:', error);
    throw new Error('Failed to connect Google Calendar');
  }
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectCalendar(): Promise<void> {
  try {
    await disconnectCalendarFn();
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    throw new Error('Failed to disconnect Google Calendar');
  }
}

/**
 * Sync a goal to Google Calendar
 *
 * Creates or updates the calendar event for a goal.
 */
export async function syncGoalToCalendar(goalId: string): Promise<string> {
  try {
    const result = await syncGoalToCalendarFn({ goalId });
    return result.data.eventId;
  } catch (error) {
    console.error('Error syncing goal to calendar:', error);
    throw new Error('Failed to sync goal to calendar');
  }
}

/**
 * Remove calendar event for a goal
 */
export async function removeCalendarEvent(goalId: string): Promise<void> {
  try {
    await removeCalendarEventFn({ goalId });
  } catch (error) {
    console.error('Error removing calendar event:', error);
    throw new Error('Failed to remove calendar event');
  }
}
