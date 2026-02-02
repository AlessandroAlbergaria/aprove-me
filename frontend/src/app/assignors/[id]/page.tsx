'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Card, Button, Alert } from '@/components/ui';
import { assignorsService } from '@/lib/api';
import type { Assignor } from '@/types';

interface AssignorDetailsPageProps {
  params: {
    id: string;
  };
}

export default function AssignorDetailsPage({
  params,
}: AssignorDetailsPageProps) {
  const [assignor, setAssignor] = useState<Assignor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignor = async () => {
      try {
        setLoading(true);
        const data = await assignorsService.getById(params.id);
        setAssignor(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar cedente');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignor();
  }, [params.id]);

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

  if (error || !assignor) {
    return (
      <MainLayout title="Aprove-me">
        <div className="max-w-2xl mx-auto">
          <Alert variant="error" title="Erro">
            {error || 'Cedente não encontrado'}
          </Alert>
          <div className="mt-4">
            <Link href="/assignors/new">
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
            Detalhes do Cedente
          </h1>
          <p className="mt-2 text-gray-600">
            Informações completas do cedente cadastrado
          </p>
        </div>

        <Card
          title="Cedente Cadastrado"
          subtitle="Dados salvos com sucesso"
          footer={
            <div className="flex gap-4">
              <Link href="/assignors/new" className="flex-1">
                <Button variant="primary" fullWidth>
                  Cadastrar Novo
                </Button>
              </Link>
              <Link href="/assignors" className="flex-1">
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
                  {assignor.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Documento
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono">
                  {assignor.document}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{assignor.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Telefone
                </label>
                <p className="mt-1 text-sm text-gray-900">{assignor.phone}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Nome
              </label>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {assignor.name}
              </p>
            </div>

            {assignor.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Data de Cadastro
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(assignor.createdAt)}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
