import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  CreateIntegrationDto,
  IntegrationResponseDto,
  CreateBatchPayableDto,
  BatchResponseDto,
} from './dto';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';
import { PrismaService } from '../../database';
import { QueueService } from '../../queue';
import { randomUUID } from 'crypto';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly payableService: PayableService,
    private readonly assignorService: AssignorService,
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async createPayableWithAssignor(
    createIntegrationDto: CreateIntegrationDto,
  ): Promise<IntegrationResponseDto> {
    const { payable, assignor } = createIntegrationDto;

    if (payable.assignor !== assignor.id) {
      throw new BadRequestException(
        'O ID do assignor no payable deve corresponder ao ID do assignor fornecido',
      );
    }

    return this.prisma.$transaction(async () => {
      const createdAssignor = await this.assignorService.create(assignor);
      const createdPayable = await this.payableService.create(payable);

      return {
        payable: {
          id: createdPayable.id,
          value: createdPayable.value,
          emissionDate: createdPayable.emissionDate.toISOString(),
          assignor: createdPayable.assignorId,
        },
        assignor: {
          id: createdAssignor.id,
          document: createdAssignor.document,
          email: createdAssignor.email,
          phone: createdAssignor.phone,
          name: createdAssignor.name,
        },
      };
    });
  }

  async createBatchPayables(
    createBatchDto: CreateBatchPayableDto,
  ): Promise<BatchResponseDto> {
    const batchId = randomUUID();
    const queueName = process.env.RABBITMQ_QUEUE || 'payable-batch';

    this.logger.log(
      `Creating batch ${batchId} with ${createBatchDto.payables.length} payables`,
    );

    try {
      await this.queueService.sendToQueue(queueName, {
        batchId,
        payables: createBatchDto.payables,
        totalPayables: createBatchDto.payables.length,
        createdAt: new Date().toISOString(),
      });

      this.logger.log(`Batch ${batchId} successfully queued`);

      return {
        batchId,
        totalPayables: createBatchDto.payables.length,
        status: 'queued',
        message: 'Lote recebido e adicionado à fila para processamento',
        createdAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to queue batch ${batchId}`, error);
      throw new BadRequestException('Falha ao adicionar lote na fila');
    }
  }
}
