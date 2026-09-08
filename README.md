# Real-Time Multiplayer Memory Match

A full-stack, real-time multiplayer implementation of the classic Memory Card game. This project utilizes a custom WebSocket matchmaking system to pair players instantly, synchronizes complex game state across clients, and enforces strict server-side validation to prevent cheating or network race conditions.

## ✨ Key Features

* **Real-Time Matchmaking:** Players are automatically paired into private lobbies upon connection.
* **Server-Side Authority:** The Node.js backend maintains the single source of truth for the game state, scoring, and turn validation.
* **Network Latency Protection:** The React frontend utilizes a lightweight `useRef` locking mechanism to prevent rapid-fire click spamming and desynchronization. 
* **State-Based UI Architecture:** Bypasses traditional client-side routing in favor of strict state-based view rendering (`lobby` | `playing` | `gameOver`).
* **Graceful Disconnect Handling:** Cleans up ghost lobbies and instantly resolves the game if an opponent drops connection mid-match.
* **Fully Accessible:** The game grid is fully playable via keyboard navigation (`tabIndex` and `onKeyDown` spacebar/enter support).

## 🛠 Tech Stack

**Frontend (Client)**
* React 18
* Vite
* TypeScript
* Socket.io-Client
* Pure CSS (Custom Grid Variables & Keyframe Animations)

**Backend (Server)**
* Node.js
* Socket.io
* TypeScript (executed via `tsx` / `tsc`)
* Object-Oriented Game Engine Architecture (`RoomManager`, `GameEngine`)

## 🏗 Architecture & Monorepo Structure

This project uses a monorepo structure, separating the frontend and backend into distinct directories while keeping version control unified. 

```text
├── client/                 # Vite/React frontend
│   ├── src/
│   │   ├── components/     # Grid, Card, ScoreBoard
│   │   ├── screens/        # GameScreen, GameOverScreen
│   │   ├── services/       # socket.ts
│   │   └── types/          # Shared frontend interfaces
├── server/                 # Node.js backend
│   ├── engine/             # Game logic and Room Manager
│   ├── server.ts           # Socket.io initialization and listeners
│   └── tsconfig.json
```

## 🚀 Running Locally

Ensure you have Node.js installed, then open two terminal windows (one for the client, one for the server).

**1. Start the Backend:**
```bash
cd server
npm install
npm run dev
```

**2. Start the Frontend:**
```bash
cd client/match-two
npm install
npm run dev
```

Open http://localhost:5173 in two separate browser windows to test the multiplayer matching locally.
