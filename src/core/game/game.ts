import { generateRandomRGB, generateSimilarColor } from '../color/color';
import { type ColorPanelId, err, ok, type Result } from '../types';
import type { ColorPanel, Game, GameRound } from './types';

let panelIdCounter = 0;

export const createColorPanel = (): ColorPanel => ({
  id: `panel-${++panelIdCounter}` as ColorPanelId,
  color: generateRandomRGB(),
});

export const generateChoicePanels = (
  target: ColorPanel,
  count: number,
  maxDistance: number,
): ColorPanel[] => {
  const panels: ColorPanel[] = [target];
  
  while (panels.length < count) {
    const color = generateSimilarColor(target.color, maxDistance);
    const panel: ColorPanel = {
      id: `panel-${++panelIdCounter}` as ColorPanelId,
      color,
    };
    panels.push(panel);
  }
  
  // Shuffle panels
  return panels.sort(() => Math.random() - 0.5);
};

const getDifficultySettings = (level: number) => {
  const choiceCount = Math.min(2 + level, 9);
  const maxDistance = Math.max(150 - (level - 1) * 20, 10);
  return { choiceCount, maxDistance };
};

export const createGameRound = (level: number): Result<GameRound, string> => {
  if (level < 1) {
    return err(`Invalid level: ${level}`);
  }
  
  const { choiceCount, maxDistance } = getDifficultySettings(level);
  const target = createColorPanel();
  const choices = generateChoicePanels(target, choiceCount, maxDistance);
  
  return ok({
    level,
    target,
    choices,
    answered: false,
    correct: false,
  });
};

export const makeGuess = (
  round: GameRound,
  panelId: ColorPanelId,
): Result<GameRound, string> => {
  if (round.answered) {
    return err('Round already answered');
  }
  
  const chosenPanel = round.choices.find(p => p.id === panelId);
  if (!chosenPanel) {
    return err('Invalid panel ID');
  }
  
  return ok({
    ...round,
    answered: true,
    correct: chosenPanel.id === round.target.id,
  });
};

export const createGame = (): Game => ({
  currentRound: null,
  score: 0,
  level: 1,
  streak: 0,
  status: 'playing',
});

export const startNewRound = (game: Game): Result<Game, string> => {
  if (game.status === 'gameOver') {
    return err('Game is over');
  }
  
  // Calculate new level based on streak
  let newLevel = game.level;
  let newStreak = game.streak;
  
  if (game.streak >= 3) {
    newLevel = Math.min(game.level + 1, 10);
    newStreak = 0; // Reset streak after level up
  }
  
  const roundResult = createGameRound(newLevel);
  
  if (roundResult._tag === 'Err') {
    return roundResult;
  }
  
  return ok({
    ...game,
    level: newLevel,
    streak: newStreak,
    currentRound: roundResult.value,
  });
};

export const processGuess = (
  game: Game,
  panelId: ColorPanelId,
): Result<Game, string> => {
  if (!game.currentRound) {
    return err('No active round');
  }
  
  const guessResult = makeGuess(game.currentRound, panelId);
  if (guessResult._tag === 'Err') {
    return guessResult;
  }
  
  const updatedRound = guessResult.value;
  const newScore = updatedRound.correct ? game.score + 1 : game.score;
  const newStreak = updatedRound.correct ? game.streak + 1 : 0;
  
  return ok({
    ...game,
    currentRound: updatedRound,
    score: newScore,
    streak: newStreak,
  });
};

export const isGameOver = (game: Game): boolean => game.status === 'gameOver';

export const getGameScore = (game: Game): number => game.score;

export const getGameStatus = (game: Game): Game['status'] => game.status;