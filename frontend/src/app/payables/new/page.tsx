'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { PayableForm } from '@/components/forms';
import { PayableFormData } from '@/lib/schemas';
import { payablesService } from '@/lib/api';

export default function NewPayablePage() {
  const router = useRouter();

  const handleSubmit = async (data: PayableFormData) => {
    await payablesService.create({
      id: data.id,
      value: data.value,
      emissionDate: data.emissionDate,
      assignor: data.assignor,
    });
  };

  const handleSuccess = (data: PayableFormData) => {
    setTimeout(() => {
      router.push(`/payables/${data.id}`);
    }, 2000);
  };

  return (
    <MainLayout title="Aprove-me">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Recebível</h1>
          <p className="mt-2 text-gray-600">
            Preencha os dados abaixo para cadastrar um novo recebível
          </p>
        </div>

        <PayableForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
      </div>
    </MainLayout>
  );
}
