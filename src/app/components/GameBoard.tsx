import type { GameRound } from '../../core/game/types';
import type { ColorPanelId } from '../../core/types';
import { ColorPanel } from './ColorPanel';

interface GameBoardProps {
  round: GameRound;
  onGuess: (panelId: ColorPanelId) => void;
}

export const GameBoard = ({ round, onGuess }: GameBoardProps) => {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Target Color Display */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Find this color:</h2>
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
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
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
        <div className={`text-3xl font-bold ${round.correct ? 'text-green-600' : 'text-red-600'}`}>
          {round.correct ? 'Correct!' : 'Wrong!'}
        </div>
      )}
    </div>
  );
};