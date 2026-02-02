import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: process.env.RABBITMQ_QUEUE as string,
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': process.env.RABBITMQ_DLQ as string,
            },
          },
        },
      },
    ]),
  ],
  providers: [QueueService],
  exports: [ClientsModule, QueueService],
})
export class QueueModule {}
