import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';
import { authService } from '@/lib/api';
import { AuthProvider } from '@/contexts';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('Authentication Flow Integration', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should complete login flow successfully', async () => {
    const user = userEvent.setup();
    
    (authService.login as jest.Mock).mockResolvedValue({
      access_token: 'mock-token',
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const loginInput = screen.getByPlaceholderText('usuario123');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    await user.type(loginInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        login: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup();
    
    (authService.login as jest.Mock).mockRejectedValue({
      message: 'Credenciais inválidas',
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const loginInput = screen.getByPlaceholderText('usuario123');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    await user.type(loginInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
