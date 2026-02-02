'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { AssignorForm } from '@/components/forms';
import { AssignorFormData } from '@/lib/schemas';
import { assignorsService } from '@/lib/api';

export default function NewAssignorPage() {
  const router = useRouter();

  const handleSubmit = async (data: AssignorFormData) => {
    await assignorsService.create({
      id: data.id,
      document: data.document,
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
  };

  const handleSuccess = (data: AssignorFormData) => {
    setTimeout(() => {
      router.push(`/assignors/${data.id}`);
    }, 2000);
  };

  return (
    <MainLayout title="Aprove-me">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Cedente</h1>
          <p className="mt-2 text-gray-600">
            Preencha os dados abaixo para cadastrar um novo cedente
          </p>
        </div>

        <AssignorForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
      </div>
    </MainLayout>
  );
}
