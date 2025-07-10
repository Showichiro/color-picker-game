import { useGame } from '../hooks/useGame';
import { GameBoard } from './GameBoard';

export const Game = () => {
  const { game, isGameOver, startNewRound, makeGuess, resetGame, error } = useGame();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Color Picker Game
          </h1>
          <div className="flex justify-center gap-8 text-lg">
            <div>
              <span className="font-semibold">Score:</span> {game.score}
            </div>
            <div>
              <span className="font-semibold">Level:</span> {game.level}
            </div>
            <div>
              <span className="font-semibold">Streak:</span> {game.streak}
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Game Area */}
        <main className="bg-white rounded-lg shadow-lg p-8">
          {game.currentRound ? (
            <>
              <GameBoard round={game.currentRound} onGuess={makeGuess} />
              
              {game.currentRound.answered && (
                <div className="mt-8 text-center">
                  <button
                    onClick={startNewRound}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Next Round
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                  <p className="text-xl mb-8">Final Score: {game.score}</p>
                  <button
                    onClick={resetGame}
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
                    onClick={startNewRound}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Start Game
                  </button>
                </>
              )}
            </div>
          )}
        </main>

        {/* Instructions */}
        <footer className="mt-8 text-center text-gray-600">
          <p>Click on the panel that matches the target color.</p>
          <p>Get 3 correct in a row to level up!</p>
        </footer>
      </div>
    </div>
  );
};