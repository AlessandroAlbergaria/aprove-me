'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Card, Alert } from '@/components/ui';
import { payableSchema, type PayableFormData } from '@/lib/schemas';
import { assignorsService } from '@/lib/api';
import type { Assignor } from '@/types';

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
  const [assignors, setAssignors] = useState<Assignor[]>([]);
  const [loadingAssignors, setLoadingAssignors] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PayableFormData>({
    resolver: zodResolver(payableSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchAssignors = async () => {
      try {
        setLoadingAssignors(true);
        const data = await assignorsService.getAll();
        setAssignors(data);
      } catch (err) {
        console.error('Erro ao carregar cedentes:', err);
      } finally {
        setLoadingAssignors(false);
      }
    };

    fetchAssignors();
  }, []);

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

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cedente
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              errors.assignor
                ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            {...register('assignor')}
            disabled={loadingAssignors}
          >
            <option value="">
              {loadingAssignors ? 'Carregando...' : 'Selecione um cedente'}
            </option>
            {assignors.map((assignor) => (
              <option key={assignor.id} value={assignor.id}>
                {assignor.name} - {assignor.document}
              </option>
            ))}
          </select>
          {errors.assignor && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.assignor.message}
            </p>
          )}
          {!loadingAssignors && assignors.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Nenhum cedente cadastrado.{' '}
              <a href="/assignors/new" className="text-blue-600 hover:underline">
                Cadastre um cedente primeiro
              </a>
            </p>
          )}
          {!errors.assignor && assignors.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Selecione o cedente responsável
            </p>
          )}
        </div>

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
