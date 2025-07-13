import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameHeader } from './GameHeader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'game.title': 'Color Picker Game',
        'game.score': 'Score',
        'game.level': 'Level',
        'game.lives': 'Lives',
        'game.streak': 'Streak',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../../i18n/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    languages: ['en', 'ja'],
  }),
}));

describe('GameHeader', () => {
  it('displays the game title', () => {
    render(<GameHeader score={0} level={1} lives={3} streak={0} />);
    
    expect(screen.getByText('Color Picker Game')).toBeInTheDocument();
  });

  it('displays the score', () => {
    render(<GameHeader score={100} level={1} lives={3} streak={0} />);
    
    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays the level', () => {
    render(<GameHeader score={0} level={5} lives={3} streak={0} />);
    
    expect(screen.getByText('Level:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays the lives', () => {
    render(<GameHeader score={0} level={1} lives={2} streak={0} />);
    
    expect(screen.getByText('Lives:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays the streak', () => {
    render(<GameHeader score={0} level={1} lives={3} streak={5} />);
    
    expect(screen.getByText('Streak:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});