"use strict";
/**
 * Firebase Cloud Functions
 *
 * Callable functions for Google Calendar integration.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCalendarEvent = exports.syncGoalToCalendar = exports.disconnectCalendar = exports.connectCalendar = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const calendar_1 = require("./calendar");
const config_1 = require("./config");
// Initialize Firebase Admin
admin.initializeApp();
/**
 * Connect Google Calendar
 *
 * Exchanges OAuth authorization code for tokens and stores them securely.
 */
exports.connectCalendar = (0, https_1.onCall)(async (request) => {
    // Verify authentication
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { authCode } = request.data;
    if (!authCode || typeof authCode !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'Authorization code is required');
    }
    try {
        await (0, calendar_1.storeTokens)(request.auth.uid, authCode);
        return { success: true, message: 'Calendar connected successfully' };
    }
    catch (error) {
        console.error('Error connecting calendar:', error);
        throw new https_1.HttpsError('internal', 'Failed to connect calendar');
    }
});
/**
 * Disconnect Google Calendar
 *
 * Removes stored tokens and updates user profile.
 */
exports.disconnectCalendar = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
        await (0, calendar_1.deleteTokens)(request.auth.uid);
        return { success: true, message: 'Calendar disconnected successfully' };
    }
    catch (error) {
        console.error('Error disconnecting calendar:', error);
        throw new https_1.HttpsError('internal', 'Failed to disconnect calendar');
    }
});
/**
 * Sync Goal to Calendar
 *
 * Creates or updates a calendar event for a goal.
 */
exports.syncGoalToCalendar = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { goalId } = request.data;
    if (!goalId || typeof goalId !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'Goal ID is required');
    }
    const userId = request.auth.uid;
    const db = admin.firestore();
    try {
        // Fetch goal
        const goalDoc = await db.collection(config_1.COLLECTIONS.GOALS).doc(goalId).get();
        if (!goalDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Goal not found');
        }
        const goal = { id: goalDoc.id, ...goalDoc.data() };
        // Verify ownership
        if (goal.userId !== userId) {
            throw new https_1.HttpsError('permission-denied', 'You do not own this goal');
        }
        let eventId;
        if (goal.calendarEventId) {
            // Update existing event
            await (0, calendar_1.updateCalendarEvent)(userId, goal);
            eventId = goal.calendarEventId;
        }
        else {
            // Create new event
            eventId = await (0, calendar_1.createCalendarEvent)(userId, goal);
        }
        return { success: true, eventId };
    }
    catch (error) {
        console.error('Error syncing goal to calendar:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new https_1.HttpsError('internal', `Failed to sync goal: ${message}`);
    }
});
/**
 * Remove Calendar Event
 *
 * Deletes a calendar event associated with a goal.
 */
exports.removeCalendarEvent = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { goalId } = request.data;
    if (!goalId || typeof goalId !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'Goal ID is required');
    }
    const userId = request.auth.uid;
    const db = admin.firestore();
    try {
        // Fetch goal
        const goalDoc = await db.collection(config_1.COLLECTIONS.GOALS).doc(goalId).get();
        if (!goalDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Goal not found');
        }
        const goal = goalDoc.data();
        // Verify ownership
        if (goal.userId !== userId) {
            throw new https_1.HttpsError('permission-denied', 'You do not own this goal');
        }
        if (!goal.calendarEventId) {
            return { success: true, message: 'No calendar event to remove' };
        }
        // Delete calendar event
        await (0, calendar_1.deleteCalendarEvent)(userId, goal.calendarEventId);
        // Clear calendarEventId from goal
        await db.collection(config_1.COLLECTIONS.GOALS).doc(goalId).update({
            calendarEventId: null,
            updatedAt: admin.firestore.Timestamp.now(),
        });
        return { success: true, message: 'Calendar event removed' };
    }
    catch (error) {
        console.error('Error removing calendar event:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Failed to remove calendar event');
    }
});
//# sourceMappingURL=index.js.map