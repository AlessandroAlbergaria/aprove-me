import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { PrivateRoute } from '../PrivateRoute';
import { useAuth } from '@/contexts';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts', () => ({
  useAuth: jest.fn(),
}));

describe('PrivateRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render children when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
