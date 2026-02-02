export const mockChannel = {
  assertQueue: jest.fn().mockResolvedValue({ queue: 'test-queue' }),
  sendToQueue: jest.fn().mockReturnValue(true),
  checkQueue: jest.fn().mockResolvedValue({ messageCount: 0 }),
  close: jest.fn().mockResolvedValue(undefined),
};

export const mockConnection = {
  createChannel: jest.fn().mockResolvedValue(mockChannel),
  close: jest.fn().mockResolvedValue(undefined),
};

export const mockConnect = jest.fn().mockResolvedValue(mockConnection);

jest.mock('amqplib', () => ({
  connect: mockConnect,
}));
