'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, Alert } from '@/components/ui';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { useAuth } from '@/contexts';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Aprove-me</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="error" title="Erro" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Input
              label="Login"
              type="text"
              placeholder="usuario123"
              error={errors.login?.message}
              required
              disabled={isLoading}
              autoComplete="username"
              {...register('login')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              disabled={isLoading}
              autoComplete="current-password"
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Entrar
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
