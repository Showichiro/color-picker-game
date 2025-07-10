import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameInstructions } from './GameInstructions';

describe('GameInstructions', () => {
  it('displays all game instructions', () => {
    render(<GameInstructions />);
    
    expect(screen.getByText('Click on the panel that matches the target color.')).toBeInTheDocument();
    expect(screen.getByText('Get 3 correct in a row to level up!')).toBeInTheDocument();
    expect(screen.getByText('You have 3 lives. Game ends when you run out of lives.')).toBeInTheDocument();
  });
});