// src/controllers/room.controller.js

import mongoose from "mongoose";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";
import AppError from "../utils/AppError.js"; // optional but recommended

const parseLimit = (v, def = 50) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(Math.max(Math.floor(n), 1), 200); // 1..200
};

// POST /api/rooms
export const createRoom = async (req, res, next) => {
  try {
    const { name, rawPassword, nickname } = req.body;

    if (!name || !rawPassword || !nickname) {
      throw new AppError("name, rawPassword, nickname are required", 400);
    } 

    const roomName = String(name).trim();
    const pass = String(rawPassword);
    const senderName = String(nickname).trim();

    if (roomName.length < 3) throw new AppError("Room name too short", 400);
    if (pass.length < 3) throw new AppError("Password too short", 400);
    if (senderName.length < 1) throw new AppError("Nickname is required", 400);

    const exists = await Room.findOne({ name: roomName }).lean();
    if (exists) throw new AppError("Room already exists", 409);

    const room = await Room.create({
      name: roomName,
      rawPassword: pass,
      maxUsers: 2,
    });

    // Optional: send an initial system message (skip if you want)
    // await Message.create({ roomId: room._id, senderName: "system", text: "Room created" });

    return res.status(201).json({
      success: true,
      message: "Room created",
      data: {
        roomId: room._id,
        roomName: room.name,
        displayName: senderName, // client stores it
        maxUsers: room.maxUsers,
      },
    });
  } catch (err) {
    // handle duplicate key error if two creates happen simultaneously
    if (err?.code === 11000) return next(new AppError("Room already exists", 409));
    return next(err);
  }
};

// POST /api/rooms/join
export const joinRoom = async (req, res, next) => {
  try {
    const { name, rawPassword, nickname } = req.body;

    if (!name || !rawPassword || !nickname) {
      throw new AppError("name, rawPassword, nickname are required", 400);
    }

    const roomName = String(name).trim();
    const pass = String(rawPassword);
    const senderName = String(nickname).trim();

    const room = await Room.findOne({ name: roomName });
    if (!room) throw new AppError("Room not found", 404);

    if (room.rawPassword !== pass) {
      throw new AppError("Wrong room password", 401);
    }

    // Room capacity (max 2) is enforced in Socket.IO (activeUsers in-memory)
    // REST join only verifies room + password.

  
    return res.status(200).json({
      success: true,
      message: "Join allowed",
      data: {
        roomId: room._id,
        roomName: room.name,
        displayName: senderName,
        maxUsers: room.maxUsers,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/rooms/:roomId/messages?limit=N
export const getRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new AppError("Invalid roomId", 400);
    }

    const limit = parseLimit(req.query.limit, 50);

    // TTL will already remove >24h messages, so just fetch latest.
    const msgs = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // return oldest -> newest for UI
    msgs.reverse();

    return res.status(200).json({
      success: true,
      message: "Messages fetched",
      data: msgs.map((m) => ({
        _id: m._id,
        roomId: m.roomId,
        senderName: m.senderName,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    return next(err);
  }
};