import '../styles/DisconnectScreen.css';

export default function DisconnectedScreen() {
  return (
    <div className="disconnect-root">
      <div className="disconnect-glow" aria-hidden="true" />

      <div className="disconnect-card">
        <div className="disconnect-brand">
          <div className="disconnect-brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <span className="disconnect-brand-name">Match-Two</span>
        </div>

        <div className="disconnect-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 12.5L9.5 18L20 6" />
          </svg>
        </div>

        <h1 className="disconnect-headline">You win!</h1>
        <p className="disconnect-subline" role="status" aria-live="polite">
          Your opponent left the game, so the match is yours.
        </p>

        <button
          type="button"
          className="disconnect-home-btn"
          onClick={() => window.location.assign('/')}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}