'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Card, Button, Alert } from '@/components/ui';
import { payablesService } from '@/lib/api';
import type { Payable } from '@/types';

interface PayableDetailsPageProps {
  params: {
    id: string;
  };
}

export default function PayableDetailsPage({ params }: PayableDetailsPageProps) {
  const [payable, setPayable] = useState<Payable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayable = async () => {
      try {
        setLoading(true);
        const data = await payablesService.getById(params.id);
        setPayable(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar recebível');
      } finally {
        setLoading(false);
      }
    };

    fetchPayable();
  }, [params.id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <MainLayout title="Aprove-me">
        <div className="max-w-2xl mx-auto">
          <Card title="Carregando...">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !payable) {
    return (
      <MainLayout title="Aprove-me">
        <div className="max-w-2xl mx-auto">
          <Alert variant="error" title="Erro">
            {error || 'Recebível não encontrado'}
          </Alert>
          <div className="mt-4">
            <Link href="/payables/new">
              <Button variant="primary">Voltar</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Aprove-me">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Detalhes do Recebível
          </h1>
          <p className="mt-2 text-gray-600">
            Informações completas do recebível cadastrado
          </p>
        </div>

        <Card
          title="Recebível Cadastrado"
          subtitle="Dados salvos com sucesso"
          footer={
            <div className="flex gap-4">
              <Link href="/payables/new" className="flex-1">
                <Button variant="primary" fullWidth>
                  Cadastrar Novo
                </Button>
              </Link>
              <Link href="/payables" className="flex-1">
                <Button variant="secondary" fullWidth>
                  Ver Todos
                </Button>
              </Link>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ID
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                  {payable.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Valor
                </label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  {formatCurrency(payable.value)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Data de Emissão
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(payable.emissionDate)}
                </p>
              </div>

              {payable.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Data de Cadastro
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(payable.createdAt)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Cedente (ID)
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                {payable.assignor}
              </p>
            </div>
          </div>
        </Card>

      </div>
    </MainLayout>
  );
}
