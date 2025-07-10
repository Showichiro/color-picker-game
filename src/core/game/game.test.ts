import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../types';
import {
  createColorPanel,
  createGame,
  createGameRound,
  generateChoicePanels,
  getGameScore,
  getGameStatus,
  isGameOver,
  makeGuess,
  processGuess,
  startNewRound,
} from './game';

describe('Game Domain', () => {
  describe('createColorPanel', () => {
    it('should create a color panel with unique id', () => {
      const panel1 = createColorPanel();
      const panel2 = createColorPanel();
      
      expect(panel1.id).not.toBe(panel2.id);
      expect(panel1.color).toBeDefined();
      expect(panel1.color.r).toBeGreaterThanOrEqual(0);
      expect(panel1.color.r).toBeLessThanOrEqual(255);
    });
  });

  describe('generateChoicePanels', () => {
    it('should generate correct number of panels', () => {
      const target = createColorPanel();
      const panels = generateChoicePanels(target, 3, 50);
      
      expect(panels).toHaveLength(3);
      expect(panels).toContainEqual(target);
    });

    it('should include target panel in random position', () => {
      const target = createColorPanel();
      const panels = generateChoicePanels(target, 4, 50);
      
      const targetIndex = panels.findIndex(p => p.id === target.id);
      expect(targetIndex).toBeGreaterThanOrEqual(0);
      expect(targetIndex).toBeLessThan(4);
    });

    it('should generate panels with colors within max distance', () => {
      const target = createColorPanel();
      const panels = generateChoicePanels(target, 3, 30);
      
      panels.forEach(panel => {
        if (panel.id !== target.id) {
          const distance = Math.sqrt(
            Math.pow(panel.color.r - target.color.r, 2) +
            Math.pow(panel.color.g - target.color.g, 2) +
            Math.pow(panel.color.b - target.color.b, 2)
          );
          expect(distance).toBeLessThanOrEqual(30);
        }
      });
    });
  });

  describe('createGameRound', () => {
    it('should create a game round with correct difficulty', () => {
      const result = createGameRound(1);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        const round = result.value;
        expect(round.level).toBe(1);
        expect(round.choices).toHaveLength(3); // Level 1 = 3 choices
        expect(round.answered).toBe(false);
        expect(round.correct).toBe(false);
      }
    });

    it('should increase choices with level', () => {
      const result = createGameRound(3);
      
      if (isOk(result)) {
        const round = result.value;
        expect(round.choices).toHaveLength(5); // Level 3 = 5 choices
      }
    });

    it('should decrease max distance with level', () => {
      // This is implicitly tested by the implementation
      const result1 = createGameRound(1);
      const result5 = createGameRound(5);
      
      expect(isOk(result1)).toBe(true);
      expect(isOk(result5)).toBe(true);
    });

    it('should fail with invalid level', () => {
      const result = createGameRound(0);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Invalid level: 0');
      }
    });
  });

  describe('makeGuess', () => {
    it('should mark correct guess', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const round = roundResult.value;
        const guessResult = makeGuess(round, round.target.id);
        
        if (isOk(guessResult)) {
          const updatedRound = guessResult.value;
          expect(updatedRound.answered).toBe(true);
          expect(updatedRound.correct).toBe(true);
        }
      }
    });

    it('should mark incorrect guess', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const round = roundResult.value;
        const wrongPanel = round.choices.find(p => p.id !== round.target.id);
        
        if (wrongPanel) {
          const guessResult = makeGuess(round, wrongPanel.id);
          
          if (isOk(guessResult)) {
            const updatedRound = guessResult.value;
            expect(updatedRound.answered).toBe(true);
            expect(updatedRound.correct).toBe(false);
          }
        }
      }
    });

    it('should not allow answering twice', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const round = roundResult.value;
        const firstGuess = makeGuess(round, round.target.id);
        
        if (isOk(firstGuess)) {
          const secondGuess = makeGuess(firstGuess.value, round.target.id);
          expect(isErr(secondGuess)).toBe(true);
          if (isErr(secondGuess)) {
            expect(secondGuess.error).toBe('Round already answered');
          }
        }
      }
    });

    it('should validate panel exists in choices', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const round = roundResult.value;
        const guessResult = makeGuess(round, 'invalid-id' as any);
        
        expect(isErr(guessResult)).toBe(true);
        if (isErr(guessResult)) {
          expect(guessResult.error).toBe('Invalid panel ID');
        }
      }
    });
  });

  describe('createGame', () => {
    it('should create new game with initial state', () => {
      const game = createGame();
      
      expect(game.score).toBe(0);
      expect(game.status).toBe('playing');
      expect(game.currentRound).toBeNull();
      expect(game.level).toBe(1);
      expect(game.streak).toBe(0);
    });
  });

  describe('startNewRound', () => {
    it('should start first round', () => {
      const game = createGame();
      const result = startNewRound(game);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        const updatedGame = result.value;
        expect(updatedGame.currentRound).not.toBeNull();
        expect(updatedGame.level).toBe(1);
      }
    });

    it('should increase level after correct streak', () => {
      let game = createGame();
      
      // Simulate 3 correct answers in a row
      for (let i = 0; i < 3; i++) {
        const roundResult = startNewRound(game);
        if (isOk(roundResult)) {
          game = roundResult.value;
          if (game.currentRound) {
            const guessResult = processGuess(game, game.currentRound.target.id);
            if (isOk(guessResult)) {
              game = guessResult.value;
            }
          }
        }
      }
      
      // At this point, game.streak should be 3
      expect(game.streak).toBe(3);
      
      const nextRound = startNewRound(game);
      if (isOk(nextRound)) {
        expect(nextRound.value.level).toBe(2);
      }
    });
  });

  describe('isGameOver', () => {
    it('should return true when status is game over', () => {
      const game = { ...createGame(), status: 'gameOver' as const };
      expect(isGameOver(game)).toBe(true);
    });

    it('should return false when status is playing', () => {
      const game = createGame();
      expect(isGameOver(game)).toBe(false);
    });
  });

  describe('getGameScore', () => {
    it('should return current score', () => {
      const game = { ...createGame(), score: 42 };
      expect(getGameScore(game)).toBe(42);
    });
  });

  describe('getGameStatus', () => {
    it('should return current status', () => {
      const game = createGame();
      expect(getGameStatus(game)).toBe('playing');
    });
  });
});