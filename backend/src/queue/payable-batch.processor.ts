import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect } from 'amqplib';
import { PayableService } from '../modules/payable/payable.service';
import { AssignorService } from '../modules/assignor/assignor.service';
import { MailService } from '../mail';

interface BatchMessage {
  batchId: string;
  payables: Array<{
    id: string;
    value: number;
    emissionDate: string;
    assignor: string;
  }>;
  totalPayables: number;
  createdAt: string;
}

interface BatchStats {
  batchId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ payableId: string; error: string }>;
}

@Injectable()
export class PayableBatchProcessor implements OnModuleInit {
  private readonly logger = new Logger(PayableBatchProcessor.name);
  private connection: Awaited<ReturnType<typeof connect>> | null = null;
  private channel: Awaited<
    ReturnType<Awaited<ReturnType<typeof connect>>['createChannel']>
  > | null = null;

  constructor(
    private readonly payableService: PayableService,
    private readonly assignorService: AssignorService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    try {
      await this.startConsumer();
    } catch (error) {
      this.logger.warn('RabbitMQ not available, batch processor disabled');
      this.logger.warn('This is expected when running without Docker');
    }
  }

  private async startConsumer() {
    try {
      const rabbitMQUrl =
        process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
      const queueName = process.env.RABBITMQ_QUEUE || 'payable-batch';

      this.connection = await connect(rabbitMQUrl);
      this.channel = await this.connection.createChannel();

      const dlqName = process.env.RABBITMQ_DLQ || 'payable-batch-dlq';

      await this.channel.assertQueue(dlqName, {
        durable: true,
      });

      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': dlqName,
        },
      });

      await this.channel.prefetch(1);

      this.logger.log(`Starting consumer for queue: ${queueName}`);

      await this.channel.consume(
        queueName,
        async (msg) => {
          if (!msg) return;

          try {
            const content = msg.content.toString();
            const batchMessage: BatchMessage = JSON.parse(content);

            this.logger.log(
              `Processing batch ${batchMessage.batchId} with ${batchMessage.totalPayables} payables`,
            );

            const stats = await this.processBatch(batchMessage);

            this.logger.log(
              `Batch ${stats.batchId} completed: ${stats.succeeded} succeeded, ${stats.failed} failed`,
            );

            await this.mailService.sendBatchCompletedEmail(stats);

            this.channel?.ack(msg);
          } catch (error) {
            this.logger.error('Error processing message', error);

            const retryCount =
              (msg.properties.headers?.['x-retry-count'] || 0) + 1;

            if (retryCount >= 4) {
              this.logger.warn(
                `Message exceeded retry limit (${retryCount}), moving to DLQ`,
              );

              try {
                const content = msg.content.toString();
                const batchMessage: BatchMessage = JSON.parse(content);
                await this.mailService.sendDLQNotificationEmail(
                  batchMessage.batchId,
                  'batch-message',
                  error instanceof Error ? error.message : 'Unknown error',
                );
              } catch (emailError) {
                this.logger.error(
                  'Failed to send DLQ notification email',
                  emailError,
                );
              }

              this.channel?.nack(msg, false, false);
            } else {
              const delayMs = Math.pow(2, retryCount - 1) * 1000;
              this.logger.log(
                `Retrying message (attempt ${retryCount}/4) after ${delayMs}ms`,
              );

              if (this.channel) {
                await this.channel.sendToQueue(queueName, msg.content, {
                  headers: {
                    ...msg.properties.headers,
                    'x-retry-count': retryCount,
                    'x-delay': delayMs,
                  },
                  expiration: delayMs.toString(),
                });
              }

              this.channel?.ack(msg);
            }
          }
        },
        { noAck: false },
      );

      this.logger.log('Consumer started successfully');
    } catch (error) {
      this.logger.error('Failed to start consumer', error);
      throw error;
    }
  }

  private async processBatch(batchMessage: BatchMessage): Promise<BatchStats> {
    const stats: BatchStats = {
      batchId: batchMessage.batchId,
      total: batchMessage.totalPayables,
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [],
    };

    for (const payableData of batchMessage.payables) {
      try {
        await this.assignorService.findById(payableData.assignor);

        await this.payableService.create({
          id: payableData.id,
          value: payableData.value,
          emissionDate: payableData.emissionDate,
          assignor: payableData.assignor,
        });

        stats.succeeded++;
        this.logger.debug(`Payable ${payableData.id} created successfully`);
      } catch (error) {
        stats.failed++;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        stats.errors.push({
          payableId: payableData.id,
          error: errorMessage,
        });
        this.logger.error(`Failed to create payable ${payableData.id}`, error);
      } finally {
        stats.processed++;
      }
    }

    return stats;
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('Consumer connection closed');
    } catch (error) {
      this.logger.error('Error closing consumer connection', error);
    }
  }
}
