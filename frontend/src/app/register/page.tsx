'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, Alert } from '@/components/ui';
import { createUserSchema, type CreateUserFormData } from '@/lib/schemas';
import { authService } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await authService.register({
        login: data.login,
        password: data.password,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro ao cadastrar usuário. Tente novamente.';
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
            Criar Conta
          </h2>
          <p className="mt-2 text-gray-600">
            Preencha os dados para criar sua conta
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="error" title="Erro" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" title="Sucesso!">
                Conta criada com sucesso! Redirecionando para login...
              </Alert>
            )}

            <Input
              label="Login"
              type="text"
              placeholder="usuario123"
              error={errors.login?.message}
              helperText="3-50 caracteres, apenas letras, números, _ e -"
              required
              disabled={isLoading || success}
              {...register('login')}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="Mínimo 6 caracteres"
              required
              disabled={isLoading || success}
              {...register('password')}
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              helperText="Digite a senha novamente"
              required
              disabled={isLoading || success}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={success}
              fullWidth
            >
              Criar Conta
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
