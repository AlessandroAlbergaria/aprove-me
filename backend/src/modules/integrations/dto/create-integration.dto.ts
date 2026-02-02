import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePayableDto } from '../../payable/dto';
import { CreateAssignorDto } from '../../assignor/dto';

export class CreateIntegrationDto {
  @ApiProperty({
    description: 'Dados do recebível a ser criado',
    type: CreatePayableDto,
  })
  @ValidateNested()
  @Type(() => CreatePayableDto)
  @IsObject({ message: 'payable deve ser um objeto válido' })
  @IsNotEmpty({ message: 'payable é obrigatório' })
  payable: CreatePayableDto;

  @ApiProperty({
    description: 'Dados do cedente a ser criado',
    type: CreateAssignorDto,
  })
  @ValidateNested()
  @Type(() => CreateAssignorDto)
  @IsObject({ message: 'assignor deve ser um objeto válido' })
  @IsNotEmpty({ message: 'assignor é obrigatório' })
  assignor: CreateAssignorDto;
}
