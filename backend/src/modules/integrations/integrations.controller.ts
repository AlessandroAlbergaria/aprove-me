import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, IntegrationResponseDto } from './dto';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';
import { UpdatePayableDto } from '../payable/dto';
import { UpdateAssignorDto } from '../assignor/dto';
import { UuidParamDto } from '../../common/dto';

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
  async getPayable(@Param() params: UuidParamDto) {
    return this.payableService.findById(params.id);
  }

  @Get('assignor/:id')
  async getAssignor(@Param() params: UuidParamDto) {
    return this.assignorService.findById(params.id);
  }

  @Put('payable/:id')
  async updatePayable(
    @Param() params: UuidParamDto,
    @Body() updatePayableDto: UpdatePayableDto,
  ) {
    return this.payableService.update(params.id, updatePayableDto);
  }

  @Put('assignor/:id')
  async updateAssignor(
    @Param() params: UuidParamDto,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorService.update(params.id, updateAssignorDto);
  }

  @Delete('payable/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayable(@Param() params: UuidParamDto) {
    await this.payableService.delete(params.id);
  }

  @Delete('assignor/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssignor(@Param() params: UuidParamDto) {
    await this.assignorService.delete(params.id);
  }
}
