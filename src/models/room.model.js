// src/models/room.model.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    rawPassword: {
      type: String,
      required: true,
    },

    maxUsers: {
      type: Number,
      default: 2,
      immutable: true, // cannot be changed later
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;