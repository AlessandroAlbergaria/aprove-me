import { apiClient } from './client';
import type {
  Assignor,
  CreateAssignorDto,
  UpdateAssignorDto,
} from '@/types';

export const assignorsService = {
  async create(data: CreateAssignorDto): Promise<Assignor> {
    const response = await apiClient.post<Assignor>('/integrations/assignor', {
      id: data.id,
      document: data.document,
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
    return response.data;
  },

  async getById(id: string): Promise<Assignor> {
    const response = await apiClient.get<Assignor>(`/assignor/${id}`);
    return response.data;
  },

  async getAll(): Promise<Assignor[]> {
    const response = await apiClient.get<Assignor[]>('/assignor');
    return response.data;
  },

  async update(id: string, data: UpdateAssignorDto): Promise<Assignor> {
    const response = await apiClient.patch<Assignor>(`/assignor/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assignor/${id}`);
  },
};
