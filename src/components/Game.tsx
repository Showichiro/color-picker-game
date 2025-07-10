import { useCallback, useEffect, useState } from "react";
import { type GameConfig, GameEngine } from "../game/gameEngine";
import { GameBoard } from "./GameBoard";
import "./Game.css";

const gameConfig: GameConfig = {
  initialPanelCount: 2,
  initialLives: 3,
  panelIncreaseInterval: 2,
  difficultyIncreaseRate: 0.5,
};

export function Game() {
  const [gameEngine] = useState(() => new GameEngine(gameConfig));
  const [gameState, setGameState] = useState(gameEngine.getState());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const updateGameState = useCallback(() => {
    setGameState(gameEngine.getState());
  }, [gameEngine]);

  const handleColorSelect = useCallback(
    (index: number) => {
      if (showFeedback) return;

      setSelectedIndex(index);
      setShowFeedback(true);

      // Show feedback for a moment before proceeding
      setTimeout(() => {
        gameEngine.selectColor(index);
        updateGameState();
        setSelectedIndex(null);
        setShowFeedback(false);
      }, 800);
    },
    [gameEngine, updateGameState, showFeedback],
  );

  const handlePlayAgain = useCallback(() => {
    gameEngine.resetGame();
    updateGameState();
  }, [gameEngine, updateGameState]);

  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  if (gameState.gameStatus === "GAME_OVER") {
    return (
      <div className="game-container">
        <div className="game-over-screen">
          <h1>Game Over!</h1>
          <p className="final-score">Final Score: {gameState.score}</p>
          <p className="level-reached">Level Reached: {gameState.level}</p>
          <button
            type="button"
            className="play-again-button"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Color Picker Game</h1>
      <GameBoard
        gameState={gameState}
        onColorSelect={handleColorSelect}
        selectedIndex={selectedIndex ?? undefined}
        showFeedback={showFeedback}
      />
    </div>
  );
}
