import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '@/lib/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('AuthContext', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with unauthenticated state', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should initialize with authenticated state when token exists', () => {
    (Cookies.get as jest.Mock).mockReturnValue('mock-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login successfully', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    (authService.login as jest.Mock).mockResolvedValue({
      access_token: 'new-token',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ login: 'test', password: 'password' });
    });

    expect(Cookies.set).toHaveBeenCalledWith('auth_token', 'new-token', {
      expires: 7,
      secure: false,
      sameSite: 'strict',
    });
    expect(mockPush).toHaveBeenCalledWith('/payables');
  });

  it('should logout successfully', () => {
    (Cookies.get as jest.Mock).mockReturnValue('mock-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(Cookies.remove).toHaveBeenCalledWith('auth_token');
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(result.current.isAuthenticated).toBe(false);
  });
});
