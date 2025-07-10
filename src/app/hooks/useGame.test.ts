import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGame } from './useGame';

describe('useGame', () => {
  it('should initialize with no active round', () => {
    const { result } = renderHook(() => useGame());
    
    expect(result.current.game.score).toBe(0);
    expect(result.current.game.level).toBe(1);
    expect(result.current.game.currentRound).toBeNull();
    expect(result.current.isGameOver).toBe(false);
  });

  it('should start new round', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.startNewRound();
    });
    
    expect(result.current.game.currentRound).not.toBeNull();
    expect(result.current.game.currentRound?.choices.length).toBe(3); // Level 1 = 3 choices
  });

  it('should handle correct guess', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.startNewRound();
    });
    
    const targetId = result.current.game.currentRound!.target.id;
    
    act(() => {
      result.current.makeGuess(targetId);
    });
    
    expect(result.current.game.score).toBe(1);
    expect(result.current.game.currentRound?.correct).toBe(true);
  });

  it('should handle incorrect guess', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.startNewRound();
    });
    
    const wrongPanel = result.current.game.currentRound!.choices.find(
      p => p.id !== result.current.game.currentRound!.target.id
    );
    
    act(() => {
      result.current.makeGuess(wrongPanel!.id);
    });
    
    expect(result.current.game.score).toBe(0);
    expect(result.current.game.currentRound?.correct).toBe(false);
  });

  it('should increase level after streak', () => {
    const { result } = renderHook(() => useGame());
    
    // Complete 3 rounds correctly
    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.startNewRound();
      });
      
      const targetId = result.current.game.currentRound!.target.id;
      
      act(() => {
        result.current.makeGuess(targetId);
      });
    }
    
    // Start new round after streak
    act(() => {
      result.current.startNewRound();
    });
    
    expect(result.current.game.level).toBe(2);
  });

  it('should provide error message on invalid action', () => {
    const { result } = renderHook(() => useGame());
    
    // Try to make guess without active round
    act(() => {
      result.current.makeGuess('invalid-id' as any);
    });
    
    expect(result.current.error).toBe('No active round');
  });
});