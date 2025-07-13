import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createRGB } from '../../core/color/color';
import { createGame } from '../../core/game/game';
import type { Game, GameRound } from '../../core/game/types';
import { isOk } from '../../core/types';
import { GameStateManager } from './GameStateManager';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'game.gameOver': 'Game Over!',
        'game.finalScore': 'Final Score',
        'game.playAgain': 'Play Again',
        'game.findColor': 'Find this color:',
        'game.target': 'Target',
        'game.correct': 'Correct!',
        'game.wrong': 'Wrong!',
      };
      return translations[key] || key;
    },
  }),
}));

describe('GameStateManager', () => {
  const mockOnStartNewRound = vi.fn();
  const mockOnResetGame = vi.fn();
  const mockOnGuess = vi.fn();

  const defaultGame: Game = createGame();

  const red = createRGB(255, 0, 0);
  const green = createRGB(0, 255, 0);
  const blue = createRGB(0, 0, 255);
  const yellow = createRGB(255, 255, 0);

  if (!isOk(red) || !isOk(green) || !isOk(blue) || !isOk(yellow)) {
    throw new Error('Failed to create test colors');
  }

  const mockRound: GameRound = {
    level: 1,
    target: { id: 'target' as any, color: red.value },
    choices: [
      { id: 'panel1' as any, color: red.value },
      { id: 'panel2' as any, color: green.value },
      { id: 'panel3' as any, color: blue.value },
      { id: 'panel4' as any, color: yellow.value },
    ],
    answered: false,
    correct: false,
  };

  it('shows start screen when there is no current round and game is not over', () => {
    render(
      <GameStateManager
        game={defaultGame}
        isGameOver={false}
        currentRound={null}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    expect(screen.getByText('Test your color recognition skills!')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('shows game over screen when game is over', () => {
    const gameOverGame = { ...defaultGame, score: 150 };
    render(
      <GameStateManager
        game={gameOverGame}
        isGameOver={true}
        currentRound={null}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('Final Score: 150')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  it('shows game board when there is a current round', () => {
    render(
      <GameStateManager
        game={defaultGame}
        isGameOver={false}
        currentRound={mockRound}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    expect(screen.getByText('Find this color:')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('shows next round button when round is answered', () => {
    const answeredRound = { ...mockRound, answered: true };
    render(
      <GameStateManager
        game={defaultGame}
        isGameOver={false}
        currentRound={answeredRound}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    expect(screen.getByText('Next Round')).toBeInTheDocument();
  });

  it('calls onStartNewRound when start game button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameStateManager
        game={defaultGame}
        isGameOver={false}
        currentRound={null}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    await user.click(screen.getByText('Start Game'));
    expect(mockOnStartNewRound).toHaveBeenCalled();
  });

  it('calls onResetGame when play again button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameStateManager
        game={defaultGame}
        isGameOver={true}
        currentRound={null}
        onStartNewRound={mockOnStartNewRound}
        onResetGame={mockOnResetGame}
        onGuess={mockOnGuess}
      />
    );

    await user.click(screen.getByText('Play Again'));
    expect(mockOnResetGame).toHaveBeenCalled();
  });
});