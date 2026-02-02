import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './queue.service';
import { PayableBatchProcessor } from './payable-batch.processor';
import { PayableModule } from '../modules/payable/payable.module';
import { AssignorModule } from '../modules/assignor/assignor.module';
import { MailModule } from '../mail';

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
    PayableModule,
    AssignorModule,
    MailModule,
  ],
  providers: [QueueService, PayableBatchProcessor],
  exports: [ClientsModule, QueueService, PayableBatchProcessor],
})
export class QueueModule {}
