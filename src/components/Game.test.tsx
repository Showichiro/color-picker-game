import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Game } from "./Game";

describe("Game", () => {
  it("should start with the initial game state", () => {
    render(<Game />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle color selection correctly", async () => {
    render(<Game />);

    const panels = screen.getAllByRole("button", { name: "color-panel" });

    // Click on a panel (might be right or wrong)
    fireEvent.click(panels[0]);

    // Wait for state update after feedback
    await waitFor(
      () => {
        // Check that the game is still running
        expect(screen.getByText("Pick this color:")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("should show game over screen when lives reach zero", async () => {
    render(<Game />);

    // Simulate wrong answers to lose all lives
    for (let i = 0; i < 3; i++) {
      const panels = screen.getAllByRole("button", { name: "color-panel" });

      // Find a panel that's likely wrong (not the target)
      // Since we can't know which is correct, we'll just click and check lives
      fireEvent.click(panels[0]);

      // Wait for feedback to complete
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Check if game over screen appears
    await waitFor(
      () => {
        expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Play Again/i }),
    ).toBeInTheDocument();
  });

  it("should restart game when play again is clicked", async () => {
    render(<Game />);

    // Lose the game first
    for (let i = 0; i < 3; i++) {
      const panels = screen.getAllByRole("button", { name: "color-panel" });
      fireEvent.click(panels[0]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Wait for game over
    await waitFor(() => {
      expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    });

    // Click play again
    const playAgainButton = screen.getByRole("button", { name: /Play Again/i });
    fireEvent.click(playAgainButton);

    // Game should restart
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
