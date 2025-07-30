import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Snackbar from '../Snackbar';

describe('Snackbar Component', () => {
  const defaultProps = {
    open: true,
    message: 'Test message',
    severity: 'success' as const,
    onClose: jest.fn(),
  };

  it('renders with correct message', () => {
    render(<Snackbar {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies correct severity class', () => {
    render(<Snackbar {...defaultProps} severity="error" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardError');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Snackbar {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when open is false', () => {
    render(<Snackbar {...defaultProps} open={false} />);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('uses custom autoHideDuration', () => {
    render(<Snackbar {...defaultProps} autoHideDuration={3000} />);
    const snackbar = screen.getByRole('presentation');
    expect(snackbar).toBeInTheDocument();
  });
}); 