import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsObject } from 'class-validator';
import { CreatePayableDto } from '../../payable/dto';
import { CreateAssignorDto } from '../../assignor/dto';

export class CreateIntegrationDto {
  @ValidateNested()
  @Type(() => CreatePayableDto)
  @IsObject({ message: 'payable deve ser um objeto válido' })
  @IsNotEmpty({ message: 'payable é obrigatório' })
  payable: CreatePayableDto;

  @ValidateNested()
  @Type(() => CreateAssignorDto)
  @IsObject({ message: 'assignor deve ser um objeto válido' })
  @IsNotEmpty({ message: 'assignor é obrigatório' })
  assignor: CreateAssignorDto;
}
