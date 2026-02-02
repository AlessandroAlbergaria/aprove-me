import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert', () => {
  it('should render alert with children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('should render info variant by default', () => {
    const { container } = render(<Alert>Info</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-blue-50');
  });

  it('should render success variant', () => {
    const { container } = render(<Alert variant="success">Success</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-green-50');
  });

  it('should render warning variant', () => {
    const { container } = render(<Alert variant="warning">Warning</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-yellow-50');
  });

  it('should render error variant', () => {
    const { container } = render(<Alert variant="error">Error</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-red-50');
  });

  it('should render alert with title', () => {
    render(<Alert title="Alert Title">Message</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Alert onClose={onClose}>Closable alert</Alert>);
    
    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when onClose is not provided', () => {
    render(<Alert>No close button</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
