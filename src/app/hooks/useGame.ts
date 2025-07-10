import { useCallback, useReducer } from 'react';
import {
  canStartNewRound,
  createGame,
  isGameOver,
  processGuess,
  startNewRound,
} from '../../core/game/game';
import type { Game } from '../../core/game/types';
import { type ColorPanelId, isErr } from '../../core/types';

type GameState = {
  game: Game;
  error: string | null;
};

type GameAction =
  | { type: 'START_NEW_ROUND' }
  | { type: 'MAKE_GUESS'; panelId: ColorPanelId }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'UPDATE_GAME'; game: Game };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_NEW_ROUND': {
      const result = startNewRound(state.game);
      return isErr(result)
        ? { ...state, error: result.error }
        : { game: result.value, error: null };
    }
    case 'MAKE_GUESS': {
      const result = processGuess(state.game, action.panelId);
      return isErr(result)
        ? { ...state, error: result.error }
        : { game: result.value, error: null };
    }
    case 'RESET_GAME':
      return { game: createGame(), error: null };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'UPDATE_GAME':
      return { game: action.game, error: null };
    default:
      return state;
  }
};

export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, {
    game: createGame(),
    error: null,
  });

  const handleStartNewRound = useCallback(() => {
    dispatch({ type: 'START_NEW_ROUND' });
  }, []);

  const handleMakeGuess = useCallback((panelId: ColorPanelId) => {
    dispatch({ type: 'MAKE_GUESS', panelId });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    game: state.game,
    isGameOver: isGameOver(state.game),
    canStartNewRound: canStartNewRound(state.game),
    startNewRound: handleStartNewRound,
    makeGuess: handleMakeGuess,
    resetGame,
    error: state.error,
  };
};