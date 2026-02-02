import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { connect } from 'amqplib';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: Awaited<ReturnType<typeof connect>> | null = null;
  private channel: Awaited<
    ReturnType<Awaited<ReturnType<typeof connect>>['createChannel']>
  > | null = null;

  constructor() {}

  async onModuleInit() {
    try {
      await this.setupQueues();
    } catch (error) {
      this.logger.warn('RabbitMQ not available, queue service disabled');
      this.logger.warn('This is expected when running without Docker');
    }
  }

  private async setupQueues() {
    try {
      const rabbitMQUrl = process.env.RABBITMQ_URL;
      const queueName = process.env.RABBITMQ_QUEUE;
      const dlqName = process.env.RABBITMQ_DLQ;

      if (!rabbitMQUrl || !queueName || !dlqName) {
        this.logger.warn(
          'RabbitMQ configuration missing, skipping queue setup',
        );
        return;
      }

      this.connection = await connect(rabbitMQUrl);
      this.channel = await this.connection.createChannel();

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

      this.logger.log(`RabbitMQ queues configured: ${queueName}, ${dlqName}`);
    } catch (error) {
      this.logger.error('Failed to setup RabbitMQ queues', error);
      throw error;
    }
  }

  async sendToQueue(
    queue: string,
    message: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not initialized');
      }

      return this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );
    } catch (error) {
      this.logger.error(`Failed to send message to queue ${queue}`, error);
      throw error;
    }
  }

  async getQueueMessageCount(queue: string): Promise<number> {
    try {
      if (!this.channel) {
        return 0;
      }

      const queueInfo = await this.channel.checkQueue(queue);
      return queueInfo.messageCount;
    } catch (error) {
      this.logger.error(
        `Failed to get message count for queue ${queue}`,
        error,
      );
      return 0;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }
}
