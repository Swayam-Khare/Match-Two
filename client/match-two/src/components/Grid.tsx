import '../styles/Grid.css';

import Card from './Card';
import type { Card as CardData } from '../types/game';

interface GridProps {
  grid: CardData[];
  onClick: (index: number) => void;
  message: string;
}

export default function Grid({ grid, onClick, message }: GridProps) {
  // Grid is always a perfect square (n x n), so this is safe.
  const size = Math.round(Math.sqrt(grid.length));

  return (
    <div className="grid-root">
      <div
        className="grid-board"
        style={{ '--grid-size': size } as React.CSSProperties}
      >
        {grid.map((card, index) => (
          <div
            key={card.id}
            className="grid-cell"
            role="button"
            tabIndex={0}
            onClick={() => onClick(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick(index);
              }
            }}
          >
            <Card card={card} />
          </div>
        ))}
      </div>

      <p className="grid-message" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}