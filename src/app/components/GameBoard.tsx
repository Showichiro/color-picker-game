import type { GameRound } from '../../core/game/types';
import type { ColorPanelId } from '../../core/types';
import { ColorPanel } from './ColorPanel';

interface GameBoardProps {
  round: GameRound;
  onGuess: (panelId: ColorPanelId) => void;
}

export const GameBoard = ({ round, onGuess }: GameBoardProps) => {
  const getGridCols = () => {
    const count = round.choices.length;
    if (count <= 4) return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4';
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3';
    if (count <= 9) return 'grid-cols-3 sm:grid-cols-3 md:grid-cols-3';
    return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4';
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4" data-testid="game-board-container">
      {/* Target Color Display */}
      <div className="text-center md:flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 md:mb-4">Find this color:</h2>
        <div className="flex justify-center">
          <ColorPanel
            panel={round.target}
            onClick={() => {}}
            disabled
            isTarget
          />
        </div>
      </div>

      {/* Choice Panels */}
      <div className={`grid ${getGridCols()} gap-2 sm:gap-3 md:gap-4 w-full max-w-lg md:max-w-2xl`} data-testid="choices-grid">
        {round.choices.map((panel) => (
          <ColorPanel
            key={panel.id}
            panel={panel}
            onClick={onGuess}
            disabled={round.answered}
          />
        ))}
      </div>

      {/* Result Display */}
      {round.answered && (
        <div className={`text-2xl sm:text-3xl font-bold ${round.correct ? 'text-green-600' : 'text-red-600'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:static md:transform-none`}>
          {round.correct ? 'Correct!' : 'Wrong!'}
        </div>
      )}
    </div>
  );
};