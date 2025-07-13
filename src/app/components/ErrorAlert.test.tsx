import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert', () => {
  it('displays error message when error is provided', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorAlert error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not render anything when error is null', () => {
    const { container } = render(<ErrorAlert error={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('has correct styling', () => {
    const errorMessage = 'Test error';
    render(<ErrorAlert error={errorMessage} />);
    
    const alertElement = screen.getByText(errorMessage);
    expect(alertElement).toHaveClass('bg-red-100', 'border', 'border-red-400', 'text-red-700');
  });
});