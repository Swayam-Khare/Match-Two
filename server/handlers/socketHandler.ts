import type { Server, Socket } from "socket.io";
import { RoomManager } from "../managers/RoomManager.js";
import type { Room, RoomData, Status } from "../models/game.model.js";

const roomManager: RoomManager = new RoomManager();

function getValidPlayerRoom(socketId: string): Room | null {
  const roomName = roomManager.getRoomNameBySocketId(socketId);
  if (!roomName) return null;

  const roomData = roomManager.getRoomByRoomName(roomName);
  if (!roomData) return null;

  const playerIndex = socketId === roomData.player1 ? 0 : 1;
  if (playerIndex !== roomData.engine.currentPlayer) return null;

  return { roomName, roomData };
}

export function setupSocketHandler(io: Server) {
  io.on("connection", (socket: Socket) => {
    roomManager.handleConnection(socket, io);

    socket.on("disconnect", () => {
      roomManager.handleDisconnect(socket, io);
    });

    socket.on("flipCard", (index: number) => {
      const room: Room | null = getValidPlayerRoom(socket.id);
      if (!room) {
        return;
      }

      if (!room.roomData.engine.validateInput(index.toString())) {
        return;
      }

      // 4. Call engine.processFlip(index)
      const result: Status = room.roomData.engine.processFlip(index);

      // 5. Broadcast the new state and status to the room
      io.to(room.roomName).emit("cardFlipped", {
        grid: room.roomData.engine.grid,
        scores: room.roomData.engine.scores,
        currentPlayer: room.roomData.engine.currentPlayer,
        status: result.status,
      });
    });

    socket.on("unflipCards", () => {
      const room: Room | null = getValidPlayerRoom(socket.id);
      if (!room) {
        return;
      }

      // 2. Call roomData.engine.unflipCards()
      room.roomData.engine.unflipCards();

      // 3. Broadcast the resolved state (grid, scores, currentPlayer) back to the room
      io.to(room.roomName).emit("cardUnflipped", {
        grid: room.roomData.engine.grid,
        scores: room.roomData.engine.scores,
        currentPlayer: room.roomData.engine.currentPlayer,
      });
    });

    socket.on("resolveMatch", () => {
      // Same structure as above, but calling roomData.engine.resolveMatch()
      const room: Room | null = getValidPlayerRoom(socket.id);
      if (!room) {
        return;
      }

      // 2. Call roomData.engine.resolveMatch()
      room.roomData.engine.resolveMatch();

      // 3. Check if the game is over NOW (after they are marked as matched)
      if (room.roomData.engine.isGameCompleted()) {
        io.to(room.roomName).emit("gameOver", {
          scores: room.roomData.engine.scores,
        });
        return; // Stop here, don't emit matchResolved
      }

      // 3. Broadcast the resolved state (grid, scores, currentPlayer) back to the room
      io.to(room.roomName).emit("matchResolved", {
        grid: room.roomData.engine.grid,
        scores: room.roomData.engine.scores,
        currentPlayer: room.roomData.engine.currentPlayer,
      });
    });

    socket.on("resolveWildcard", () => {
      // Same structure as above, but calling roomData.engine.resolveWildcard()
      const room: Room | null = getValidPlayerRoom(socket.id);
      if (!room) {
        return;
      }

      // 2. Call roomData.engine.resolveWildcard()
      room.roomData.engine.resolveWildcard();

      // 3. Check if the game is over NOW
      if (room.roomData.engine.isGameCompleted()) {
        io.to(room.roomName).emit("gameOver", {
          scores: room.roomData.engine.scores,
        });
        return; // Stop here, don't emit matchResolved
      }

      // 3. Broadcast the resolved state (grid, scores, currentPlayer) back to the room
      io.to(room.roomName).emit("wildcardResolved", {
        grid: room.roomData.engine.grid,
        scores: room.roomData.engine.scores,
        currentPlayer: room.roomData.engine.currentPlayer,
      });
    });
  });
}
