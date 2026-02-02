import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';
import { QueueService } from '../../queue/queue.service';
import { createMockPayable, createMockAssignor } from '../../test/factories';

describe('IntegrationsController', () => {
  let controller: IntegrationsController;

  const mockIntegrationsService = {
    createPayableWithAssignor: jest.fn(),
    createBatchPayables: jest.fn(),
  };

  const mockPayableService = {
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAssignorService = {
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueueService = {
    getDLQMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationsController],
      providers: [
        {
          provide: IntegrationsService,
          useValue: mockIntegrationsService,
        },
        {
          provide: PayableService,
          useValue: mockPayableService,
        },
        {
          provide: AssignorService,
          useValue: mockAssignorService,
        },
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<IntegrationsController>(IntegrationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayable', () => {
    it('should create payable with assignor successfully', async () => {
      const mockPayable = createMockPayable();
      const mockAssignor = createMockAssignor();
      const createDto = {
        payable: {
          id: mockPayable.id,
          value: mockPayable.value,
          emissionDate: mockPayable.emissionDate.toISOString(),
          assignor: mockPayable.assignorId,
        },
        assignor: {
          id: mockAssignor.id,
          document: mockAssignor.document,
          email: mockAssignor.email,
          phone: mockAssignor.phone,
          name: mockAssignor.name,
        },
      };

      const expectedResponse = {
        payable: {
          id: mockPayable.id,
          value: mockPayable.value,
          emissionDate: mockPayable.emissionDate.toISOString(),
          assignor: mockPayable.assignorId,
        },
        assignor: {
          id: mockAssignor.id,
          document: mockAssignor.document,
          email: mockAssignor.email,
          phone: mockAssignor.phone,
          name: mockAssignor.name,
        },
      };

      mockIntegrationsService.createPayableWithAssignor.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.createPayable(createDto);

      expect(result).toEqual(expectedResponse);
      expect(
        mockIntegrationsService.createPayableWithAssignor,
      ).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getPayable', () => {
    it('should return a payable by id', async () => {
      const mockPayable = createMockPayable();
      mockPayableService.findById.mockResolvedValue(mockPayable);

      const result = await controller.getPayable({ id: mockPayable.id });

      expect(result).toEqual(mockPayable);
      expect(mockPayableService.findById).toHaveBeenCalledWith(mockPayable.id);
    });
  });

  describe('getAssignor', () => {
    it('should return an assignor by id', async () => {
      const mockAssignor = createMockAssignor();
      mockAssignorService.findById.mockResolvedValue(mockAssignor);

      const result = await controller.getAssignor({ id: mockAssignor.id });

      expect(result).toEqual(mockAssignor);
      expect(mockAssignorService.findById).toHaveBeenCalledWith(
        mockAssignor.id,
      );
    });
  });

  describe('updatePayable', () => {
    it('should update a payable successfully', async () => {
      const mockPayable = createMockPayable();
      const updateDto = { value: 2000 };
      const updatedPayable = { ...mockPayable, value: 2000 };

      mockPayableService.update.mockResolvedValue(updatedPayable);

      const result = await controller.updatePayable(
        { id: mockPayable.id },
        updateDto,
      );

      expect(result).toEqual(updatedPayable);
      expect(mockPayableService.update).toHaveBeenCalledWith(
        mockPayable.id,
        updateDto,
      );
    });
  });

  describe('updateAssignor', () => {
    it('should update an assignor successfully', async () => {
      const mockAssignor = createMockAssignor();
      const updateDto = { name: 'Updated Name' };
      const updatedAssignor = { ...mockAssignor, name: 'Updated Name' };

      mockAssignorService.update.mockResolvedValue(updatedAssignor);

      const result = await controller.updateAssignor(
        { id: mockAssignor.id },
        updateDto,
      );

      expect(result).toEqual(updatedAssignor);
      expect(mockAssignorService.update).toHaveBeenCalledWith(
        mockAssignor.id,
        updateDto,
      );
    });
  });

  describe('deletePayable', () => {
    it('should delete a payable successfully', async () => {
      const mockPayable = createMockPayable();
      mockPayableService.delete.mockResolvedValue(undefined);

      await controller.deletePayable({ id: mockPayable.id });

      expect(mockPayableService.delete).toHaveBeenCalledWith(mockPayable.id);
    });
  });

  describe('deleteAssignor', () => {
    it('should delete an assignor successfully', async () => {
      const mockAssignor = createMockAssignor();
      mockAssignorService.delete.mockResolvedValue(undefined);

      await controller.deleteAssignor({ id: mockAssignor.id });

      expect(mockAssignorService.delete).toHaveBeenCalledWith(mockAssignor.id);
    });
  });

  describe('createBatchPayables', () => {
    it('should create batch payables successfully', async () => {
      const mockPayable = createMockPayable();
      const createBatchDto = {
        payables: [
          {
            id: mockPayable.id,
            value: mockPayable.value,
            emissionDate: mockPayable.emissionDate.toISOString(),
            assignor: mockPayable.assignorId,
          },
          {
            id: 'batch-payable-2',
            value: 2000,
            emissionDate: '2024-01-16',
            assignor: mockPayable.assignorId,
          },
        ],
      };

      const expectedResponse = {
        batchId: 'batch-123',
        totalPayables: 2,
        status: 'queued',
        message: 'Lote recebido e adicionado à fila para processamento',
        createdAt: new Date(),
      };

      mockIntegrationsService.createBatchPayables.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.createBatchPayables(createBatchDto);

      expect(result).toEqual(expectedResponse);
      expect(mockIntegrationsService.createBatchPayables).toHaveBeenCalledWith(
        createBatchDto,
      );
    });
  });

  describe('getDLQMessages', () => {
    it('should return DLQ messages successfully', async () => {
      const mockMessages = [
        {
          content: { batchId: 'test-123', payables: [] },
          headers: { 'x-retry-count': 4 },
          timestamp: Date.now(),
        },
      ];

      mockQueueService.getDLQMessages.mockResolvedValue(mockMessages);

      const result = await controller.getDLQMessages();

      expect(result).toEqual({
        count: 1,
        messages: mockMessages,
      });
      expect(mockQueueService.getDLQMessages).toHaveBeenCalledWith(100);
    });

    it('should return empty list when no messages in DLQ', async () => {
      mockQueueService.getDLQMessages.mockResolvedValue([]);

      const result = await controller.getDLQMessages();

      expect(result).toEqual({
        count: 0,
        messages: [],
      });
    });
  });
});
