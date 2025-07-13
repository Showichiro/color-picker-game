import { generateRandomRGB, generateSimilarColor } from '../color/color';
import { type ColorPanelId, err, isOk, ok, type Result } from '../types';
import type { ColorPanel, Game, GameRound } from './types';

type IdGenerator = () => ColorPanelId;

export const createIdGenerator = (): IdGenerator => {
  let counter = 0;
  return () => `panel-${counter++}` as ColorPanelId;
};

export const createColorPanel = (idGenerator: IdGenerator): Result<ColorPanel, string> => {
  const colorResult = generateRandomRGB();
  if (!isOk(colorResult)) {
    return err('Failed to generate random RGB');
  }
  return ok({
    id: idGenerator(),
    color: colorResult.value,
  });
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateChoicePanels = (
  target: ColorPanel,
  count: number,
  maxDistance: number,
  idGenerator: IdGenerator,
): Result<ColorPanel[], string> => {
  const panels: ColorPanel[] = [target];
  
  for (let i = 1; i < count; i++) {
    const colorResult = generateSimilarColor(target.color, maxDistance);
    if (!isOk(colorResult)) {
      return err('Failed to generate similar color');
    }
    panels.push({
      id: idGenerator(),
      color: colorResult.value,
    });
  }
  
  return ok(shuffleArray(panels));
};

const DIFFICULTY_SETTINGS = {
  MIN_CHOICES: 2,
  MAX_CHOICES: 9,
  BASE_DISTANCE: 150,
  DISTANCE_STEP: 20,
  MIN_DISTANCE: 10,
} as const;

const getDifficultySettings = (level: number) => ({
  choiceCount: Math.min(DIFFICULTY_SETTINGS.MIN_CHOICES + level, DIFFICULTY_SETTINGS.MAX_CHOICES),
  maxDistance: Math.max(
    DIFFICULTY_SETTINGS.BASE_DISTANCE - (level - 1) * DIFFICULTY_SETTINGS.DISTANCE_STEP,
    DIFFICULTY_SETTINGS.MIN_DISTANCE
  ),
});

export const createGameRound = (level: number): Result<GameRound, string> => {
  if (level < 1) {
    return err(`Invalid level: ${level}`);
  }
  
  const { choiceCount, maxDistance } = getDifficultySettings(level);
  const idGenerator = createIdGenerator();
  const targetResult = createColorPanel(idGenerator);
  
  if (!isOk(targetResult)) {
    return err(targetResult.error);
  }
  
  const target = targetResult.value;
  const choicesResult = generateChoicePanels(target, choiceCount, maxDistance, idGenerator);
  
  if (!isOk(choicesResult)) {
    return err(choicesResult.error);
  }
  
  return ok({
    level,
    target,
    choices: choicesResult.value,
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
  lives: 3,
  status: 'playing',
});

const GAME_CONSTANTS = {
  STREAK_THRESHOLD: 3,
  MAX_LEVEL: 10,
} as const;

const calculateLevelProgression = (level: number, streak: number) => {
  if (streak >= GAME_CONSTANTS.STREAK_THRESHOLD) {
    return {
      level: Math.min(level + 1, GAME_CONSTANTS.MAX_LEVEL),
      streak: 0,
    };
  }
  return { level, streak };
};

export const startNewRound = (game: Game): Result<Game, string> => {
  if (game.status === 'gameOver') {
    return err('Game is over');
  }
  
  const { level: newLevel, streak: newStreak } = calculateLevelProgression(game.level, game.streak);
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
  const newLives = updatedRound.correct ? game.lives : game.lives - 1;
  const newStatus = newLives <= 0 ? 'gameOver' : 'playing';
  
  return ok({
    ...game,
    currentRound: updatedRound,
    score: newScore,
    streak: newStreak,
    lives: newLives,
    status: newStatus,
  });
};

export const isGameOver = (game: Game): boolean => game.status === 'gameOver';

export const getGameScore = (game: Game): number => game.score;

export const getGameStatus = (game: Game): Game['status'] => game.status;

export const canStartNewRound = (game: Game): boolean => 
  game.status === 'playing' && (!game.currentRound || game.currentRound.answered);