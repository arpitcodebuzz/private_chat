// src/models/message.model.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    index: true,
  },

  senderName: {
    type: String,
    required: true,
    trim: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 🔥 24 hours (TTL auto delete)
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;