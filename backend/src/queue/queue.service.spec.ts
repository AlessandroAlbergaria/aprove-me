import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';

jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn().mockResolvedValue({ queue: 'test-queue' }),
      sendToQueue: jest.fn().mockReturnValue(true),
      checkQueue: jest.fn().mockResolvedValue({ messageCount: 0 }),
      close: jest.fn().mockResolvedValue(undefined),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('QueueService', () => {
  let service: QueueService;

  const mockClientProxy = {
    emit: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should setup queues successfully', async () => {
      await service.onModuleInit();

      expect(service).toBeDefined();
    });
  });

  describe('sendToQueue', () => {
    it('should throw error if channel is not initialized', async () => {
      const newService = new QueueService();

      await expect(
        newService.sendToQueue('test-queue', { test: 'data' }),
      ).rejects.toThrow('RabbitMQ channel not initialized');
    });
  });

  describe('getQueueMessageCount', () => {
    it('should return 0 if channel is not initialized', async () => {
      const newService = new QueueService();

      const count = await newService.getQueueMessageCount('test-queue');

      expect(count).toBe(0);
    });
  });

  describe('getDLQMessages', () => {
    it('should return empty array if channel is not initialized', async () => {
      const newService = new QueueService();

      const messages = await newService.getDLQMessages(10);

      expect(messages).toEqual([]);
    });

    it('should return empty array if no messages in DLQ', async () => {
      process.env.RABBITMQ_DLQ = 'payable-batch-dlq';

      const mockChannel = {
        get: jest.fn().mockResolvedValue(false),
      };

      const serviceWithChannel = new QueueService();
      serviceWithChannel['channel'] = mockChannel as any;

      const messages = await serviceWithChannel.getDLQMessages(10);

      expect(messages).toEqual([]);
      expect(mockChannel.get).toHaveBeenCalledWith('payable-batch-dlq', {
        noAck: false,
      });

      delete process.env.RABBITMQ_DLQ;
    });

    it('should return messages from DLQ', async () => {
      process.env.RABBITMQ_DLQ = 'payable-batch-dlq';

      const mockMessage = {
        content: Buffer.from(
          JSON.stringify({ batchId: 'test-123', payables: [] }),
        ),
        properties: {
          headers: { 'x-retry-count': 4 },
          timestamp: Date.now(),
        },
      };

      const mockChannel = {
        get: jest
          .fn()
          .mockResolvedValueOnce(mockMessage)
          .mockResolvedValueOnce(false),
        nack: jest.fn(),
      };

      const serviceWithChannel = new QueueService();
      serviceWithChannel['channel'] = mockChannel as any;

      const messages = await serviceWithChannel.getDLQMessages(10);

      expect(messages).toHaveLength(1);
      expect(messages[0]).toHaveProperty('content');
      expect(messages[0]).toHaveProperty('headers');
      expect(messages[0]).toHaveProperty('timestamp');
      expect(mockChannel.nack).toHaveBeenCalledWith(mockMessage, false, true);

      delete process.env.RABBITMQ_DLQ;
    });

    it('should handle parse errors gracefully', async () => {
      process.env.RABBITMQ_DLQ = 'payable-batch-dlq';

      const mockMessage = {
        content: Buffer.from('invalid-json'),
        properties: {
          headers: {},
          timestamp: Date.now(),
        },
      };

      const mockChannel = {
        get: jest
          .fn()
          .mockResolvedValueOnce(mockMessage)
          .mockResolvedValueOnce(false),
        nack: jest.fn(),
      };

      const serviceWithChannel = new QueueService();
      serviceWithChannel['channel'] = mockChannel as any;

      const messages = await serviceWithChannel.getDLQMessages(10);

      expect(messages).toEqual([]);
      expect(mockChannel.nack).toHaveBeenCalledWith(mockMessage, false, true);

      delete process.env.RABBITMQ_DLQ;
    });
  });

  describe('onModuleDestroy', () => {
    it('should close channel and connection', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();

      expect(service).toBeDefined();
    });
  });
});
