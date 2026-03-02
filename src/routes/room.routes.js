// src/routes/room.routes.js

import express from "express";
import {
  createRoom,
  joinRoom,
  getRoomMessages,
} from "../controllers/room.controller.js";

const router = express.Router();

// Create room
router.post("/", createRoom);

// Join room
router.post("/join", joinRoom);

// Fetch messages (latest N; TTL ensures only <24h exist)
router.get("/:roomId/messages", getRoomMessages);

export default router;