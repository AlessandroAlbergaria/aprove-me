import { IsUUID, IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator';

export class CreatePayableDto {
  @IsUUID('4', { message: 'id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  id: string;

  @IsNumber({}, { message: 'value deve ser um número' })
  @Min(0, { message: 'value deve ser um número positivo' })
  @IsNotEmpty({ message: 'value é obrigatório' })
  value: number;

  @IsDateString({}, { message: 'emissionDate deve ser uma data válida' })
  @IsNotEmpty({ message: 'emissionDate é obrigatório' })
  emissionDate: string;

  @IsUUID('4', { message: 'assignor deve ser um UUID válido' })
  @IsNotEmpty({ message: 'assignor é obrigatório' })
  assignor: string;
}
