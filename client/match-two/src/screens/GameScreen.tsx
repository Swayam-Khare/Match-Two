import { useEffect, useRef } from "react";
import type { GameScreenProps } from "../types/game";
import ScoreBoard from "../components/ScoreBoard";
import Grid from "../components/Grid";
import "../styles/GameScreen.css"

export default function GameScreen({
  grid,
  scores,
  currentPlayer,
  myPlayerNumber,
  turnStatus,
  socket,
}: GameScreenProps) {
 // 1. Anti-Spam Local Lock using useRef (avoids cascading re-renders)
  const isAwaitingServer = useRef(false);

  // Unlock the click guardian without triggering a render
  useEffect(() => {
    isAwaitingServer.current = false;
  }, [grid, turnStatus]);

  // 2. The 2-Second Resolution Timer
  useEffect(() => {
    if (currentPlayer !== myPlayerNumber) return;

    let timeoutId: number;

    if (turnStatus === "MISMATCH") {
      timeoutId = window.setTimeout(() => {
        socket.emit("unflipCards");
      }, 1000);
    } else if (turnStatus === "MATCH") {
      timeoutId = window.setTimeout(() => {
        socket.emit("resolveMatch");
      }, 300);
    } else if (turnStatus === "WILDCARD") {
      timeoutId = window.setTimeout(() => {
        socket.emit("resolveWildcard");
      }, 1000);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [turnStatus, currentPlayer, myPlayerNumber, socket]);

  // 3. The Click Guardian
  const handleCardClick = (index: number) => {
    // Check the ref instead of state
    if (isAwaitingServer.current) return;
    
    if (currentPlayer !== myPlayerNumber) return;
    if (grid[index].isFlipped || grid[index].isMatched) return;
    if (turnStatus !== "IDLE" && turnStatus !== "FIRST_CARD") return;

    // Lock UI instantly
    isAwaitingServer.current = true;
    socket.emit("flipCard", index);
  };

  // Inside GameScreen.tsx (replace your existing turnMessage variable)
  
  let turnMessage;
  const isMyTurn = currentPlayer === myPlayerNumber;

  if (turnStatus === "MISMATCH") {
    turnMessage = isMyTurn ? "Not a match! ❌" : "Opponent missed!";
  } else if (turnStatus === "WILDCARD") {
    turnMessage = isMyTurn ? "Lucky! You found a Wildcard! 🃏" : "Opponent found a Wildcard!";
  } else if (turnStatus === "FIRST_CARD") {
    turnMessage = isMyTurn ? "Pick your second card..." : "Opponent is picking...";
  } else {
    // IDLE state
    turnMessage = isMyTurn ? "Your turn!" : "Waiting for opponent...";
  }

  return (
    <div className="game-screen-root">
     <ScoreBoard scores={scores} currentPlayer={currentPlayer} myPlayerNumber={myPlayerNumber} />
      
      <Grid grid={grid} onClick={handleCardClick} message={turnMessage} />
    </div>
  );
}