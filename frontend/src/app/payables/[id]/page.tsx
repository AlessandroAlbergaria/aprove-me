'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';

interface PayableDetailsPageProps {
  params: {
    id: string;
  };
}

export default function PayableDetailsPage({ params }: PayableDetailsPageProps) {
  const mockPayable = {
    id: params.id,
    value: 1500.0,
    emissionDate: '2024-01-15',
    assignor: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: new Date().toISOString(),
  };

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
                  {mockPayable.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Valor
                </label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  {formatCurrency(mockPayable.value)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Data de Emissão
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(mockPayable.emissionDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Data de Cadastro
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(mockPayable.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Cedente (ID)
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                {mockPayable.assignor}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informação
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                Este é um exemplo de exibição. Na próxima fase, os dados serão
                carregados da API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
