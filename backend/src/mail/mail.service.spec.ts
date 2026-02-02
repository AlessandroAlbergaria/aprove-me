import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;

  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendBatchCompletedEmail', () => {
    it('should send email for successful batch', async () => {
      const stats = {
        batchId: 'batch-123',
        total: 100,
        processed: 100,
        succeeded: 100,
        failed: 0,
        errors: [],
      };

      await service.sendBatchCompletedEmail(stats);

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockMailerService.sendMail.mock.calls[0][0];
      expect(callArgs.subject).toContain('✅');
      expect(callArgs.subject).toContain('batch-123');
      expect(callArgs.html).toBeDefined();
    });

    it('should send email for batch with failures', async () => {
      const stats = {
        batchId: 'batch-456',
        total: 100,
        processed: 100,
        succeeded: 95,
        failed: 5,
        errors: [
          { payableId: 'payable-1', error: 'Database error' },
          { payableId: 'payable-2', error: 'Validation error' },
        ],
      };

      await service.sendBatchCompletedEmail(stats);

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockMailerService.sendMail.mock.calls[0][0];
      expect(callArgs.subject).toContain('⚠️');
      expect(callArgs.subject).toContain('5 falha(s)');
      expect(callArgs.html).toContain('payable-1');
      expect(callArgs.html).toContain('Database error');
    });

    it('should handle email sending errors gracefully', async () => {
      mockMailerService.sendMail.mockRejectedValueOnce(
        new Error('SMTP connection failed'),
      );

      const stats = {
        batchId: 'batch-789',
        total: 10,
        processed: 10,
        succeeded: 10,
        failed: 0,
        errors: [],
      };

      await expect(
        service.sendBatchCompletedEmail(stats),
      ).resolves.not.toThrow();

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendDLQNotificationEmail', () => {
    it('should send DLQ notification email', async () => {
      await service.sendDLQNotificationEmail(
        'batch-123',
        'payable-456',
        'Assignor not found',
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockMailerService.sendMail.mock.calls[0][0];
      expect(callArgs.subject).toContain('🚨');
      expect(callArgs.subject).toContain('payable-456');
      expect(callArgs.html).toContain('batch-123');
      expect(callArgs.html).toContain('Assignor not found');
    });

    it('should handle DLQ email errors gracefully', async () => {
      mockMailerService.sendMail.mockRejectedValueOnce(
        new Error('Email service unavailable'),
      );

      await expect(
        service.sendDLQNotificationEmail('batch-123', 'payable-456', 'Error'),
      ).resolves.not.toThrow();

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
    });
  });
});
