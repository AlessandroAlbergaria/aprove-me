'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import type { Assignor } from '@/types';

interface AssignorListProps {
  assignors: Assignor[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function AssignorList({
  assignors,
  isLoading = false,
  onEdit,
  onDelete,
  onViewDetails,
}: AssignorListProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (assignors.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum cedente cadastrado</p>
          <Link href="/assignors/new">
            <Button variant="primary">Cadastrar Primeiro Cedente</Button>
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
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignors.map((assignor) => (
                  <tr key={assignor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignor.document}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignor.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        {onViewDetails && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewDetails(assignor.id)}
                          >
                            Ver
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(assignor.id)}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(assignor.id)}
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
        {assignors.map((assignor) => (
          <Card key={assignor.id}>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-lg font-bold text-gray-900">{assignor.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Documento</p>
                <p className="text-sm">{assignor.document}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{assignor.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="text-sm">{assignor.phone}</p>
              </div>
              <div className="flex gap-2 pt-2">
                {onViewDetails && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onViewDetails(assignor.id)}
                  >
                    Ver
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onEdit(assignor.id)}
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => onDelete(assignor.id)}
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
