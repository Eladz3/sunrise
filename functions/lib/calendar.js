"use strict";
/**
 * Google Calendar Service
 *
 * Handles OAuth token management and Calendar API operations.
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
exports.getValidAccessToken = getValidAccessToken;
exports.storeTokens = storeTokens;
exports.deleteTokens = deleteTokens;
exports.createCalendarEvent = createCalendarEvent;
exports.updateCalendarEvent = updateCalendarEvent;
exports.deleteCalendarEvent = deleteCalendarEvent;
const googleapis_1 = require("googleapis");
const admin = __importStar(require("firebase-admin"));
const config_1 = require("./config");
/**
 * Create OAuth2 client with stored credentials
 */
function createOAuth2Client() {
    return new googleapis_1.google.auth.OAuth2(config_1.googleClientId.value(), config_1.googleClientSecret.value(), 'postmessage' // For popup-based OAuth flow
    );
}
/**
 * Get valid access token for a user
 * Automatically refreshes if expired
 */
async function getValidAccessToken(userId) {
    const db = admin.firestore();
    const tokenDoc = await db.collection(config_1.COLLECTIONS.USER_TOKENS).doc(userId).get();
    if (!tokenDoc.exists) {
        throw new Error('Calendar not connected. Please connect your Google Calendar first.');
    }
    const tokens = tokenDoc.data();
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
    await db.collection(config_1.COLLECTIONS.USER_TOKENS).doc(userId).update({
        accessToken: credentials.access_token,
        expiresAt: admin.firestore.Timestamp.fromMillis(expiresIn),
        updatedAt: admin.firestore.Timestamp.now(),
    });
    return credentials.access_token;
}
/**
 * Store OAuth tokens after user connects calendar
 */
async function storeTokens(userId, authCode) {
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
    await db.collection(config_1.COLLECTIONS.USER_TOKENS).doc(userId).set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        updatedAt: admin.firestore.Timestamp.now(),
    });
    // Update user profile
    await db.collection(config_1.COLLECTIONS.USERS).doc(userId).update({
        calendarConnected: true,
        updatedAt: admin.firestore.Timestamp.now(),
    });
}
/**
 * Delete stored tokens and disconnect calendar
 */
async function deleteTokens(userId) {
    const db = admin.firestore();
    // Delete tokens
    await db.collection(config_1.COLLECTIONS.USER_TOKENS).doc(userId).delete();
    // Update user profile
    await db.collection(config_1.COLLECTIONS.USERS).doc(userId).update({
        calendarConnected: false,
        updatedAt: admin.firestore.Timestamp.now(),
    });
}
/**
 * Get authenticated Calendar API client
 */
async function getCalendarClient(userId) {
    const accessToken = await getValidAccessToken(userId);
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    return googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
}
/**
 * Create a calendar event for a goal
 */
async function createCalendarEvent(userId, goal) {
    const calendar = await getCalendarClient(userId);
    const dueDate = goal.dueDate.toDate();
    // Create all-day event on due date
    const event = {
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
                { method: 'popup', minutes: 60 * 2 }, // 2 hours before
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
    await db.collection(config_1.COLLECTIONS.GOALS).doc(goal.id).update({
        calendarEventId: response.data.id,
        updatedAt: admin.firestore.Timestamp.now(),
    });
    return response.data.id;
}
/**
 * Update an existing calendar event
 */
async function updateCalendarEvent(userId, goal) {
    if (!goal.calendarEventId) {
        throw new Error('Goal has no associated calendar event');
    }
    const calendar = await getCalendarClient(userId);
    const dueDate = goal.dueDate.toDate();
    const event = {
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
async function deleteCalendarEvent(userId, eventId) {
    const calendar = await getCalendarClient(userId);
    await calendar.events.delete({
        calendarId: 'primary',
        eventId,
    });
}
/**
 * Format date as YYYY-MM-DD for all-day events
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
//# sourceMappingURL=calendar.js.map