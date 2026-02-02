import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { AssignorRepository } from './assignor.repository';
import { createMockAssignor } from '../../test/factories';

describe('AssignorService', () => {
  let service: AssignorService;
  let repository: AssignorRepository;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByDocument: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        {
          provide: AssignorRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    repository = module.get<AssignorRepository>(AssignorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an assignor successfully', async () => {
      const mockAssignor = createMockAssignor();
      const createDto = {
        id: mockAssignor.id,
        document: mockAssignor.document,
        email: mockAssignor.email,
        phone: mockAssignor.phone,
        name: mockAssignor.name,
      };

      mockRepository.findByDocument.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockAssignor);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAssignor);
      expect(mockRepository.findByDocument).toHaveBeenCalledWith(
        createDto.document,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException when document already exists', async () => {
      const mockAssignor = createMockAssignor();
      const createDto = {
        id: 'new-id',
        document: mockAssignor.document,
        email: 'new@example.com',
        phone: '11888888888',
        name: 'New Assignor',
      };

      mockRepository.findByDocument.mockResolvedValue(mockAssignor);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        `Cedente com documento ${createDto.document} já existe`,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an assignor when found', async () => {
      const mockAssignor = createMockAssignor();
      mockRepository.findById.mockResolvedValue(mockAssignor);

      const result = await service.findById(mockAssignor.id);

      expect(result).toEqual(mockAssignor);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockAssignor.id);
    });

    it('should throw NotFoundException when assignor not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById(nonExistentId)).rejects.toThrow(
        `Cedente com ID ${nonExistentId} não encontrado`,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of assignors', async () => {
      const mockAssignors = [createMockAssignor(), createMockAssignor()];
      mockRepository.findAll.mockResolvedValue(mockAssignors);

      const result = await service.findAll();

      expect(result).toEqual(mockAssignors);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no assignors exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an assignor successfully', async () => {
      const mockAssignor = createMockAssignor();
      const updateDto = { name: 'Updated Name' };
      const updatedAssignor = { ...mockAssignor, name: 'Updated Name' };

      mockRepository.findById.mockResolvedValue(mockAssignor);
      mockRepository.update.mockResolvedValue(updatedAssignor);

      const result = await service.update(mockAssignor.id, updateDto);

      expect(result).toEqual(updatedAssignor);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockAssignor.id);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockAssignor.id,
        updateDto,
      );
    });

    it('should throw NotFoundException when updating non-existent assignor', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(nonExistentId, { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when updating to existing document', async () => {
      const mockAssignor1 = createMockAssignor({ id: 'id-1' });
      const mockAssignor2 = createMockAssignor({
        id: 'id-2',
        document: '98765432100',
      });
      const updateDto = { document: mockAssignor2.document };

      mockRepository.findById.mockResolvedValue(mockAssignor1);
      mockRepository.findByDocument.mockResolvedValue(mockAssignor2);

      await expect(
        service.update(mockAssignor1.id, updateDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.update(mockAssignor1.id, updateDto),
      ).rejects.toThrow(
        `Cedente com documento ${updateDto.document} já existe`,
      );
    });

    it('should allow updating same assignor with same document', async () => {
      const mockAssignor = createMockAssignor();
      const updateDto = { document: mockAssignor.document, name: 'New Name' };
      const updatedAssignor = { ...mockAssignor, name: 'New Name' };

      mockRepository.findById.mockResolvedValue(mockAssignor);
      mockRepository.findByDocument.mockResolvedValue(mockAssignor);
      mockRepository.update.mockResolvedValue(updatedAssignor);

      const result = await service.update(mockAssignor.id, updateDto);

      expect(result).toEqual(updatedAssignor);
    });
  });

  describe('delete', () => {
    it('should delete an assignor successfully', async () => {
      const mockAssignor = createMockAssignor();
      mockRepository.findById.mockResolvedValue(mockAssignor);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete(mockAssignor.id);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockAssignor.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockAssignor.id);
    });

    it('should throw NotFoundException when deleting non-existent assignor', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
