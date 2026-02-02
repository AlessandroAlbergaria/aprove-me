import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateIntegrationDto, IntegrationResponseDto } from './dto';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';
import { PrismaService } from '../../database';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly payableService: PayableService,
    private readonly assignorService: AssignorService,
    private readonly prisma: PrismaService,
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
}
