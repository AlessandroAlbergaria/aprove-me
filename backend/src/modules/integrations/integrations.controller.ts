import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, IntegrationResponseDto } from './dto';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly payableService: PayableService,
    private readonly assignorService: AssignorService,
  ) {}

  @Post('payable')
  @HttpCode(HttpStatus.CREATED)
  async createPayable(
    @Body() createIntegrationDto: CreateIntegrationDto,
  ): Promise<IntegrationResponseDto> {
    return this.integrationsService.createPayableWithAssignor(
      createIntegrationDto,
    );
  }

  @Get('payable/:id')
  async getPayable(@Param('id') id: string) {
    return this.payableService.findById(id);
  }

  @Get('assignor/:id')
  async getAssignor(@Param('id') id: string) {
    return this.assignorService.findById(id);
  }
}
