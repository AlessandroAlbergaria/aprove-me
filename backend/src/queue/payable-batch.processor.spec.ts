import { Test, TestingModule } from '@nestjs/testing';
import { PayableBatchProcessor } from './payable-batch.processor';
import { PayableService } from '../modules/payable/payable.service';
import { AssignorService } from '../modules/assignor/assignor.service';
import { MailService } from '../mail';

jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      prefetch: jest.fn().mockResolvedValue(undefined),
      consume: jest.fn().mockResolvedValue(undefined),
      ack: jest.fn(),
      nack: jest.fn(),
      sendToQueue: jest.fn().mockReturnValue(true),
      close: jest.fn().mockResolvedValue(undefined),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('PayableBatchProcessor', () => {
  let processor: PayableBatchProcessor;

  const mockPayableService = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockAssignorService = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockMailService = {
    sendBatchCompletedEmail: jest.fn().mockResolvedValue(undefined),
    sendDLQNotificationEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableBatchProcessor,
        {
          provide: PayableService,
          useValue: mockPayableService,
        },
        {
          provide: AssignorService,
          useValue: mockAssignorService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    processor = module.get<PayableBatchProcessor>(PayableBatchProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('processBatch', () => {
    it('should process batch successfully', async () => {
      const batchMessage = {
        batchId: 'batch-123',
        payables: [
          {
            id: 'payable-1',
            value: 1000,
            emissionDate: '2024-01-15',
            assignor: 'assignor-1',
          },
          {
            id: 'payable-2',
            value: 2000,
            emissionDate: '2024-01-16',
            assignor: 'assignor-1',
          },
        ],
        totalPayables: 2,
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      mockAssignorService.findById.mockResolvedValue({
        id: 'assignor-1',
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      });

      mockPayableService.create.mockResolvedValue({
        id: 'payable-1',
        value: 1000,
        emissionDate: new Date('2024-01-15'),
        assignorId: 'assignor-1',
      });

      const stats = await processor['processBatch'](batchMessage);

      expect(stats.batchId).toBe('batch-123');
      expect(stats.total).toBe(2);
      expect(stats.processed).toBe(2);
      expect(stats.succeeded).toBe(2);
      expect(stats.failed).toBe(0);
      expect(stats.errors).toHaveLength(0);
      expect(mockPayableService.create).toHaveBeenCalledTimes(2);
    });

    it('should handle errors and continue processing', async () => {
      const batchMessage = {
        batchId: 'batch-456',
        payables: [
          {
            id: 'payable-1',
            value: 1000,
            emissionDate: '2024-01-15',
            assignor: 'assignor-1',
          },
          {
            id: 'payable-2',
            value: 2000,
            emissionDate: '2024-01-16',
            assignor: 'assignor-1',
          },
        ],
        totalPayables: 2,
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      mockAssignorService.findById.mockResolvedValue({
        id: 'assignor-1',
        document: '12345678901',
        email: 'test@example.com',
        phone: '11999999999',
        name: 'Test Assignor',
      });

      mockPayableService.create
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValueOnce({
          id: 'payable-2',
          value: 2000,
          emissionDate: new Date('2024-01-16'),
          assignorId: 'assignor-1',
        });

      const stats = await processor['processBatch'](batchMessage);

      expect(stats.batchId).toBe('batch-456');
      expect(stats.total).toBe(2);
      expect(stats.processed).toBe(2);
      expect(stats.succeeded).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.errors).toHaveLength(1);
      expect(stats.errors[0]).toEqual({
        payableId: 'payable-1',
        error: 'Database error',
      });
    });

    it('should handle assignor not found error', async () => {
      const batchMessage = {
        batchId: 'batch-789',
        payables: [
          {
            id: 'payable-1',
            value: 1000,
            emissionDate: '2024-01-15',
            assignor: 'non-existent-assignor',
          },
        ],
        totalPayables: 1,
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      mockAssignorService.findById.mockRejectedValue(
        new Error('Assignor not found'),
      );

      const stats = await processor['processBatch'](batchMessage);

      expect(stats.batchId).toBe('batch-789');
      expect(stats.total).toBe(1);
      expect(stats.processed).toBe(1);
      expect(stats.succeeded).toBe(0);
      expect(stats.failed).toBe(1);
      expect(stats.errors[0].error).toBe('Assignor not found');
      expect(mockPayableService.create).not.toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close connections gracefully', async () => {
      await processor.onModuleDestroy();

      expect(processor).toBeDefined();
    });
  });
});
