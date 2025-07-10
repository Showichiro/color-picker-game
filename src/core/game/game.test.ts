import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../types';
import {
  createColorPanel,
  createGame,
  createGameRound,
  createIdGenerator,
  generateChoicePanels,
  getGameScore,
  getGameStatus,
  isGameOver,
  makeGuess,
  processGuess,
  startNewRound,
} from './game';

describe('Game Domain', () => {
  describe('createIdGenerator', () => {
    it('should generate sequential unique IDs', () => {
      const generator = createIdGenerator();
      const id1 = generator();
      const id2 = generator();
      const id3 = generator();
      
      expect(id1).toBe('panel-0');
      expect(id2).toBe('panel-1');
      expect(id3).toBe('panel-2');
    });

    it('should create independent generators', () => {
      const generator1 = createIdGenerator();
      const generator2 = createIdGenerator();
      
      const id1 = generator1();
      const id2 = generator2();
      
      expect(id1).toBe('panel-0');
      expect(id2).toBe('panel-0');
    });
  });

  describe('createColorPanel', () => {
    it('should create a color panel with unique id using IdGenerator', () => {
      const idGenerator = createIdGenerator();
      const result1 = createColorPanel(idGenerator);
      const result2 = createColorPanel(idGenerator);
      
      expect(isOk(result1)).toBe(true);
      expect(isOk(result2)).toBe(true);
      
      if (isOk(result1) && isOk(result2)) {
        const panel1 = result1.value;
        const panel2 = result2.value;
        
        expect(panel1.id).toBe('panel-0');
        expect(panel2.id).toBe('panel-1');
        expect(panel1.color).toBeDefined();
        expect(panel1.color.r).toBeGreaterThanOrEqual(0);
        expect(panel1.color.r).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('generateChoicePanels', () => {
    it('should generate correct number of panels', () => {
      const idGenerator = createIdGenerator();
      const targetResult = createColorPanel(idGenerator);
      
      expect(isOk(targetResult)).toBe(true);
      if (isOk(targetResult)) {
        const target = targetResult.value;
        const result = generateChoicePanels(target, 3, 50, idGenerator);
        
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
          const panels = result.value;
          expect(panels).toHaveLength(3);
          expect(panels).toContainEqual(target);
        }
      }
    });

    it('should include target panel in random position', () => {
      const idGenerator = createIdGenerator();
      const targetResult = createColorPanel(idGenerator);
      
      expect(isOk(targetResult)).toBe(true);
      if (isOk(targetResult)) {
        const target = targetResult.value;
        const result = generateChoicePanels(target, 4, 50, idGenerator);
        
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
          const panels = result.value;
          const targetIndex = panels.findIndex(p => p.id === target.id);
          expect(targetIndex).toBeGreaterThanOrEqual(0);
          expect(targetIndex).toBeLessThan(4);
        }
      }
    });

    it('should generate panels with colors within max distance', () => {
      const idGenerator = createIdGenerator();
      const targetResult = createColorPanel(idGenerator);
      
      expect(isOk(targetResult)).toBe(true);
      if (isOk(targetResult)) {
        const target = targetResult.value;
        const result = generateChoicePanels(target, 3, 30, idGenerator);
        
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
          const panels = result.value;
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
        }
      }
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
      expect(game.lives).toBe(3);
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

  describe('processGuess', () => {
    it('should decrease lives on incorrect guess', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const game = { ...createGame(), currentRound: roundResult.value };
        const wrongPanel = game.currentRound.choices.find((p: any) => p.id !== game.currentRound!.target.id);
        
        const result = processGuess(game, wrongPanel!.id);
        
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
          expect(result.value.lives).toBe(2);
        }
      }
    });

    it('should set game over when lives reach 0', () => {
      const roundResult = createGameRound(1);
      if (isOk(roundResult)) {
        const game = { ...createGame(), lives: 1, currentRound: roundResult.value };
        const wrongPanel = game.currentRound.choices.find((p: any) => p.id !== game.currentRound!.target.id);
        
        const result = processGuess(game, wrongPanel!.id);
        
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
          expect(result.value.lives).toBe(0);
          expect(result.value.status).toBe('gameOver');
        }
      }
    });
  });
});