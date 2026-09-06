import '../styles/Card.css';
import type { Card, CardProps } from '../types/game';

// Fixed set of burst particles at N evenly-spaced angles.
function createParticles(count: number, glyphs: [string, string]) {
  return Array.from({ length: count }, (_, i) => ({
    angle: (360 / count) * i,
    glyph: i % 2 === 0 ? glyphs[0] : glyphs[1],
  }));
}
 
const MATCH_PARTICLES = createParticles(8, ['★', '●']);
const WILDCARD_PARTICLES = createParticles(6, ['⚡', '✦']);
 

export default function Card({ card }: CardProps) {
  const isRevealed = card.isFlipped || card.isMatched;

  const cardClassName = [
    'card',
    isRevealed ? 'card--revealed' : '',
    card.isMatched ? 'card--matched' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClassName}>
      <div className="card-inner">
        {/* Backside — identical for every card */}
        <div className="card-face card-face--back">
          <span className="card-back-pattern" aria-hidden="true" />
        </div>

        {/* Front — the emoji value, shown once flipped or matched */}
        <div className="card-face card-face--front">
          <span className="card-value" role="img" aria-label="card symbol">
            {card.value}
          </span>
        </div>
      </div>

      {card.isMatched && (
        <div className="card-burst" aria-hidden="true">
          {MATCH_PARTICLES.map(({ angle, glyph }, i) => (
            <span
              key={i}
              className="card-burst-particle"
              style={{ '--angle': `${angle}deg` } as React.CSSProperties}
            >
              {glyph}
            </span>
          ))}
        </div>
      )}

      {card.isWildcard && isRevealed && (
        <div className="card-burst card-burst--wildcard" aria-hidden="true">
          {WILDCARD_PARTICLES.map(({ angle, glyph }, i) => (
            <span
              key={i}
              className="card-burst-particle card-burst-particle--wildcard"
              style={{ '--angle': `${angle}deg` } as React.CSSProperties}
            >
              {glyph}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}