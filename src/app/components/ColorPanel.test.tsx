import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPanel } from './ColorPanel';

describe('ColorPanel', () => {
  const mockPanel = {
    id: 'panel-1' as any,
    color: { r: 255, g: 0, b: 0 } as any,
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
    expect(panel).toHaveAttribute('aria-label', 'Color panel');
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