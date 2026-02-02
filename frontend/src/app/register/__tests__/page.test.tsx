import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '../page';
import { authService } from '@/lib/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  authService: {
    register: jest.fn(),
  },
}));

describe('RegisterPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render register form', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Aprove-me')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
    expect(screen.getByText('Preencha os dados para criar sua conta')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<RegisterPage />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Criar Conta/i })).toBeInTheDocument();
  });

  it('should render link to login page', () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText('Fazer login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should show helper texts', () => {
    render(<RegisterPage />);

    expect(screen.getByText(/3-50 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/Digite a senha novamente/i)).toBeInTheDocument();
  });

  it('should show success message on successful registration', async () => {
    (authService.register as jest.Mock).mockResolvedValueOnce({});

    render(<RegisterPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Conta criada com sucesso/i)).not.toBeInTheDocument();
    });
  });
});
