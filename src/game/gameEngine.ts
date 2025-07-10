import { type ColorSet, generateColorSet } from "./colorGenerator";

export type GameState = "PLAYING" | "GAME_OVER" | "PAUSED";

export const GameState = {
  PLAYING: "PLAYING" as const,
  GAME_OVER: "GAME_OVER" as const,
  PAUSED: "PAUSED" as const,
};

export interface GameConfig {
  initialPanelCount: number;
  initialLives: number;
  panelIncreaseInterval: number;
  difficultyIncreaseRate: number;
}

export interface GameStateData {
  score: number;
  lives: number;
  level: number;
  gameStatus: GameState;
  currentRound: ColorSet | null;
  consecutiveCorrect: number;
  panelCount: number;
  difficulty: number;
}

export class GameEngine {
  private config: GameConfig;
  private state: GameStateData;
  private roundStartTime: number = 0;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeState();
    this.startNewRound();
  }

  private initializeState(): GameStateData {
    return {
      score: 0,
      lives: this.config.initialLives,
      level: 1,
      gameStatus: GameState.PLAYING,
      currentRound: null,
      consecutiveCorrect: 0,
      panelCount: this.config.initialPanelCount,
      difficulty: 1,
    };
  }

  private startNewRound(): void {
    if (this.state.gameStatus !== GameState.PLAYING) return;

    this.state.currentRound = generateColorSet({
      panelCount: this.state.panelCount,
      difficulty: this.state.difficulty,
    });
    this.roundStartTime = Date.now();
  }

  public selectColor(index: number): void {
    if (
      this.state.gameStatus !== GameState.PLAYING ||
      !this.state.currentRound
    ) {
      return;
    }

    const isCorrect = index === this.state.currentRound.targetIndex;

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }

    if (this.state.gameStatus === GameState.PLAYING) {
      this.startNewRound();
    }
  }

  private handleCorrectAnswer(): void {
    const timeTaken = Date.now() - this.roundStartTime;
    const baseScore = 100 * this.state.level;
    const timeBonus = Math.max(0, 50 - Math.floor(timeTaken / 100));
    const comboBonus = this.state.consecutiveCorrect * 10;

    this.state.score += baseScore + timeBonus + comboBonus;
    this.state.consecutiveCorrect++;
    this.state.level++;

    // Update difficulty
    if (this.state.level % this.config.panelIncreaseInterval === 0) {
      this.state.panelCount = Math.min(this.state.panelCount + 1, 8);
    }

    this.state.difficulty =
      1 + (this.state.level - 1) * this.config.difficultyIncreaseRate;
  }

  private handleWrongAnswer(): void {
    this.state.lives--;
    this.state.consecutiveCorrect = 0;

    if (this.state.lives <= 0) {
      this.state.gameStatus = GameState.GAME_OVER;
    }
  }

  public getState(): Readonly<GameStateData> {
    return this.state;
  }

  public resetGame(): void {
    this.state = this.initializeState();
    this.startNewRound();
  }

  public pauseGame(): void {
    if (this.state.gameStatus === GameState.PLAYING) {
      this.state.gameStatus = GameState.PAUSED;
    }
  }

  public resumeGame(): void {
    if (this.state.gameStatus === GameState.PAUSED) {
      this.state.gameStatus = GameState.PLAYING;
      this.roundStartTime = Date.now();
    }
  }
}
