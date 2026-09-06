import type { GameOverScreenProps, Outcome } from '../types/game';
import '../styles/GameOverScreen.css';

function getOutcome(scores: [number, number], myPlayerNumber: 0 | 1): Outcome {
  const opponentNumber: 0 | 1 = myPlayerNumber === 0 ? 1 : 0;
  const myScore = scores[myPlayerNumber];
  const opponentScore = scores[opponentNumber];

  if (myScore === opponentScore) return 'tie';
  return myScore > opponentScore ? 'win' : 'lose';
}

const OUTCOME_COPY: Record<Outcome, { headline: string; subline: string }> = {
  win: {
    headline: 'You won!',
    subline: 'Nice work — you found more pairs than your opponent.',
  },
  lose: {
    headline: 'Better luck next time',
    subline: 'Your opponent found more pairs this round.',
  },
  tie: {
    headline: "It's a tie!",
    subline: 'You both found the same number of pairs.',
  },
};

export default function GameOverScreen({ scores, myPlayerNumber }: GameOverScreenProps) {
  const opponentNumber: 0 | 1 = myPlayerNumber === 0 ? 1 : 0;
  const outcome = getOutcome(scores, myPlayerNumber);
  const { headline, subline } = OUTCOME_COPY[outcome];

  return (
    <div className="gameover-root">
      <div className={`gameover-glow gameover-glow--${outcome}`} aria-hidden="true" />

      <div className={`gameover-card gameover-card--${outcome}`}>
        <div className="gameover-brand">
          <div className="gameover-brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <span className="gameover-brand-name">Match-Two</span>
        </div>

        <div className="gameover-badge" aria-hidden="true">
          {outcome === 'win' && (
            <svg viewBox="0 0 24 24">
              <path d="M4 12.5L9.5 18L20 6" />
            </svg>
          )}
          {outcome === 'lose' && (
            <svg viewBox="0 0 24 24">
              <path d="M7 7L17 17M17 7L7 17" />
            </svg>
          )}
          {outcome === 'tie' && (
            <svg viewBox="0 0 24 24">
              <path d="M6 12H18" />
            </svg>
          )}
        </div>

        <h1 className="gameover-headline">{headline}</h1>
        <p className="gameover-subline" role="status" aria-live="polite">
          {subline}
        </p>

        <div className="gameover-scores">
          <div className="gameover-score-panel gameover-score-panel--you">
            <span className="gameover-score-label">You</span>
            <span className="gameover-score-value">{scores[myPlayerNumber]}</span>
          </div>

          <div className="gameover-score-divider" aria-hidden="true">
            <span>VS</span>
          </div>

          <div className="gameover-score-panel">
            <span className="gameover-score-label">Opponent</span>
            <span className="gameover-score-value">{scores[opponentNumber]}</span>
          </div>
        </div>

        <button
          type="button"
          className="gameover-home-btn"
          onClick={() => window.location.assign('/')}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}