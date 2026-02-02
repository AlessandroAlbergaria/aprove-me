import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { buildBatchCompletedHtml, buildDLQNotificationHtml } from './templates';

interface BatchStats {
  batchId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ payableId: string; error: string }>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendBatchCompletedEmail(stats: BatchStats): Promise<void> {
    try {
      const emailTo = process.env.EMAIL_TO_OPS || 'ops@aprove-me.com';

      const subject =
        stats.failed > 0
          ? `⚠️ Lote ${stats.batchId} processado com ${stats.failed} falha(s)`
          : `✅ Lote ${stats.batchId} processado com sucesso`;

      const html = buildBatchCompletedHtml(stats);

      await this.mailerService.sendMail({
        to: emailTo,
        subject,
        html,
      });

      this.logger.log(`Batch completion email sent for batch ${stats.batchId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send batch completion email for batch ${stats.batchId}`,
        error,
      );
    }
  }

  async sendDLQNotificationEmail(
    batchId: string,
    payableId: string,
    error: string,
  ): Promise<void> {
    try {
      const emailTo = process.env.EMAIL_TO_OPS || 'ops@aprove-me.com';

      const subject = `🚨 ALERTA: Payable ${payableId} movido para DLQ`;

      const html = buildDLQNotificationHtml(batchId, payableId, error);

      await this.mailerService.sendMail({
        to: emailTo,
        subject,
        html,
      });

      this.logger.log(`DLQ notification email sent for payable ${payableId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send DLQ notification email for payable ${payableId}`,
        error,
      );
    }
  }
}
