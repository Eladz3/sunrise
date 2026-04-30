/**
 * Firebase Cloud Functions
 *
 * Callable functions for Google Calendar integration.
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  storeTokens,
  deleteTokens,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from './calendar';
import { COLLECTIONS } from './config';

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Connect Google Calendar
 *
 * Exchanges OAuth authorization code for tokens and stores them securely.
 */
export const connectCalendar = onCall(async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { authCode } = request.data;
  if (!authCode || typeof authCode !== 'string') {
    throw new HttpsError('invalid-argument', 'Authorization code is required');
  }

  try {
    await storeTokens(request.auth.uid, authCode);
    return { success: true, message: 'Calendar connected successfully' };
  } catch (error) {
    console.error('Error connecting calendar:', error);
    throw new HttpsError('internal', 'Failed to connect calendar');
  }
});

/**
 * Disconnect Google Calendar
 *
 * Removes stored tokens and updates user profile.
 */
export const disconnectCalendar = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await deleteTokens(request.auth.uid);
    return { success: true, message: 'Calendar disconnected successfully' };
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    throw new HttpsError('internal', 'Failed to disconnect calendar');
  }
});

/**
 * Sync Goal to Calendar
 *
 * Creates or updates a calendar event for a goal.
 */
export const syncGoalToCalendar = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { goalId } = request.data;
  if (!goalId || typeof goalId !== 'string') {
    throw new HttpsError('invalid-argument', 'Goal ID is required');
  }

  const userId = request.auth.uid;
  const db = admin.firestore();

  try {
    // Fetch goal
    const goalDoc = await db.collection(COLLECTIONS.GOALS).doc(goalId).get();

    if (!goalDoc.exists) {
      throw new HttpsError('not-found', 'Goal not found');
    }

    const goal = { id: goalDoc.id, ...goalDoc.data() } as {
      id: string;
      userId: string;
      title: string;
      description: string;
      dueDate: admin.firestore.Timestamp;
      calendarEventId: string | null;
    };

    // Verify ownership
    if (goal.userId !== userId) {
      throw new HttpsError('permission-denied', 'You do not own this goal');
    }

    let eventId: string;

    if (goal.calendarEventId) {
      // Update existing event
      await updateCalendarEvent(userId, goal);
      eventId = goal.calendarEventId;
    } else {
      // Create new event
      eventId = await createCalendarEvent(userId, goal);
    }

    return { success: true, eventId };
  } catch (error) {
    console.error('Error syncing goal to calendar:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new HttpsError('internal', `Failed to sync goal: ${message}`);
  }
});

/**
 * Remove Calendar Event
 *
 * Deletes a calendar event associated with a goal.
 */
export const removeCalendarEvent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { goalId } = request.data;
  if (!goalId || typeof goalId !== 'string') {
    throw new HttpsError('invalid-argument', 'Goal ID is required');
  }

  const userId = request.auth.uid;
  const db = admin.firestore();

  try {
    // Fetch goal
    const goalDoc = await db.collection(COLLECTIONS.GOALS).doc(goalId).get();

    if (!goalDoc.exists) {
      throw new HttpsError('not-found', 'Goal not found');
    }

    const goal = goalDoc.data() as {
      userId: string;
      calendarEventId: string | null;
    };

    // Verify ownership
    if (goal.userId !== userId) {
      throw new HttpsError('permission-denied', 'You do not own this goal');
    }

    if (!goal.calendarEventId) {
      return { success: true, message: 'No calendar event to remove' };
    }

    // Delete calendar event
    await deleteCalendarEvent(userId, goal.calendarEventId);

    // Clear calendarEventId from goal
    await db.collection(COLLECTIONS.GOALS).doc(goalId).update({
      calendarEventId: null,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    return { success: true, message: 'Calendar event removed' };
  } catch (error) {
    console.error('Error removing calendar event:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Failed to remove calendar event');
  }
});
