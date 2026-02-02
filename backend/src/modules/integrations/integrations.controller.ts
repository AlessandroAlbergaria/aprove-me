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

  @Put('payable/:id')
  async updatePayable(
    @Param('id') id: string,
    @Body() updatePayableDto: UpdatePayableDto,
  ) {
    return this.payableService.update(id, updatePayableDto);
  }

  @Put('assignor/:id')
  async updateAssignor(
    @Param('id') id: string,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorService.update(id, updateAssignorDto);
  }

  @Delete('payable/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayable(@Param('id') id: string) {
    await this.payableService.delete(id);
  }

  @Delete('assignor/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssignor(@Param('id') id: string) {
    await this.assignorService.delete(id);
  }
}
