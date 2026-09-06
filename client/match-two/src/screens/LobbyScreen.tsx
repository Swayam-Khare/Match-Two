import '../styles/LobbyScreen.css';
import type { JoinData } from '../types/game';

export default function LobbyScreen({
  message
}: JoinData)
 {
  return (
    <div className="lobby-root">
      <div className="lobby-backdrop" aria-hidden="true" />
      <div className="lobby-glow" aria-hidden="true" />

      <div className="lobby-card">
        <div className="lobby-brand">
          <div className="lobby-brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <span className="lobby-brand-name">Match-Two</span>
        </div>

        <div className="lobby-arena">
          <div className="lobby-slot">
            <div className="lobby-avatar--empty" aria-hidden="true" />
          </div>

          <div className="lobby-vs">VS</div>

          <div className="lobby-slot">
            <div className="lobby-avatar--empty" aria-hidden="true" />
          </div>
        </div>

        <p className="lobby-message" role="status" aria-live="polite">
          {message}
        </p>

        <div className="lobby-footer">
          <div className="lobby-status">
            <span className="lobby-status-dot" aria-hidden="true" />
            Watching for a match
          </div>
        </div>
      </div>
    </div>
  );
}