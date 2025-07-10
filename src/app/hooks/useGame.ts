import { useCallback, useState } from 'react';
import {
  createGame,
  isGameOver,
  processGuess,
  startNewRound,
} from '../../core/game/game';
import type { Game } from '../../core/game/types';
import { type ColorPanelId, isErr } from '../../core/types';

export const useGame = () => {
  const [game, setGame] = useState<Game>(createGame());
  const [error, setError] = useState<string | null>(null);

  const handleStartNewRound = useCallback(() => {
    setError(null);
    const result = startNewRound(game);
    
    if (isErr(result)) {
      setError(result.error);
      return;
    }
    
    setGame(result.value);
  }, [game]);

  const handleMakeGuess = useCallback((panelId: ColorPanelId) => {
    setError(null);
    const result = processGuess(game, panelId);
    
    if (isErr(result)) {
      setError(result.error);
      return;
    }
    
    setGame(result.value);
  }, [game]);

  const resetGame = useCallback(() => {
    setError(null);
    setGame(createGame());
  }, []);

  return {
    game,
    isGameOver: isGameOver(game),
    startNewRound: handleStartNewRound,
    makeGuess: handleMakeGuess,
    resetGame,
    error,
  };
};