import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameBoard } from "./GameBoard";

describe("GameBoard", () => {
  const mockGameState = {
    score: 100,
    lives: 3,
    level: 2,
    gameStatus: "PLAYING" as const,
    currentRound: {
      colors: ["#ff0000", "#00ff00", "#0000ff"],
      targetColor: "#ff0000",
      targetIndex: 0,
    },
    consecutiveCorrect: 1,
    panelCount: 3,
    difficulty: 1.5,
  };

  it("should display the target color", () => {
    render(<GameBoard gameState={mockGameState} onColorSelect={() => {}} />);

    expect(screen.getByText(/Pick this color:/i)).toBeInTheDocument();
  });

  it("should render the correct number of color panels", () => {
    render(<GameBoard gameState={mockGameState} onColorSelect={() => {}} />);

    const panels = screen.getAllByRole("button");
    expect(panels).toHaveLength(3);
  });

  it("should call onColorSelect with the correct index when a panel is clicked", () => {
    const handleColorSelect = vi.fn();
    render(
      <GameBoard gameState={mockGameState} onColorSelect={handleColorSelect} />,
    );

    const panels = screen.getAllByRole("button");
    fireEvent.click(panels[1]);

    expect(handleColorSelect).toHaveBeenCalledWith(1);
  });

  it("should display game stats", () => {
    render(<GameBoard gameState={mockGameState} onColorSelect={() => {}} />);

    expect(screen.getByText(/Score: 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Lives: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Level: 2/i)).toBeInTheDocument();
  });

  it("should disable panels when game is over", () => {
    const gameOverState = {
      ...mockGameState,
      gameStatus: "GAME_OVER" as const,
      lives: 0,
    };

    render(<GameBoard gameState={gameOverState} onColorSelect={() => {}} />);

    const panels = screen.getAllByRole("button");
    panels.forEach((panel) => {
      expect(panel).toBeDisabled();
    });
  });

  it("should show feedback when selectedIndex is provided", () => {
    const handleColorSelect = vi.fn();
    render(
      <GameBoard
        gameState={mockGameState}
        onColorSelect={handleColorSelect}
        selectedIndex={1}
        showFeedback={true}
      />,
    );

    const panels = screen.getAllByRole("button");
    expect(panels[0]).toHaveClass("correct"); // Target panel
    expect(panels[1]).toHaveClass("wrong"); // Selected wrong panel
  });
});
