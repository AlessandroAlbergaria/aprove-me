import { apiClient } from './client';
import type {
  Payable,
  CreatePayableDto,
  UpdatePayableDto,
} from '@/types';

export const payablesService = {
  async create(data: CreatePayableDto): Promise<Payable> {
    const response = await apiClient.post<Payable>('/integrations/payable', {
      id: data.id,
      value: data.value,
      emissionDate: data.emissionDate,
      assignor: data.assignor,
    });
    return response.data;
  },

  async getById(id: string): Promise<Payable> {
    const response = await apiClient.get<Payable>(`/payable/${id}`);
    return response.data;
  },

  async getAll(): Promise<Payable[]> {
    const response = await apiClient.get<Payable[]>('/payable');
    return response.data;
  },

  async update(id: string, data: UpdatePayableDto): Promise<Payable> {
    const response = await apiClient.patch<Payable>(`/payable/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/payable/${id}`);
  },

  async createBatch(payables: CreatePayableDto[]): Promise<void> {
    await apiClient.post('/integrations/payable/batch', { payables });
  },
};
