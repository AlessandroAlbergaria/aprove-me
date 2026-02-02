'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { PayableList } from '@/components/payables';
import { PrivateRoute } from '@/components/auth';
import { Button, Alert } from '@/components/ui';
import { payablesService } from '@/lib/api';
import type { Payable } from '@/types';

export default function PayablesPage() {
  const router = useRouter();
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayables();
  }, [currentPage]);

  const fetchPayables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payablesService.getAll();
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);
      
      setPayables(paginatedData);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar recebíveis',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/payables/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/payables/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este recebível?')) {
      return;
    }

    try {
      await payablesService.delete(id);
      fetchPayables();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao excluir recebível',
      );
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <PrivateRoute>
      <MainLayout title="Aprove-me">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recebíveis</h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os recebíveis cadastrados
              </p>
            </div>
            <Link href="/payables/new">
              <Button variant="primary">Novo Recebível</Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6">
              <Alert variant="error" title="Erro" onClose={() => setError(null)}>
                {error}
              </Alert>
            </div>
          )}

          <PayableList
            payables={payables}
            isLoading={loading}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!loading && payables.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </PrivateRoute>
  );
}
