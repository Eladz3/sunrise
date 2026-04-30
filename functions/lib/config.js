"use strict";
/**
 * Configuration for Cloud Functions
 *
 * Google OAuth credentials should be set via Firebase environment config:
 * firebase functions:config:set google.client_id="xxx" google.client_secret="xxx"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = exports.googleClientSecret = exports.googleClientId = void 0;
const params_1 = require("firebase-functions/params");
// Define environment parameters
exports.googleClientId = (0, params_1.defineString)('GOOGLE_CLIENT_ID');
exports.googleClientSecret = (0, params_1.defineString)('GOOGLE_CLIENT_SECRET');
// Firestore collection names
exports.COLLECTIONS = {
    USERS: 'users',
    GOALS: 'goals',
    USER_TOKENS: 'userTokens', // Private collection for OAuth tokens
};
//# sourceMappingURL=config.js.map