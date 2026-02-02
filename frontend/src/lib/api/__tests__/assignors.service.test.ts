import { assignorsService } from '../assignors.service';
import { apiClient } from '../client';
import type { Assignor, CreateAssignorDto } from '@/types';

jest.mock('../client');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('assignorsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAssignor: Assignor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    document: '12345678901',
    email: 'test@example.com',
    phone: '11999999999',
    name: 'Test Assignor',
  };

  describe('create', () => {
    it('should create a new assignor', async () => {
      const createDto: CreateAssignorDto = {
        id: mockAssignor.id,
        document: mockAssignor.document,
        email: mockAssignor.email,
        phone: mockAssignor.phone,
        name: mockAssignor.name,
      };

      mockApiClient.post.mockResolvedValue({ data: mockAssignor });

      const result = await assignorsService.create(createDto);

      expect(mockApiClient.post).toHaveBeenCalledWith('/integrations/assignor', createDto);
      expect(result).toEqual(mockAssignor);
    });
  });

  describe('getById', () => {
    it('should get assignor by id', async () => {
      mockApiClient.get.mockResolvedValue({ data: mockAssignor });

      const result = await assignorsService.getById(mockAssignor.id);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/assignor/${mockAssignor.id}`);
      expect(result).toEqual(mockAssignor);
    });
  });

  describe('getAll', () => {
    it('should get all assignors', async () => {
      const mockAssignors = [mockAssignor];
      mockApiClient.get.mockResolvedValue({ data: mockAssignors });

      const result = await assignorsService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/assignor');
      expect(result).toEqual(mockAssignors);
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedAssignor = { ...mockAssignor, ...updateDto };

      mockApiClient.patch.mockResolvedValue({ data: updatedAssignor });

      const result = await assignorsService.update(mockAssignor.id, updateDto);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/assignor/${mockAssignor.id}`,
        updateDto
      );
      expect(result).toEqual(updatedAssignor);
    });
  });

  describe('delete', () => {
    it('should delete an assignor', async () => {
      mockApiClient.delete.mockResolvedValue({ data: undefined });

      await assignorsService.delete(mockAssignor.id);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/assignor/${mockAssignor.id}`);
    });
  });
});
