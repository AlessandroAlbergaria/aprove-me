import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { Public } from '../modules/auth/decorators/public.decorator';

@ApiTags('Mail (Test)')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Get('test/batch-success')
  @ApiOperation({
    summary: 'Testar email de lote processado com sucesso',
    description:
      'Envia um email de teste simulando um lote processado com 100% de sucesso',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com sucesso. Verifique sua inbox no Mailtrap.',
  })
  async testBatchSuccess() {
    await this.mailService.sendBatchCompletedEmail({
      batchId: 'test-batch-success-123',
      total: 100,
      processed: 100,
      succeeded: 100,
      failed: 0,
      errors: [],
    });

    return {
      message: 'Email de sucesso enviado! Verifique sua inbox no Mailtrap.',
      batchId: 'test-batch-success-123',
    };
  }

  @Public()
  @Get('test/batch-with-errors')
  @ApiOperation({
    summary: 'Testar email de lote processado com erros',
    description: 'Envia um email de teste simulando um lote com 5 falhas',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com sucesso. Verifique sua inbox no Mailtrap.',
  })
  async testBatchWithErrors() {
    await this.mailService.sendBatchCompletedEmail({
      batchId: 'test-batch-errors-456',
      total: 100,
      processed: 100,
      succeeded: 95,
      failed: 5,
      errors: [
        {
          payableId: 'payable-001',
          error: 'Assignor not found: assignor-xyz',
        },
        {
          payableId: 'payable-042',
          error: 'Database connection timeout',
        },
        {
          payableId: 'payable-073',
          error: 'Invalid value: must be greater than 0',
        },
        {
          payableId: 'payable-089',
          error: 'Assignor not found: assignor-abc',
        },
        {
          payableId: 'payable-095',
          error: 'Duplicate payable ID',
        },
      ],
    });

    return {
      message: 'Email com erros enviado! Verifique sua inbox no Mailtrap.',
      batchId: 'test-batch-errors-456',
    };
  }

  @Public()
  @Get('test/dlq-notification')
  @ApiOperation({
    summary: 'Testar email de notificação DLQ',
    description:
      'Envia um email de alerta crítico simulando um payable movido para DLQ',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com sucesso. Verifique sua inbox no Mailtrap.',
  })
  async testDLQNotification() {
    await this.mailService.sendDLQNotificationEmail(
      'test-batch-dlq-789',
      'payable-critical-999',
      'Assignor not found after 4 retry attempts. Assignor ID: assignor-missing-123',
    );

    return {
      message: 'Email de DLQ enviado! Verifique sua inbox no Mailtrap.',
      batchId: 'test-batch-dlq-789',
      payableId: 'payable-critical-999',
    };
  }

  @Public()
  @Get('test/all')
  @ApiOperation({
    summary: 'Testar todos os tipos de email',
    description:
      'Envia os 3 tipos de email de uma vez: sucesso, com erros e DLQ',
  })
  @ApiResponse({
    status: 200,
    description:
      '3 emails enviados com sucesso. Verifique sua inbox no Mailtrap.',
  })
  async testAllEmails() {
    await this.mailService.sendBatchCompletedEmail({
      batchId: 'test-all-success-001',
      total: 50,
      processed: 50,
      succeeded: 50,
      failed: 0,
      errors: [],
    });

    await this.mailService.sendBatchCompletedEmail({
      batchId: 'test-all-errors-002',
      total: 50,
      processed: 50,
      succeeded: 47,
      failed: 3,
      errors: [
        { payableId: 'payable-010', error: 'Assignor not found' },
        { payableId: 'payable-025', error: 'Invalid date format' },
        { payableId: 'payable-038', error: 'Database error' },
      ],
    });

    await this.mailService.sendDLQNotificationEmail(
      'test-all-dlq-003',
      'payable-dlq-999',
      'Critical error: Maximum retry attempts exceeded',
    );

    return {
      message:
        '3 emails enviados com sucesso! Verifique sua inbox no Mailtrap.',
      emails: [
        { type: 'success', batchId: 'test-all-success-001' },
        { type: 'with-errors', batchId: 'test-all-errors-002' },
        { type: 'dlq', batchId: 'test-all-dlq-003' },
      ],
    };
  }
}
