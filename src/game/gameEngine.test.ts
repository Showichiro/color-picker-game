import { beforeEach, describe, expect, it } from "vitest";
import { type GameConfig, GameEngine, GameState } from "./gameEngine";

describe("GameEngine", () => {
  let engine: GameEngine;
  const defaultConfig: GameConfig = {
    initialPanelCount: 2,
    initialLives: 3,
    panelIncreaseInterval: 2,
    difficultyIncreaseRate: 0.5,
  };

  beforeEach(() => {
    engine = new GameEngine(defaultConfig);
  });

  describe("initialization", () => {
    it("should initialize with correct default state", () => {
      const state = engine.getState();

      expect(state.score).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.level).toBe(1);
      expect(state.gameStatus).toBe(GameState.PLAYING);
      expect(state.currentRound).toBeDefined();
      expect(state.currentRound?.colors).toHaveLength(2);
    });
  });

  describe("game progression", () => {
    it("should increase score on correct answer", () => {
      const initialScore = engine.getState().score;
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        engine.selectColor(correctIndex);
        expect(engine.getState().score).toBeGreaterThan(initialScore);
      }
    });

    it("should decrease lives on wrong answer", () => {
      const initialLives = engine.getState().lives;
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        const wrongIndex = correctIndex === 0 ? 1 : 0;
        engine.selectColor(wrongIndex);
        expect(engine.getState().lives).toBe(initialLives - 1);
      }
    });

    it("should end game when lives reach zero", () => {
      // Make 3 wrong selections
      for (let i = 0; i < 3; i++) {
        const correctIndex = engine.getState().currentRound?.targetIndex;
        const wrongIndex = correctIndex === 0 ? 1 : 0;
        engine.selectColor(wrongIndex);
      }

      expect(engine.getState().lives).toBe(0);
      expect(engine.getState().gameStatus).toBe(GameState.GAME_OVER);
    });

    it("should increase panel count at specified intervals", () => {
      const correctIndex = engine.getState().currentRound?.targetIndex;

      // First level should have 2 panels
      expect(engine.getState().currentRound?.colors).toHaveLength(2);

      if (correctIndex !== undefined) {
        // Make correct selections to advance levels
        engine.selectColor(correctIndex);
        const newCorrectIndex = engine.getState().currentRound?.targetIndex;
        if (newCorrectIndex !== undefined) {
          engine.selectColor(newCorrectIndex);
          // After 2 correct answers, panel count should increase
          expect(engine.getState().currentRound?.colors).toHaveLength(3);
        }
      }
    });

    it("should track consecutive correct answers", () => {
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        engine.selectColor(correctIndex);
        expect(engine.getState().consecutiveCorrect).toBe(1);

        const newCorrectIndex = engine.getState().currentRound?.targetIndex;
        if (newCorrectIndex !== undefined) {
          engine.selectColor(newCorrectIndex);
          expect(engine.getState().consecutiveCorrect).toBe(2);
        }
      }
    });

    it("should reset consecutive count on wrong answer", () => {
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        engine.selectColor(correctIndex);
        expect(engine.getState().consecutiveCorrect).toBe(1);

        const newCorrectIndex = engine.getState().currentRound?.targetIndex;
        if (newCorrectIndex !== undefined) {
          const wrongIndex = newCorrectIndex === 0 ? 1 : 0;
          engine.selectColor(wrongIndex);
          expect(engine.getState().consecutiveCorrect).toBe(0);
        }
      }
    });
  });

  describe("score calculation", () => {
    it("should award higher scores for higher difficulty", () => {
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        // Get score for level 1
        engine.selectColor(correctIndex);
        const level1Score = engine.getState().score;

        // Advance to higher level
        for (let i = 0; i < 5; i++) {
          const idx = engine.getState().currentRound?.targetIndex;
          if (idx !== undefined) {
            engine.selectColor(idx);
          }
        }

        const previousScore = engine.getState().score;
        const idx = engine.getState().currentRound?.targetIndex;
        if (idx !== undefined) {
          engine.selectColor(idx);
          const scoreIncrease = engine.getState().score - previousScore;
          expect(scoreIncrease).toBeGreaterThan(level1Score);
        }
      }
    });
  });

  describe("game reset", () => {
    it("should reset game state properly", () => {
      const correctIndex = engine.getState().currentRound?.targetIndex;

      if (correctIndex !== undefined) {
        // Play a few rounds
        engine.selectColor(correctIndex);
        engine.selectColor(0);
      }

      engine.resetGame();
      const state = engine.getState();

      expect(state.score).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.level).toBe(1);
      expect(state.gameStatus).toBe(GameState.PLAYING);
      expect(state.consecutiveCorrect).toBe(0);
    });
  });
});
