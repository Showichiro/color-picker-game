import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GameRound } from '../../core/game/types';
import { GameBoard } from './GameBoard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'game.findColor': 'Find this color:',
        'game.target': 'Target',
        'game.correct': 'Correct!',
        'game.wrong': 'Wrong!',
      };
      return translations[key] || key;
    },
  }),
}));

describe('GameBoard', () => {
  const mockRound: GameRound = {
    level: 1,
    target: {
      id: 'panel-1' as any,
      color: { r: 255, g: 0, b: 0 } as any,
    },
    choices: [
      { id: 'panel-1' as any, color: { r: 255, g: 0, b: 0 } as any },
      { id: 'panel-2' as any, color: { r: 0, g: 255, b: 0 } as any },
      { id: 'panel-3' as any, color: { r: 0, g: 0, b: 255 } as any },
    ],
    answered: false,
    correct: false,
  };

  it('should display target color panel', () => {
    render(<GameBoard round={mockRound} onGuess={() => {}} />);
    
    expect(screen.getByText('Find this color:')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('should display all choice panels', () => {
    render(<GameBoard round={mockRound} onGuess={() => {}} />);
    
    const buttons = screen.getAllByRole('button');
    // 1 target panel + 3 choice panels
    expect(buttons).toHaveLength(4);
  });

  it('should call onGuess when a choice is clicked', () => {
    const handleGuess = vi.fn();
    render(<GameBoard round={mockRound} onGuess={handleGuess} />);
    
    const choiceButtons = screen.getAllByRole('button').slice(1); // Skip target panel
    fireEvent.click(choiceButtons[0]);
    
    expect(handleGuess).toHaveBeenCalledWith('panel-1');
  });

  it('should disable panels after answer', () => {
    const answeredRound = { ...mockRound, answered: true };
    render(<GameBoard round={answeredRound} onGuess={() => {}} />);
    
    const choiceButtons = screen.getAllByRole('button').slice(1);
    choiceButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should show result after answer', () => {
    const correctRound = { ...mockRound, answered: true, correct: true };
    render(<GameBoard round={correctRound} onGuess={() => {}} />);
    
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('should show incorrect result', () => {
    const incorrectRound = { ...mockRound, answered: true, correct: false };
    render(<GameBoard round={incorrectRound} onGuess={() => {}} />);
    
    expect(screen.getByText('Wrong!')).toBeInTheDocument();
  });

  describe('responsive design', () => {
    it('should apply mobile styles on small screens', () => {
      window.innerWidth = 375;
      render(<GameBoard round={mockRound} onGuess={() => {}} />);
      
      const container = screen.getByTestId('game-board-container');
      expect(container).toHaveClass('flex-col');
    });

    it('should apply desktop styles on large screens', () => {
      window.innerWidth = 1024;
      render(<GameBoard round={mockRound} onGuess={() => {}} />);
      
      const container = screen.getByTestId('game-board-container');
      expect(container).toHaveClass('md:flex-row');
    });

    it('should adjust grid layout for choices on mobile', () => {
      window.innerWidth = 375;
      const mobileRound = {
        ...mockRound,
        choices: Array(9).fill(null).map((_, i) => ({
          id: `panel-${i}` as any,
          color: { r: i * 20, g: i * 20, b: i * 20 } as any,
        })),
      };
      render(<GameBoard round={mobileRound} onGuess={() => {}} />);
      
      const choicesGrid = screen.getByTestId('choices-grid');
      expect(choicesGrid).toHaveClass('grid-cols-3');
    });
  });
});