import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, IntegrationResponseDto } from './dto';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('payable')
  @HttpCode(HttpStatus.CREATED)
  async createPayable(
    @Body() createIntegrationDto: CreateIntegrationDto,
  ): Promise<IntegrationResponseDto> {
    return this.integrationsService.createPayableWithAssignor(
      createIntegrationDto,
    );
  }
}
