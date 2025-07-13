import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ColorPanel as ColorPanelType } from '../../core/game/types';
import type { ColorPanelId, RGB } from '../../core/types';
import { ColorPanel } from './ColorPanel';

describe('ColorPanel', () => {
  const mockPanel: ColorPanelType = {
    id: 'panel-1' as ColorPanelId,
    color: { r: 255, g: 0, b: 0 } as RGB,
  };

  it('should render color panel with correct background color', () => {
    render(<ColorPanel panel={mockPanel} onClick={() => {}} />);
    
    const panel = screen.getByRole('button');
    expect(panel).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ColorPanel panel={mockPanel} onClick={handleClick} />);
    
    const panel = screen.getByRole('button');
    fireEvent.click(panel);
    
    expect(handleClick).toHaveBeenCalledWith(mockPanel.id);
  });

  it('should have accessible label', () => {
    render(<ColorPanel panel={mockPanel} onClick={() => {}} />);
    
    const panel = screen.getByRole('button');
    expect(panel).toHaveAttribute('aria-label', 'Color choice panel');
  });
  
  it('should have target accessible label when isTarget is true', () => {
    render(<ColorPanel panel={mockPanel} onClick={() => {}} isTarget />);
    
    const panel = screen.getByRole('button');
    expect(panel).toHaveAttribute('aria-label', 'Target color panel');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ColorPanel panel={mockPanel} onClick={() => {}} disabled />);
    
    const panel = screen.getByRole('button');
    expect(panel).toBeDisabled();
  });

  it('should show target indicator when isTarget is true', () => {
    render(<ColorPanel panel={mockPanel} onClick={() => {}} isTarget />);
    
    expect(screen.getByText('Target')).toBeInTheDocument();
  });
});