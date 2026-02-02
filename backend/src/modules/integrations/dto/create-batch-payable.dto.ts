import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { CreatePayableDto } from '../../payable/dto';

export class CreateBatchPayableDto {
  @ApiProperty({
    description: 'Array de payables para processamento em lote',
    type: [CreatePayableDto],
    example: [
      {
        value: 1000.5,
        emissionDate: '2024-01-15',
        assignor: '123e4567-e89b-12d3-a456-426614174000',
      },
      {
        value: 2500.0,
        emissionDate: '2024-01-16',
        assignor: '123e4567-e89b-12d3-a456-426614174000',
      },
    ],
    minItems: 1,
    maxItems: 10000,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'O lote deve conter pelo menos 1 payable' })
  @ArrayMaxSize(10000, {
    message: 'O lote não pode conter mais de 10.000 payables',
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePayableDto)
  payables: CreatePayableDto[];
}
