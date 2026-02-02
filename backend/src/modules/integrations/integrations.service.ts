import { Injectable } from '@nestjs/common';
import { CreateIntegrationDto, IntegrationResponseDto } from './dto';

@Injectable()
export class IntegrationsService {
  async createPayableWithAssignor(
    createIntegrationDto: CreateIntegrationDto,
  ): Promise<IntegrationResponseDto> {
    const { payable, assignor } = createIntegrationDto;

    return {
      payable: {
        id: payable.id,
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignor: payable.assignor,
      },
      assignor: {
        id: assignor.id,
        document: assignor.document,
        email: assignor.email,
        phone: assignor.phone,
        name: assignor.name,
      },
    };
  }
}
