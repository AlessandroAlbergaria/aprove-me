import { payablesService } from '../payables.service';
import { apiClient } from '../client';

jest.mock('../client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('payablesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payable', async () => {
      const mockPayable = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        value: 1000,
        emissionDate: '2024-01-15',
        assignor: '550e8400-e29b-41d4-a716-446655440001',
      };

      mockedApiClient.post.mockResolvedValue({ data: mockPayable });

      const result = await payablesService.create(mockPayable);

      expect(result).toEqual(mockPayable);
      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/integrations/payable',
        mockPayable
      );
    });
  });

  describe('getById', () => {
    it('should get a payable by id', async () => {
      const mockPayable = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        value: 1000,
        emissionDate: '2024-01-15',
        assignor: '550e8400-e29b-41d4-a716-446655440001',
      };

      mockedApiClient.get.mockResolvedValue({ data: mockPayable });

      const result = await payablesService.getById(mockPayable.id);

      expect(result).toEqual(mockPayable);
      expect(mockedApiClient.get).toHaveBeenCalledWith(`/payable/${mockPayable.id}`);
    });
  });

  describe('getAll', () => {
    it('should get all payables', async () => {
      const mockPayables = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          value: 1000,
          emissionDate: '2024-01-15',
          assignor: '550e8400-e29b-41d4-a716-446655440001',
        },
      ];

      mockedApiClient.get.mockResolvedValue({ data: mockPayables });

      const result = await payablesService.getAll();

      expect(result).toEqual(mockPayables);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/payable');
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = { value: 2000 };
      const mockPayable = {
        id,
        value: 2000,
        emissionDate: '2024-01-15',
        assignor: '550e8400-e29b-41d4-a716-446655440001',
      };

      mockedApiClient.patch.mockResolvedValue({ data: mockPayable });

      const result = await payablesService.update(id, updateData);

      expect(result).toEqual(mockPayable);
      expect(mockedApiClient.patch).toHaveBeenCalledWith(`/payable/${id}`, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a payable', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mockedApiClient.delete.mockResolvedValue({ data: undefined });

      await payablesService.delete(id);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/payable/${id}`);
    });
  });
});
