// src/sockets/socket.js

import Message from "../models/message.model.js";
import Room from "../models/room.model.js";
import { activeUsers } from "../utils/activeUsers.js";

/**
 * Registers Socket.IO handlers.
 * @param {import("socket.io").Server} io
 */
export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    // Store current room/user on socket for cleanup
    socket.data.roomId = null;
    socket.data.displayName = null;

    // join_room { roomId, displayName }
    socket.on("join_room", async (payload = {}) => {
      try {
        const { roomId, displayName } = payload;

        if (!roomId || !displayName) {
          socket.emit("error", { message: "roomId and displayName are required" });
          return;
        }

        // Ensure room exists (prevents joining random IDs)
        const room = await Room.findById(roomId).lean();
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Initialize room tracking
        if (!activeUsers[roomId]) {
          activeUsers[roomId] = {
            count: 0,
            users: new Map(), // socketId -> displayName
          };
        }

        // Room full check (max 2 users)
        const tracker = activeUsers[roomId];

        // If this socket is rejoining same room, don't double count
        const alreadyInRoom = tracker.users.has(socket.id);
        if (!alreadyInRoom && tracker.count >= 2) {
          socket.emit("room_full", { message: "Room already has 2 active users" });
          return;
        }

        // Join socket.io room
        socket.join(roomId);

        // Track user
        if (!alreadyInRoom) {
          tracker.users.set(socket.id, String(displayName).trim());
          tracker.count = tracker.users.size;
        }

        socket.data.roomId = roomId;
        socket.data.displayName = String(displayName).trim();

        // Notify others
        socket.to(roomId).emit("user_joined", {
          displayName: socket.data.displayName,
        });

        // Confirm join to self (handy for UI)
        socket.emit("joined", {
          roomId,
          displayName: socket.data.displayName,
          activeCount: tracker.count,
        });
      } catch (e) {
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // typing { roomId }
    socket.on("typing", (payload = {}) => {
      const roomId = payload.roomId || socket.data.roomId;
      if (!roomId) return;

      socket.to(roomId).emit("typing", {
        displayName: socket.data.displayName || "Friend",
      });
    });

    // stop_typing { roomId }
    socket.on("stop_typing", (payload = {}) => {
      const roomId = payload.roomId || socket.data.roomId;
      if (!roomId) return;

      socket.to(roomId).emit("stop_typing", {
        displayName: socket.data.displayName || "Friend",
      });
    });

    // new_message { roomId, text }
    socket.on("new_message", async (payload = {}) => {
      try {
        const roomId = payload.roomId || socket.data.roomId;
        const text = String(payload.text || "").trim();

        if (!roomId) {
          socket.emit("error", { message: "roomId is required" });
          return;
        }

        if (!text) return; // ignore empty messages

        // Ensure sender is actually counted in activeUsers (simple guard)
        const tracker = activeUsers[roomId];
        if (!tracker || !tracker.users.has(socket.id)) {
          socket.emit("error", { message: "You are not joined to this room" });
          return;
        }

        const msg = await Message.create({
          roomId,
          senderName: socket.data.displayName || "Unknown",
          text,
          // createdAt auto + TTL handled by schema
        });

        const msgPayload = {
          _id: msg._id,
          roomId: msg.roomId,
          senderName: msg.senderName,
          text: msg.text,
          createdAt: msg.createdAt,
        };

        // Send to everyone in room (including sender)
        io.to(roomId).emit("message", msgPayload);
      } catch (e) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    const cleanup = () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const tracker = activeUsers[roomId];
      if (!tracker) return;

      const name = tracker.users.get(socket.id) || socket.data.displayName;

      tracker.users.delete(socket.id);
      tracker.count = tracker.users.size;

      // Notify remaining user
      socket.to(roomId).emit("user_left", {
        displayName: name || "Friend",
      });

      // If room empty, free memory
      if (tracker.count === 0) {
        delete activeUsers[roomId];
      }

      socket.data.roomId = null;
      socket.data.displayName = null;
    };

    socket.on("disconnect", cleanup);
    socket.on("disconnecting", cleanup);
  });
};