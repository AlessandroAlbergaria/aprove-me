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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import {
  CreateIntegrationDto,
  IntegrationResponseDto,
  CreateBatchPayableDto,
  BatchResponseDto,
} from './dto';
import { PayableService } from '../payable/payable.service';
import { AssignorService } from '../assignor/assignor.service';
import { UpdatePayableDto } from '../payable/dto';
import { UpdateAssignorDto } from '../assignor/dto';
import { UuidParamDto } from '../../common/dto';
import { QueueService } from '../../queue/queue.service';

@ApiTags('integrations')
@ApiBearerAuth('JWT-auth')
@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly payableService: PayableService,
    private readonly assignorService: AssignorService,
    private readonly queueService: QueueService,
  ) {}

  @Post('payable')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar recebível com cedente',
    description: 'Cria um novo recebível e seu cedente associado',
  })
  @ApiBody({ type: CreateIntegrationDto })
  @ApiResponse({
    status: 201,
    description: 'Recebível e cedente criados com sucesso',
    type: IntegrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou expirado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Cedente com documento já cadastrado',
  })
  async createPayable(
    @Body() createIntegrationDto: CreateIntegrationDto,
  ): Promise<IntegrationResponseDto> {
    return this.integrationsService.createPayableWithAssignor(
      createIntegrationDto,
    );
  }

  @Post('payable/batch')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Criar lote de recebíveis',
    description:
      'Recebe um lote de até 10.000 recebíveis para processamento assíncrono via fila',
  })
  @ApiBody({ type: CreateBatchPayableDto })
  @ApiResponse({
    status: 202,
    description: 'Lote aceito e adicionado à fila para processamento',
    type: BatchResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou lote excede 10.000 itens',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou expirado',
  })
  async createBatchPayables(
    @Body() createBatchDto: CreateBatchPayableDto,
  ): Promise<BatchResponseDto> {
    return this.integrationsService.createBatchPayables(createBatchDto);
  }

  @Get('payable/batch/dlq')
  @ApiOperation({
    summary: 'Consultar Dead Letter Queue',
    description:
      'Lista os payables que falharam após 4 tentativas de processamento',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mensagens na DLQ',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'object' },
              headers: { type: 'object' },
              timestamp: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async getDLQMessages() {
    const messages = await this.queueService.getDLQMessages(100);
    return {
      count: messages.length,
      messages,
    };
  }

  @Get('payable/:id')
  @ApiOperation({
    summary: 'Buscar recebível por ID',
    description: 'Retorna os dados de um recebível específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recebível (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recebível encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é UUID)',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Recebível não encontrado',
  })
  async getPayable(@Param() params: UuidParamDto) {
    return this.payableService.findById(params.id);
  }

  @Get('assignor/:id')
  @ApiOperation({
    summary: 'Buscar cedente por ID',
    description: 'Retorna os dados de um cedente específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cedente (UUID)',
    example: '987fcdeb-51a2-43d7-b123-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Cedente encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (não é UUID)',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cedente não encontrado',
  })
  async getAssignor(@Param() params: UuidParamDto) {
    return this.assignorService.findById(params.id);
  }

  @Put('payable/:id')
  @ApiOperation({
    summary: 'Atualizar recebível',
    description: 'Atualiza os dados de um recebível existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recebível (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdatePayableDto })
  @ApiResponse({
    status: 200,
    description: 'Recebível atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Recebível não encontrado',
  })
  async updatePayable(
    @Param() params: UuidParamDto,
    @Body() updatePayableDto: UpdatePayableDto,
  ) {
    return this.payableService.update(params.id, updatePayableDto);
  }

  @Put('assignor/:id')
  @ApiOperation({
    summary: 'Atualizar cedente',
    description: 'Atualiza os dados de um cedente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cedente (UUID)',
    example: '987fcdeb-51a2-43d7-b123-123456789abc',
  })
  @ApiBody({ type: UpdateAssignorDto })
  @ApiResponse({
    status: 200,
    description: 'Cedente atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cedente não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Documento já cadastrado para outro cedente',
  })
  async updateAssignor(
    @Param() params: UuidParamDto,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorService.update(params.id, updateAssignorDto);
  }

  @Delete('payable/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir recebível',
    description: 'Remove um recebível do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recebível (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Recebível excluído com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Recebível não encontrado',
  })
  async deletePayable(@Param() params: UuidParamDto) {
    await this.payableService.delete(params.id);
  }

  @Delete('assignor/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir cedente',
    description: 'Remove um cedente e todos os seus recebíveis do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cedente (UUID)',
    example: '987fcdeb-51a2-43d7-b123-123456789abc',
  })
  @ApiResponse({
    status: 204,
    description: 'Cedente excluído com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cedente não encontrado',
  })
  async deleteAssignor(@Param() params: UuidParamDto) {
    await this.assignorService.delete(params.id);
  }
}
