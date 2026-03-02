import { io } from "socket.io-client";
import { API } from "./api.js";

export function createSocket() {
  return io(API, {
    withCredentials: true,
    transports: ["websocket", "polling"], // allow fallback
  });
}