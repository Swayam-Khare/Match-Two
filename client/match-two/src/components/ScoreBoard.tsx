import type { PlayerPanelProps, ScoreBoardProps } from '../types/game';
import '../styles/ScoreBoard.css';

const PLAYER_LABELS: [string, string, string] = ['Player 1', 'Player 2', 'You'];

function PlayerPanel({ label, score, isActive, align }: PlayerPanelProps) {
  const panelClassName = [
    'scoreboard-panel',
    `scoreboard-panel--${align}`,
    isActive ? 'scoreboard-panel--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={panelClassName}>
      <div className="scoreboard-panel-top">
        <span className="scoreboard-panel-label">{label}</span>
        {isActive && (
          <span className="scoreboard-turn-badge">
            <span className="scoreboard-turn-dot" aria-hidden="true" />
            Turn
          </span>
        )}
      </div>
      {/* key={score} restarts the bump animation whenever the score changes */}
      <span key={score} className="scoreboard-score">
        {score}
      </span>
    </div>
  );
}

export default function ScoreBoard({ scores, currentPlayer, myPlayerNumber }: ScoreBoardProps) {
  return (
    <div className="scoreboard-root" role="group" aria-label="Scoreboard">
      <PlayerPanel
        label={myPlayerNumber === 0 ? PLAYER_LABELS[2] : PLAYER_LABELS[0]}
        score={scores[0]}
        isActive={currentPlayer === 0}
        align="left"
      />

      <div className="scoreboard-divider" aria-hidden="true">
        <span className="scoreboard-divider-text">VS</span>
      </div>

      <PlayerPanel
        label={myPlayerNumber === 1 ? PLAYER_LABELS[2] : PLAYER_LABELS[1]}
        score={scores[1]}
        isActive={currentPlayer === 1}
        align="right"
      />

      <span className="scoreboard-sr-only" role="status" aria-live="polite">
        {PLAYER_LABELS[currentPlayer]}&apos;s turn
      </span>
    </div>
  );
}