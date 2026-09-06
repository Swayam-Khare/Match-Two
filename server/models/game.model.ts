import type { GameEngine } from "../gameEngine.js";

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isWildcard: boolean;
}

export interface Status {
  status: "WILDCARD" | "FIRST_CARD" | "MATCH" | "MISMATCH" | "LOCKED";
  card?: Card;
  cards?: Card[];
}

export interface RoomData {
  engine: GameEngine;
  player1: string; // Player 1's socket.id
  player2: string; // Player 2's socket.id
}

export interface Room {
  roomName: string;
  roomData: RoomData;
}
