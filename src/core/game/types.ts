import type { ColorPanelId, RGB } from '../types';

export interface ColorPanel {
  readonly id: ColorPanelId;
  readonly color: RGB;
}

export interface GameRound {
  readonly level: number;
  readonly target: ColorPanel;
  readonly choices: ReadonlyArray<ColorPanel>;
  readonly answered: boolean;
  readonly correct: boolean;
}

type GameStatus = 'playing' | 'gameOver';

export interface Game {
  readonly currentRound: GameRound | null;
  readonly score: number;
  readonly level: number;
  readonly streak: number;
  readonly status: GameStatus;
}