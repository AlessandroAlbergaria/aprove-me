import { ApiProperty } from '@nestjs/swagger';

export class BatchResponseDto {
  @ApiProperty({
    description: 'ID do lote para tracking',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  batchId: string;

  @ApiProperty({
    description: 'Quantidade de payables no lote',
    example: 1500,
  })
  totalPayables: number;

  @ApiProperty({
    description: 'Status do lote',
    example: 'queued',
    enum: ['queued', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Lote recebido e adicionado à fila para processamento',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de criação',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;
}
