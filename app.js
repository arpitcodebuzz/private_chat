// app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";

import roomRoutes from "./src/routes/room.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

// Trust proxy (useful when deployed behind reverse proxy like Render/Railway/Nginx)
app.set("trust proxy", 1);

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "OK server is running" });
})
//health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK server is healthy" });
});

// 404 handler (for REST)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;