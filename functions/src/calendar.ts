/**
 * Google Calendar Service
 *
 * Handles OAuth token management and Calendar API operations.
 */

import { google, calendar_v3 } from 'googleapis';
import * as admin from 'firebase-admin';
import { googleClientId, googleClientSecret, COLLECTIONS } from './config';

// Token data stored in Firestore
interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

// Goal data from Firestore
interface Goal {
  id: string;
  title: string;
  description: string;
  dueDate: admin.firestore.Timestamp;
  calendarEventId: string | null;
}

/**
 * Create OAuth2 client with stored credentials
 */
function createOAuth2Client() {
  return new google.auth.OAuth2(
    googleClientId.value(),
    googleClientSecret.value(),
    'postmessage' // For popup-based OAuth flow
  );
}

/**
 * Get valid access token for a user
 * Automatically refreshes if expired
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const db = admin.firestore();
  const tokenDoc = await db.collection(COLLECTIONS.USER_TOKENS).doc(userId).get();

  if (!tokenDoc.exists) {
    throw new Error('Calendar not connected. Please connect your Google Calendar first.');
  }

  const tokens = tokenDoc.data() as StoredTokens;
  const now = admin.firestore.Timestamp.now();

  // Check if token is still valid (with 5 min buffer)
  const expiresAt = tokens.expiresAt.toMillis();
  const bufferMs = 5 * 60 * 1000;

  if (expiresAt - bufferMs > now.toMillis()) {
    return tokens.accessToken;
  }

  // Token expired - refresh it
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: tokens.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  // Calculate new expiry (default 1 hour if not provided)
  const expiresIn = credentials.expiry_date
    ? credentials.expiry_date
    : Date.now() + 3600 * 1000;

  // Update stored tokens
  await db.collection(COLLECTIONS.USER_TOKENS).doc(userId).update({
    accessToken: credentials.access_token,
    expiresAt: admin.firestore.Timestamp.fromMillis(expiresIn),
    updatedAt: admin.firestore.Timestamp.now(),
  });

  return credentials.access_token;
}

/**
 * Store OAuth tokens after user connects calendar
 */
export async function storeTokens(
  userId: string,
  authCode: string
): Promise<void> {
  const oauth2Client = createOAuth2Client();

  // Exchange authorization code for tokens
  const { tokens } = await oauth2Client.getToken(authCode);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Failed to obtain tokens from authorization code');
  }

  const expiresAt = tokens.expiry_date
    ? admin.firestore.Timestamp.fromMillis(tokens.expiry_date)
    : admin.firestore.Timestamp.fromMillis(Date.now() + 3600 * 1000);

  const db = admin.firestore();

  // Store tokens in private collection
  await db.collection(COLLECTIONS.USER_TOKENS).doc(userId).set({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
    updatedAt: admin.firestore.Timestamp.now(),
  });

  // Update user profile
  await db.collection(COLLECTIONS.USERS).doc(userId).update({
    calendarConnected: true,
    updatedAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Delete stored tokens and disconnect calendar
 */
export async function deleteTokens(userId: string): Promise<void> {
  const db = admin.firestore();

  // Delete tokens
  await db.collection(COLLECTIONS.USER_TOKENS).doc(userId).delete();

  // Update user profile
  await db.collection(COLLECTIONS.USERS).doc(userId).update({
    calendarConnected: false,
    updatedAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Get authenticated Calendar API client
 */
async function getCalendarClient(userId: string): Promise<calendar_v3.Calendar> {
  const accessToken = await getValidAccessToken(userId);
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Create a calendar event for a goal
 */
export async function createCalendarEvent(
  userId: string,
  goal: Goal
): Promise<string> {
  const calendar = await getCalendarClient(userId);

  const dueDate = goal.dueDate.toDate();

  // Create all-day event on due date
  const event: calendar_v3.Schema$Event = {
    summary: `🎯 ${goal.title}`,
    description: goal.description || 'Goal created in NYR app',
    start: {
      date: formatDate(dueDate),
    },
    end: {
      date: formatDate(dueDate),
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 * 24 }, // 1 day before
        { method: 'popup', minutes: 60 * 2 },  // 2 hours before
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  if (!response.data.id) {
    throw new Error('Failed to create calendar event');
  }

  // Update goal with calendar event ID
  const db = admin.firestore();
  await db.collection(COLLECTIONS.GOALS).doc(goal.id).update({
    calendarEventId: response.data.id,
    updatedAt: admin.firestore.Timestamp.now(),
  });

  return response.data.id;
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(
  userId: string,
  goal: Goal
): Promise<void> {
  if (!goal.calendarEventId) {
    throw new Error('Goal has no associated calendar event');
  }

  const calendar = await getCalendarClient(userId);
  const dueDate = goal.dueDate.toDate();

  const event: calendar_v3.Schema$Event = {
    summary: `🎯 ${goal.title}`,
    description: goal.description || 'Goal created in NYR app',
    start: {
      date: formatDate(dueDate),
    },
    end: {
      date: formatDate(dueDate),
    },
  };

  await calendar.events.update({
    calendarId: 'primary',
    eventId: goal.calendarEventId,
    requestBody: event,
  });
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const calendar = await getCalendarClient(userId);

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });
}

/**
 * Format date as YYYY-MM-DD for all-day events
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
