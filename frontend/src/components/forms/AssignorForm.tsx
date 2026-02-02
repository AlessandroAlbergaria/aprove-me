'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, Alert } from '@/components/ui';
import { assignorSchema, type AssignorFormData } from '@/lib/schemas';

export interface AssignorFormProps {
  onSubmit: (data: AssignorFormData) => Promise<void>;
  onSuccess?: (data: AssignorFormData) => void;
  initialData?: Partial<AssignorFormData>;
  submitLabel?: string;
}

export const AssignorForm: React.FC<AssignorFormProps> = ({
  onSubmit,
  onSuccess,
  initialData,
  submitLabel = 'Cadastrar Cedente',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssignorFormData>({
    resolver: zodResolver(assignorSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = async (data: AssignorFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      await onSubmit(data);
      setSuccess(true);
      reset();
      onSuccess?.(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao cadastrar cedente';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Cadastro de Cedente">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        {error && (
          <Alert variant="error" title="Erro" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            title="Sucesso!"
            onClose={() => setSuccess(false)}
          >
            Cedente cadastrado com sucesso!
          </Alert>
        )}

        <Input
          label="ID"
          type="text"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          error={errors.id?.message}
          helperText="UUID v4 válido"
          required
          {...register('id')}
        />

        <Input
          label="Documento"
          type="text"
          placeholder="12345678900"
          error={errors.document?.message}
          helperText="Apenas números, máximo 30 caracteres"
          required
          {...register('document')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="cedente@exemplo.com"
          error={errors.email?.message}
          helperText="Email válido, máximo 140 caracteres"
          required
          {...register('email')}
        />

        <Input
          label="Telefone"
          type="tel"
          placeholder="11999999999"
          error={errors.phone?.message}
          helperText="Máximo 20 caracteres"
          required
          {...register('phone')}
        />

        <Input
          label="Nome"
          type="text"
          placeholder="Nome do Cedente"
          error={errors.name?.message}
          helperText="Máximo 140 caracteres"
          required
          {...register('name')}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isLoading}
          >
            Limpar
          </Button>
        </div>
      </form>
    </Card>
  );
};
