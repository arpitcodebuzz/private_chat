// src/utils/activeUsers.js

/**
 * Structure:
 * {
 *   roomId: {
 *     count: Number,
 *     users: Map<socketId, displayName>
 *   }
 * }
 */

export const activeUsers = {};