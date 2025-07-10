import { useGame } from '../hooks/useGame';
import { ErrorAlert } from './ErrorAlert';
import { GameHeader } from './GameHeader';
import { GameInstructions } from './GameInstructions';
import { GameStateManager } from './GameStateManager';

export const Game = () => {
  const { game, isGameOver, startNewRound, makeGuess, resetGame, error } = useGame();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <GameHeader 
          score={game.score}
          level={game.level}
          lives={game.lives}
          streak={game.streak}
        />

        <ErrorAlert error={error} />

        <main className="bg-white rounded-lg shadow-lg p-8">
          <GameStateManager
            game={game}
            isGameOver={isGameOver}
            currentRound={game.currentRound}
            onStartNewRound={startNewRound}
            onResetGame={resetGame}
            onGuess={makeGuess}
          />
        </main>

        <GameInstructions />
      </div>
    </div>
  );
};