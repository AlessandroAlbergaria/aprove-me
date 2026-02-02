'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '@/lib/api';
import type { LoginCredentials } from '@/types';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_DAYS = 7;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!Cookies.get(TOKEN_KEY);
    }
    return false;
  });
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.access_token) {
        Cookies.set(TOKEN_KEY, response.access_token, {
          expires: TOKEN_EXPIRY_DAYS,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        setIsAuthenticated(true);
        router.push('/payables');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}
