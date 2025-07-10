import { useMemo } from "react";
import type { GameStateData } from "../game/gameEngine";
import { ColorPanel } from "./ColorPanel";
import "./GameBoard.css";

interface GameBoardProps {
  gameState: GameStateData;
  onColorSelect: (index: number) => void;
  selectedIndex?: number;
  showFeedback?: boolean;
}

const getGridColumnsForCount = (count: number): number => {
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
};

export function GameBoard({
  gameState,
  onColorSelect,
  selectedIndex,
  showFeedback = false,
}: GameBoardProps) {
  const { currentRound, score, lives, level, gameStatus } = gameState;
  const isGameOver = gameStatus === "GAME_OVER";

  const gridColumns = useMemo(
    () =>
      currentRound ? getGridColumnsForCount(currentRound.colors.length) : 2,
    [currentRound?.colors.length],
  );

  if (!currentRound) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-board">
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Lives:</span>
          <span className="stat-value">{lives}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{level}</span>
        </div>
      </div>

      <div className="target-color-container">
        <p className="target-label">Pick this color:</p>
        <div
          className="target-color"
          style={{ backgroundColor: currentRound.targetColor }}
        />
      </div>

      <div
        className="color-grid"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
      >
        {currentRound.colors.map((color, index) => (
          <ColorPanel
            key={`${level}-${index}`}
            color={color}
            onClick={() => onColorSelect(index)}
            isDisabled={isGameOver || showFeedback}
            isCorrect={showFeedback && index === currentRound.targetIndex}
            isWrong={
              showFeedback &&
              selectedIndex === index &&
              index !== currentRound.targetIndex
            }
          />
        ))}
      </div>
    </div>
  );
}
