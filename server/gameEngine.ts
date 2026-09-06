import type { Card, Status } from "./models/game.model.js";

export class GameEngine {
  grid: Card[];
  scores: [number, number];
  currentPlayer: 0 | 1;
  cardsFlipped: Card[];
  gameStart: boolean;
  isLocked: boolean = false;

  constructor(cards: Card[]) {
    this.grid = cards;
    this.scores = [0, 0];
    this.currentPlayer = 0;
    this.cardsFlipped = [];
    this.gameStart = true;
  }

  setup(): void {
    // Reset the card's state
    this.grid.forEach((card: Card) => {
      card.isFlipped = false;
      card.isMatched = false;
    });

    // Shuffle the cards using Fisher-Yates
    for (let i: number = this.grid.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [this.grid[i], this.grid[j]] = [this.grid[j]!, this.grid[i]!];
    }

    this.scores = [0, 0];
    this.gameStart = true;
  }

  validateInput(userInput: string): boolean {
    try {
      const number: number = parseInt(userInput);

      if (
        number >= 0 &&
        number < 25 &&
        !this.grid[number]?.isFlipped &&
        !this.grid[number]?.isMatched
      ) {
        return true;
      }

      return false;
    } catch (error: unknown) {
      return false;
    }
  }

  processFlip(index: number): Status {
    if (this.isLocked) {
      return { status: "LOCKED" };
    }

    const flippedCard: Card = this.grid[index]!;
    flippedCard.isFlipped = true;

    if (flippedCard.isWildcard) {
      this.scores[this.currentPlayer]++;
      this.cardsFlipped.push(flippedCard);
      this.isLocked = true;
      return { status: "WILDCARD", card: flippedCard };
    }

    if (this.cardsFlipped.length === 0) {
      this.cardsFlipped.push(flippedCard);
      return { status: "FIRST_CARD", card: flippedCard };
    }

    const previousCard: Card = this.cardsFlipped[0]!;

    if (flippedCard.value === previousCard.value) {
      this.cardsFlipped.push(flippedCard);
      this.scores[this.currentPlayer]++;
      this.isLocked = true;

      return { status: "MATCH", cards: [flippedCard, previousCard] };
    }

    this.cardsFlipped.push(flippedCard);
    this.isLocked = true;
    return { status: "MISMATCH", cards: [flippedCard, previousCard] };
  }

  unflipCards(): void {
    this.cardsFlipped.forEach((card: Card) => {
      card.isFlipped = false;
    });
    this.isLocked = false;
    this.cardsFlipped = [];
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
  }

  resolveMatch() {
    this.cardsFlipped.forEach((card: Card) => {
      card.isMatched = true;
    });
    this.isLocked = false;
    this.cardsFlipped = [];
  }

  resolveWildcard() {
    this.cardsFlipped.forEach((card: Card) => {
      if (card.isWildcard) {
        card.isMatched = true;
      } else {
        card.isFlipped = false;
      }
    });
    this.isLocked = false;
    this.cardsFlipped = [];
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
  }

  isGameCompleted(): boolean {
    let haveUnMatched: boolean = false;

    for (const card of this.grid) {
      if (!card.isMatched) {
        haveUnMatched = true;
        break;
      }
    }

    if (!haveUnMatched) {
      this.gameStart = false;
      this.isLocked = true;
      return true;
    }

    return false;
  }
}
