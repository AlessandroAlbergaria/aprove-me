'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, Alert } from '@/components/ui';
import { payableSchema, type PayableFormData } from '@/lib/schemas';

export interface PayableFormProps {
  onSubmit: (data: PayableFormData) => Promise<void>;
  onSuccess?: (data: PayableFormData) => void;
  initialData?: Partial<PayableFormData>;
  submitLabel?: string;
}

export const PayableForm: React.FC<PayableFormProps> = ({
  onSubmit,
  onSuccess,
  initialData,
  submitLabel = 'Cadastrar Recebível',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PayableFormData>({
    resolver: zodResolver(payableSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = async (data: PayableFormData) => {
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
        err instanceof Error ? err.message : 'Erro ao cadastrar recebível';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Cadastro de Recebível">
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
            Recebível cadastrado com sucesso!
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
          label="Valor"
          type="number"
          step="0.01"
          placeholder="1000.00"
          error={errors.value?.message}
          helperText="Valor em reais (R$)"
          required
          {...register('value', { valueAsNumber: true })}
        />

        <Input
          label="Data de Emissão"
          type="date"
          error={errors.emissionDate?.message}
          helperText="Data de emissão do recebível"
          required
          {...register('emissionDate')}
        />

        <Input
          label="Cedente (ID)"
          type="text"
          placeholder="550e8400-e29b-41d4-a716-446655440001"
          error={errors.assignor?.message}
          helperText="UUID v4 do cedente"
          required
          {...register('assignor')}
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
