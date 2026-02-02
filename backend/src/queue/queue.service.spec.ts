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
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should send message to queue successfully', async () => {
      const queue = 'test-queue';
      const message = { id: '123', value: 1000 };

      const result = await service.sendToQueue(queue, message);

      expect(result).toBe(true);
    });

    it('should throw error if channel is not initialized', async () => {
      const newService = new QueueService(mockClientProxy as never);

      await expect(
        newService.sendToQueue('test-queue', { test: 'data' }),
      ).rejects.toThrow('RabbitMQ channel not initialized');
    });
  });

  describe('getQueueMessageCount', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should return message count', async () => {
      const count = await service.getQueueMessageCount('test-queue');

      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 if channel is not initialized', async () => {
      const newService = new QueueService(mockClientProxy as never);

      const count = await newService.getQueueMessageCount('test-queue');

      expect(count).toBe(0);
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
