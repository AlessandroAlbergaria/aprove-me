import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableDto {
  @ApiProperty({
    description: 'Identificação única do recebível (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  id: string;

  @ApiProperty({
    description: 'Valor do recebível em reais',
    example: 1500.5,
    minimum: 0,
  })
  @IsNumber({}, { message: 'value deve ser um número' })
  @Min(0, { message: 'value deve ser um número positivo' })
  @IsNotEmpty({ message: 'value é obrigatório' })
  value: number;

  @ApiProperty({
    description: 'Data de emissão do recebível (ISO 8601)',
    example: '2026-02-02T00:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'emissionDate deve ser uma data válida' })
  @IsNotEmpty({ message: 'emissionDate é obrigatório' })
  emissionDate: string;

  @ApiProperty({
    description: 'ID do cedente associado ao recebível (UUID v4)',
    example: '987fcdeb-51a2-43d7-b123-123456789abc',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'assignor deve ser um UUID válido' })
  @IsNotEmpty({ message: 'assignor é obrigatório' })
  assignor: string;
}
