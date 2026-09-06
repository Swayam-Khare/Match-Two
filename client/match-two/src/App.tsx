import { useState, useEffect } from "react";
import { socket } from "./services/socket";

import LobbyScreen from "./screens/LobbyScreen";
import GameScreen from "./screens/GameScreen";
import DisconnectedScreen from "./screens/DisconnectedScreen";
import type { AppView, JoinData, Card, GameData, PlayerLeftData, CardFlippedData, Status } from "./types/game"; // Import your types here
import Grid from "./components/Grid";
import GameOverScreen from "./screens/GameOverScreen";

export default function App() {
  // 1. UI State
  const [currentView, setCurrentView] = useState<AppView>("lobby");
  const [loadingMessage, setLoadingMessage] = useState("Connecting to server...");
  const [turnStatus, setTurnStatus] = useState<Status | "IDLE">("IDLE");

  // 2. Game Data State
  const [grid, setGrid] = useState<Card[]>([]);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [myPlayerNumber, setMyPlayerNumber] = useState<0 | 1 | null>(null);

  // 3. Socket Event Listeners
  useEffect(() => {
    // ---- MATCHMAKING EVENTS ----
    socket.on("waitingForOpponent", (data: JoinData) => {
      setCurrentView("lobby");
      setLoadingMessage(data.message);
      setMyPlayerNumber(0);
    });

    socket.on("gameStart", (data: GameData) => {
      setGrid(data.grid);
      setScores(data.scores);
      setCurrentPlayer(data.currentPlayer);

      setMyPlayerNumber((prev) => {
        if (prev === null) return 1;
        return prev;
      });

      setCurrentView("playing");
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("playerLeft", (_data: PlayerLeftData) => {
        setCurrentView("disconnected");
    });

    // ---- GAMEPLAY EVENTS ----
    socket.on("cardFlipped", (data: CardFlippedData) => {
      // NOTE: This event also sends 'status' ("MISMATCH", "WILDCARD", etc.).
      // We will handle the 2-second timeout logic in the GameScreen, so just update the state here.

      setGrid(data.grid);
      setScores(data.scores);
      setCurrentPlayer(data.currentPlayer);
      setTurnStatus(data.status);
    });

    socket.on("cardUnflipped", (data: GameData) => {
      setGrid(data.grid);
      setScores(data.scores);
      setCurrentPlayer(data.currentPlayer);
      setTurnStatus("IDLE");
    });

    socket.on("matchResolved", (data: GameData) => {
      setGrid(data.grid);
      setScores(data.scores);
      setCurrentPlayer(data.currentPlayer);
      setTurnStatus("IDLE");
    });

    socket.on("wildcardResolved", (data: GameData) => {
      setGrid(data.grid);
      setScores(data.scores);
      setCurrentPlayer(data.currentPlayer);
      setTurnStatus("IDLE");
    });

    socket.on("gameOver", (data: { scores: [number, number] }) => {
      setScores(data.scores);
      setCurrentView("gameOver");
    });

    // 1. MANUALLY CONNECT HERE (After all listeners are active)
    socket.connect();

    // 4. Cleanup function
    return () => {
      socket.off("waitingForOpponent");
      socket.off("gameStart");
      socket.off("playerLeft");
      socket.off("cardFlipped");
      socket.off("cardUnflipped");
      socket.off("matchResolved");
      socket.off("wildcardResolved");
      socket.off("gameOver");

      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs ONCE when the app loads

  // 5. Conditional Rendering
  if (currentView === "lobby") {
    return <LobbyScreen message={loadingMessage} />;
  }

  if (currentView === "disconnected") {
    return <DisconnectedScreen />;
  }

  if (currentView === "playing") {
    return (
      <GameScreen 
        grid={grid} 
        scores={scores} 
        currentPlayer={currentPlayer} 
        myPlayerNumber={myPlayerNumber!}
        turnStatus={turnStatus}
        socket={socket} 
      />
    );
  }

  if (currentView === "gameOver") {
    return <GameOverScreen scores={scores} myPlayerNumber={myPlayerNumber!} />;
  }

  // For testing
  if (currentView === "test") {
    return <Grid grid={[
  { id: 1, value: "@", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 2, value: "@", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 3, value: "#", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 4, value: "#", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 5, value: "$", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 6, value: "$", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 7, value: "%", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 8, value: "%", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 9, value: "&", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 10, value: "&", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 11, value: "+", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 12, value: "+", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 13, value: "=", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 14, value: "=", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 15, value: "?", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 16, value: "?", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 17, value: "!", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 18, value: "!", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 19, value: "~", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 20, value: "~", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 21, value: "^", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 22, value: "^", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 23, value: "O", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 24, value: "O", isFlipped: false, isMatched: false, isWildcard: false },
  { id: 25, value: "*", isFlipped: false, isMatched: false, isWildcard: true },
]} onClick={(index: number) => console.log(`clicked: ${index}`)} message="Pick a card" />
  }

  return <div>Unknown State</div>;
}