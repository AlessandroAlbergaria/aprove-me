'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import type { Payable } from '@/types';

interface PayableListProps {
  payables: Payable[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function PayableList({
  payables,
  isLoading = false,
  onEdit,
  onDelete,
  onViewDetails,
}: PayableListProps) {
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

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (payables.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum recebível cadastrado</p>
          <Link href="/payables/new">
            <Button variant="primary">Cadastrar Primeiro Recebível</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cedente
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payables.map((payable) => (
                  <tr key={payable.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payable.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payable.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payable.emissionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payable.assignor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        {onViewDetails && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewDetails(payable.id)}
                          >
                            Ver
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(payable.id)}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(payable.id)}
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="md:hidden space-y-4">
        {payables.map((payable) => (
          <Card key={payable.id}>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm font-mono">{payable.id.substring(0, 8)}...</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(payable.value)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Data de Emissão</p>
                <p className="text-sm">{formatDate(payable.emissionDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cedente</p>
                <p className="text-sm">{payable.assignor}</p>
              </div>
              <div className="flex gap-2 pt-2">
                {onViewDetails && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onViewDetails(payable.id)}
                  >
                    Ver
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onEdit(payable.id)}
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => onDelete(payable.id)}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
