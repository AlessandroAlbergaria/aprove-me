'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { AssignorList } from '@/components/assignors';
import { PrivateRoute } from '@/components/auth';
import { Button, Alert } from '@/components/ui';
import { assignorsService } from '@/lib/api';
import type { Assignor } from '@/types';

export default function AssignorsPage() {
  const router = useRouter();
  const [assignors, setAssignors] = useState<Assignor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssignors();
  }, [currentPage]);

  const fetchAssignors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignorsService.getAll();
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);
      
      setAssignors(paginatedData);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar cedentes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/assignors/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/assignors/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cedente?')) {
      return;
    }

    try {
      await assignorsService.delete(id);
      fetchAssignors();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir cedente');
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
              <h1 className="text-3xl font-bold text-gray-900">Cedentes</h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os cedentes cadastrados
              </p>
            </div>
            <Link href="/assignors/new">
              <Button variant="primary">Novo Cedente</Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6">
              <Alert variant="error" title="Erro" onClose={() => setError(null)}>
                {error}
              </Alert>
            </div>
          )}

          <AssignorList
            assignors={assignors}
            isLoading={loading}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!loading && assignors.length > 0 && totalPages > 1 && (
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
