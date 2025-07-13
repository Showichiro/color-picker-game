import type { Game, GameRound } from '../../core/game/types';
import type { ColorPanelId } from '../../core/types';
import { GameBoard } from './GameBoard';

type GameStateManagerProps = {
  game: Game;
  isGameOver: boolean;
  currentRound: GameRound | null;
  onStartNewRound: () => void;
  onResetGame: () => void;
  onGuess: (panelId: ColorPanelId) => void;
};

export const GameStateManager = ({
  game,
  isGameOver,
  currentRound,
  onStartNewRound,
  onResetGame,
  onGuess,
}: GameStateManagerProps) => {
  if (currentRound) {
    return (
      <>
        <GameBoard round={currentRound} onGuess={onGuess} />
        
        {currentRound.answered && (
          <div className="mt-8 text-center">
            <button
              onClick={onStartNewRound}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Next Round
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="text-center py-16">
      {isGameOver ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-8">Final Score: {game.score}</p>
          <button
            onClick={onResetGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-8">
            Test your color recognition skills!
          </h2>
          <button
            onClick={onStartNewRound}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
};