import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '../page';
import { authService } from '@/lib/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render login form', () => {
    render(<LoginPage />);

    expect(screen.getByText('Aprove-me')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByText('Faça login para acessar sua conta')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<LoginPage />);

    const loginInput = screen.getByPlaceholderText('usuario123');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    expect(loginInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('should render link to register page', () => {
    render(<LoginPage />);

    const registerLink = screen.getByText('Criar conta');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('should have autocomplete attributes', () => {
    render(<LoginPage />);

    const loginInput = screen.getByPlaceholderText('usuario123');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(loginInput).toHaveAttribute('autocomplete', 'username');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });
});
