import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameInstructions } from './GameInstructions';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'game.instructions.clickPanel': 'Click on the panel that matches the target color.',
        'game.instructions.levelUpCondition': 'Get 3 correct in a row to level up!',
        'game.instructions.livesExplanation': 'You have 3 lives. Game ends when you run out of lives.',
      };
      return translations[key] || key;
    },
  }),
}));

describe('GameInstructions', () => {
  it('displays all game instructions', () => {
    render(<GameInstructions />);
    
    expect(screen.getByText('Click on the panel that matches the target color.')).toBeInTheDocument();
    expect(screen.getByText('Get 3 correct in a row to level up!')).toBeInTheDocument();
    expect(screen.getByText('You have 3 lives. Game ends when you run out of lives.')).toBeInTheDocument();
  });
});