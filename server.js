// server.js

import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./src/config/db.js";
import { registerSocketHandlers } from "./src/sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1) Connect DB first
await connectDB();

// 2) Create HTTP server from Express app
const server = http.createServer(app);

// 3) Attach Socket.IO to the HTTP server
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173","https://pk9054.vercel.app"];

const io = new Server(server, {
  cors: {
    origin: origins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 4) Register socket handlers (events)
registerSocketHandlers(io);

// 5) Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});