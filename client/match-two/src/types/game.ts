// JoinData, Card, GameData, PlayerLeftData, CardFlippedData

import type { Socket } from "socket.io-client";

export type Status =
  | "WILDCARD"
  | "FIRST_CARD"
  | "MATCH"
  | "MISMATCH"
  | "LOCKED";

export interface JoinData {
  message: string;
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isWildcard: boolean;
}

export interface GameData {
  grid: Card[];
  scores: [number, number];
  currentPlayer: 0 | 1;
}

export interface PlayerLeftData {
  playerNumber: 0 | 1;
}

export interface CardFlippedData extends GameData {
  status: Status;
}

export interface GameScreenProps extends GameData {
  myPlayerNumber: 0 | 1;
  socket: Socket;
  turnStatus: Status | "IDLE";
}

export type AppView = "lobby" | "playing" | "disconnected" | "gameOver" | "test";

export interface ScoreBoardProps {
  scores: [number, number];
  currentPlayer: 0 | 1;
  myPlayerNumber: 0 | 1;
}

export interface PlayerPanelProps {
  label: string;
  score: number;
  isActive: boolean;
  align: "left" | "right";
}

export interface CardProps {
  card: Card;
}

export interface GameOverScreenProps {
  scores: [number, number];
  myPlayerNumber: 0 | 1;
}

export type Outcome = 'win' | 'lose' | 'tie';
