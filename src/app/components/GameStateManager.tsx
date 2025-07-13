import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
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
              {t('game.nextRound')}
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
          <h2 className="text-3xl font-bold mb-4">{t('game.gameOver')}</h2>
          <p className="text-xl mb-8">{t('game.finalScore')}: {game.score}</p>
          <button
            onClick={onResetGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {t('game.playAgain')}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-8">
            {t('game.testSkills')}
          </h2>
          <button
            onClick={onStartNewRound}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {t('game.startGame')}
          </button>
        </>
      )}
    </div>
  );
};