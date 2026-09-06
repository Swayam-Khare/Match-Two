import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandler } from "./handlers/socketHandler.js";

const app = express();
app.use(cors());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

setupSocketHandler(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});
