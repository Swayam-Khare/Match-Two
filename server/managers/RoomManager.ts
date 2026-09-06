import type { Server, Socket } from "socket.io";
import type { RoomData } from "../models/game.model.js";
import { GameEngine } from "../gameEngine.js";
import { cards } from "../configs/cards.js";

export class RoomManager {
  private playerMapping: Map<string, string> = new Map();
  private activeRooms: Map<string, RoomData> = new Map();
  private waitingPlayer: string | null = null;

  handleConnection(socket: Socket, io: Server): void {
    if (!this.waitingPlayer) {
      this.waitingPlayer = socket.id;
      const roomName = `room_${socket.id}`;
      socket.join(roomName);
      this.playerMapping.set(socket.id, roomName);

      socket.emit("waitingForOpponent", {
        message: "Waiting for another player to join...",
      });
    } else {
      const roomName = `room_${this.waitingPlayer}`;

      socket.join(roomName);
      this.playerMapping.set(socket.id, roomName);

      const freshDeck = structuredClone(cards);
      const engine = new GameEngine(freshDeck);
      engine.setup(); // Shuffle the fresh deck and reset scores

      const roomData: RoomData = {
        engine: engine,
        player1: this.waitingPlayer,
        player2: socket.id,
      };

      this.activeRooms.set(roomName, roomData);

      io.to(roomName).emit("gameStart", {
        grid: engine.grid,
        scores: engine.scores,
        currentPlayer: engine.currentPlayer,
      });

      // Clear the lobby for the next person
      this.waitingPlayer = null;
    }
  }

  handleDisconnect(socket: Socket, io: Server): void {
    const roomName: string | undefined = this.playerMapping.get(socket.id);
    const roomData: RoomData | undefined = this.activeRooms.get(roomName ?? "");

    if (roomName && roomData) {
      const playerNumber: 0 | 1 = socket.id === roomData.player1 ? 0 : 1;

      if (roomData.engine.gameStart) {
        io.to(roomName).emit("playerLeft", { playerNumber });
      }

      this.playerMapping.delete(roomData.player1);
      this.playerMapping.delete(roomData.player2);

      this.activeRooms.delete(roomName);
    } else if (this.waitingPlayer === socket.id) {
      this.waitingPlayer = null;
      this.playerMapping.delete(socket.id);
    }
  }

  getRoomBySocketId(socketId: string): RoomData | undefined {
    const roomName: string | undefined = this.getRoomNameBySocketId(socketId);
    return roomName ? this.activeRooms.get(roomName) : undefined;
  }

  getRoomNameBySocketId(socketId: string): string | undefined {
    return this.playerMapping.get(socketId);
  }

  getRoomByRoomName(roomName: string): RoomData | undefined {
    return this.activeRooms.get(roomName);
  }
}
