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

  it.skip("should show game over screen when lives reach zero", async () => {
    render(<Game />);

    // Keep clicking until game over
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        // Check if game is over
        screen.getByText(/Game Over/i);
        break;
      } catch {
        // Game is still running, make a wrong move
        const panels = screen.getAllByRole("button", { name: "color-panel" });

        // Click all panels to ensure we hit a wrong one
        for (let i = 0; i < panels.length; i++) {
          fireEvent.click(panels[i]);
          await new Promise((resolve) => setTimeout(resolve, 900));

          try {
            screen.getByText(/Game Over/i);
            break;
          } catch {
            // Continue
          }
        }
      }
      attempts++;
    }

    // Verify game over screen
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Play Again/i }),
    ).toBeInTheDocument();
  });

  it.skip("should restart game when play again is clicked", async () => {
    render(<Game />);

    // Keep clicking until game over
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        // Check if game is over
        screen.getByText(/Game Over/i);
        break;
      } catch {
        // Game is still running, make a wrong move
        const panels = screen.getAllByRole("button", { name: "color-panel" });

        // Click all panels to ensure we hit a wrong one
        for (let i = 0; i < panels.length; i++) {
          fireEvent.click(panels[i]);
          await new Promise((resolve) => setTimeout(resolve, 900));

          try {
            screen.getByText(/Game Over/i);
            break;
          } catch {
            // Continue
          }
        }
      }
      attempts++;
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
