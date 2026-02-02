import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';
import { createMockPayable } from '../../test/factories';

describe('PayableService', () => {
  let service: PayableService;
  let repository: PayableRepository;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: PayableRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    repository = module.get<PayableRepository>(PayableRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payable successfully', async () => {
      const mockPayable = createMockPayable();
      const createDto = {
        id: mockPayable.id,
        value: mockPayable.value,
        emissionDate: mockPayable.emissionDate.toISOString(),
        assignor: mockPayable.assignorId,
      };

      mockRepository.create.mockResolvedValue(mockPayable);

      const result = await service.create(createDto);

      expect(result).toEqual(mockPayable);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a payable when found', async () => {
      const mockPayable = createMockPayable();
      mockRepository.findById.mockResolvedValue(mockPayable);

      const result = await service.findById(mockPayable.id);

      expect(result).toEqual(mockPayable);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockPayable.id);
    });

    it('should throw NotFoundException when payable not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById(nonExistentId)).rejects.toThrow(
        `Recebível com ID ${nonExistentId} não encontrado`,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of payables', async () => {
      const mockPayables = [createMockPayable(), createMockPayable()];
      mockRepository.findAll.mockResolvedValue(mockPayables);

      const result = await service.findAll();

      expect(result).toEqual(mockPayables);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no payables exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a payable successfully', async () => {
      const mockPayable = createMockPayable();
      const updateDto = { value: 2000 };
      const updatedPayable = { ...mockPayable, value: 2000 };

      mockRepository.findById.mockResolvedValue(mockPayable);
      mockRepository.update.mockResolvedValue(updatedPayable);

      const result = await service.update(mockPayable.id, updateDto);

      expect(result).toEqual(updatedPayable);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockPayable.id);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockPayable.id,
        updateDto,
      );
    });

    it('should throw NotFoundException when updating non-existent payable', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(nonExistentId, { value: 2000 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a payable successfully', async () => {
      const mockPayable = createMockPayable();
      mockRepository.findById.mockResolvedValue(mockPayable);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete(mockPayable.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockPayable.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockPayable.id);
    });

    it('should throw NotFoundException when deleting non-existent payable', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
